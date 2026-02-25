import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BsBookmark } from "react-icons/bs";
import { FaBath, FaBed, FaRuler } from "react-icons/fa";
import {
  FiMapPin,
  FiHeart,
  FiSearch,
  FiFilter,
  FiX,
  FiImage,
} from "react-icons/fi";
import { MdOutlineRoofing, MdVerified } from "react-icons/md";
import { apiCall } from "../../../../../helpers/apicall/apiCall";

const PropertyGrid = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([6000, 10000000]);
  const [loading, setLoading] = useState(true);
  const [propertyList, setPropertyList] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    forRent: false,
    forSale: false,
    allProperty: true,
    residential: false,
    retail: false,
    offices: false,
    industrial: false,
    others: false,
    balcony: false,
    parking: false,
    spa: false,
    pool: false,
    restaurant: false,
    fitnessClub: false,
  });

  const [amenitiesList, setAmenitiesList] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    apiCall.get({
      route: "/amenities",
      onSuccess: (res) => {
        if (res.success) {
          setAmenitiesList(res.data || []);
        }
      },
    });
  }, []);

  const fetchProperties = (
    page = 1,
    overrideFilters = null,
    overrideAmenities = null,
    overridePrice = null,
    overrideBedrooms = null,
  ) => {
    setLoading(true);

    const activeFilters = overrideFilters || selectedFilters;
    const activeAmenities = overrideAmenities || selectedAmenities;
    const activePrice = overridePrice || priceRange;
    const activeBedrooms = overrideBedrooms || selectedBedrooms;

    let query = `/properties?page=${page}&limit=9`;

    if (activeBedrooms.length > 0) {
      query += `&bedrooms=${activeBedrooms.join(",")}`;
    }

    // Pricing filters
    if (activeFilters.forSale && !activeFilters.forRent) {
      query += `&minPrice=${activePrice[0]}&maxPrice=${activePrice[1]}`;
    } else if (activeFilters.forRent && !activeFilters.forSale) {
      query += `&minRent=${activePrice[0]}&maxRent=${activePrice[1]}`;
    } else {
      query += `&maxPrice=${activePrice[1]}`;
    }

    // Property Types
    let types = [];
    if (!activeFilters.allProperty) {
      if (activeFilters.residential) types.push("Residential");
      if (activeFilters.retail) types.push("Retail");
      if (activeFilters.offices) types.push("Offices");
      if (activeFilters.industrial) types.push("Industrial");
      if (activeFilters.others) types.push("Others");
    }
    if (types.length > 0) {
      query += `&propertyTypes=${types.join(",")}`;
    }

    // Amenities
    if (activeAmenities.length > 0) {
      query += `&amenityIds=${activeAmenities.join(",")}`;
    }

    apiCall.get({
      route: query,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setPropertyList(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching properties:", err);
      },
    });
  };

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key) => {
    let nextState;
    setSelectedFilters((prev) => {
      nextState = { ...prev, [key]: !prev[key] };

      // Mutual exclusivity for property types
      const propertySubTypes = [
        "residential",
        "retail",
        "offices",
        "industrial",
        "others",
      ];

      if (key === "allProperty" && nextState.allProperty) {
        // If "All Properties" is checked, uncheck sub-types
        propertySubTypes.forEach((type) => {
          nextState[type] = false;
        });
      } else if (propertySubTypes.includes(key) && nextState[key]) {
        // If a specific sub-type is checked, uncheck "All Properties"
        nextState.allProperty = false;
      }

      return nextState;
    });
    // Auto fetch properties (nextState is synchronously computed)
    setTimeout(() => {
      fetchProperties(1, nextState);
    }, 0);
  };

  const handleAmenityChange = (id) => {
    let nextState;
    setSelectedAmenities((prev) => {
      nextState = prev.includes(id)
        ? prev.filter((aId) => aId !== id)
        : [...prev, id];
      return nextState;
    });
    setTimeout(() => {
      fetchProperties(1, null, nextState);
    }, 0);
  };

  const handleBedroomChange = (bhkVal) => {
    let nextState;
    setSelectedBedrooms((prev) => {
      nextState = prev.includes(bhkVal)
        ? prev.filter((val) => val !== bhkVal)
        : [...prev, bhkVal];
      return nextState;
    });
    setTimeout(() => {
      fetchProperties(1, null, null, null, nextState);
    }, 0);
  };

  const getStatusInfo = (property) => {
    if (property.tenantType) return { text: "For Rent", color: "bg-green-500" };
    if (property.sellingPrice)
      return { text: "For Sale", color: "bg-orange-500" };
    return { text: "Available", color: "bg-blue-500" };
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col lg:flex-row relative">
      {/* Mobile Header & Filter Toggle */}
      <div className="lg:hidden p-4 bg-white border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">Properties</h2>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#EE2529] text-white rounded-lg text-sm font-medium hover:bg-[#D32F2F] transition-colors"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobile && showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Left Sidebar - Filters */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-4 border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:block lg:z-auto ${showFilters ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h3 className="text-lg font-bold text-gray-800">Filters</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <FiX size={20} />
          </button>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-6">
          Type Of Place
        </h3>

        {/* Custom Price Range */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Custom Price Range :
          </h4>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="range"
              min="0"
              max="100000000"
              step="10000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              onMouseUp={() => fetchProperties(1)}
              onTouchEnd={() => fetchProperties(1)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EE2529]"
            />
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>to</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Accessibility Features - For Rent/Sale */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Accessibility Features :
          </h4>
          <div className=" flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.forRent}
                onChange={() => handleFilterChange("forRent")}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">For Rent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.forSale}
                onChange={() => handleFilterChange("forSale")}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">For Sale</span>
            </label>
          </div>
        </div>

        {/* Properties Type */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Properties Type :
          </h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.allProperty}
                onChange={() => handleFilterChange("allProperty")}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">All Properties</span>
            </label>
            {[
              { label: "Residential", value: "residential" },
              { label: "Retail", value: "retail" },
              { label: "Offices", value: "offices" },
              { label: "Industrial", value: "industrial" },
              { label: "Others", value: "others" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters[option.value]}
                  onChange={() => handleFilterChange(option.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        {/* <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Bedrooms :
          </h4>
          <div className="flex flex-wrap gap-2">
            {["1 BHK", "2 BHK", "3 BHK", "4 & 5 BHK"].map((option) => (
              <button
                key={option}
                onClick={() => handleBedroomChange(option)}
                className={`px-3 py-1 text-xs border border-[#EE2529] rounded transition-colors ${
                  selectedBedrooms.includes(option)
                    ? "bg-[#EE2529] text-white"
                    : "text-[#EE2529] hover:bg-red-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div> */}

        {/* Accessibility Features - Amenities */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Accessibility Features :
          </h4>
          <div className="space-y-2">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity.amenityId}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.amenityId)}
                  onChange={() => handleAmenityChange(amenity.amenityId)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-600">
                  {amenity.amenityName}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={() => {
            setShowFilters(false);
            fetchProperties(1);
          }}
          className="w-full bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-2 px-4 rounded-lg transition mb-4"
        >
          Apply
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2">
        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">
                Fetching Real Estate Data...
              </p>
            </div>
          ) : propertyList.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-gray-400 font-bold uppercase tracking-widest">
                No Properties Found
              </p>
            </div>
          ) : (
            propertyList.map((property) => {
              const status = getStatusInfo(property);
              return (
                <div
                  key={property.propertyId}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {property.media?.[0]?.fileUrl ? (
                      <img
                        src={property.media[0].fileUrl}
                        alt={property.microMarket || "Property"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <FiImage size={40} className="mb-2 opacity-50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                          No Image Available
                        </span>
                      </div>
                    )}

                    {/* Verification Badge - Top Right */}
                    {(property.isVerified === "partial" ||
                      property.isVerified === "completed" ||
                      property.isVerified === "verified") && (
                      <div
                        className={`absolute top-4 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-l-md shadow-md z-10 flex items-center gap-1 ${
                          property.isVerified === "partial"
                            ? "bg-orange-500"
                            : "bg-green-600"
                        }`}
                      >
                        <MdVerified size={12} />
                        {property.isVerified === "partial"
                          ? "PARTIAL"
                          : "VERIFIED"}
                      </div>
                    )}

                    {/* Status Badge - Top Left */}
                    <div
                      className={`absolute top-4 left-4 ${status.color} text-white text-[8px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest`}
                    >
                      {status.text}
                    </div>

                    {/* Badge Container (e.g. MNC Client) - Bottom Left of Image */}
                    <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                      {property.tenantType && (
                        <div className="bg-[#FFF8E1] text-[#727272] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                          {property.tenantType} Client
                        </div>
                      )}
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        {property.propertyType}
                      </div>
                    </div>

                    {/* Favorite Icon */}
                    <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white text-gray-400 hover:text-[#EE2529] transition-all shadow-md">
                      <FiHeart className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate uppercase tracking-tight">
                        {property.microMarket ||
                          `Commercial Space ${property.propertyId.slice(0, 4)}`}
                      </h3>

                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-4 font-bold uppercase tracking-tighter">
                        <FiMapPin className="w-3.5 h-3.5 text-[#EE2529]" />
                        <span className="truncate">
                          {property.city}, {property.state}
                        </span>
                      </div>

                      {/* Details Row */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">
                              Cost:
                            </span>
                            <span className="text-[11px] font-black text-gray-800">
                              {formatPrice(property.sellingPrice)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">
                              Annual Rent:
                            </span>
                            <span className="text-[11px] font-black text-gray-800">
                              {formatPrice(property.totalMonthlyRent * 12)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-gray-400 uppercase">
                              Tenure Left:
                            </span>
                            <span className="text-[11px] font-black text-gray-800">
                              {property.leaseDurationYears || 0} Yrs
                            </span>
                          </div>
                        </div>

                        {/* ROI Badge */}
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex flex-col items-center justify-center min-w-[64px]">
                          <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">
                            ROI
                          </span>
                          <span className="text-sm font-black text-[#EE2529]">
                            {property.grossRentalYield || 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          navigate(
                            `/property/property-details/${property.propertyId}`,
                          )
                        }
                        className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 text-[11px] font-bold py-2.5 rounded-none transition-all uppercase tracking-widest"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-10">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => fetchProperties(pagination.currentPage - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-extrabold text-xs uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchProperties(i + 1)}
                  className={`w-10 h-10 rounded-lg font-black text-xs transition-all ${
                    pagination.currentPage === i + 1
                      ? "bg-[#EE2529] text-white shadow-lg shadow-red-200"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => fetchProperties(pagination.currentPage + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-extrabold text-xs uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyGrid;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiMoreVertical,
  FiArrowLeft,
  FiActivity,
  FiInfo,
  FiFileText,
  FiMap,
  FiHelpCircle,
  FiDownload,
  FiNavigation,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";
import {
  MdVerified,
  MdKingBed,
  MdBathtub,
  MdSquareFoot,
  MdApartment,
  MdStar,
  MdCheckCircle,
  MdBusiness,
  MdTrain,
  MdFlight,
  MdDirectionsCar,
  MdLocalParking,
  MdPool,
  MdSpa,
  MdFitnessCenter,
  MdRestaurant,
  MdPower,
  MdSecurity,
  MdArrowForward,
} from "react-icons/md";
import {
  FaRegBuilding,
  FaRegFileAlt,
  FaChartLine,
  FaMapMarkedAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { apiCall } from "../../../../../helpers/apicall/apiCall";

// --- Helper Components ---

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm font-bold text-gray-800 text-right">
      {value || "N/A"}
    </span>
  </div>
);

const PropertyDetailsCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-red-50 rounded-lg text-[#EE2529]">
            <Icon size={20} />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
          {title}
        </h3>
      </div>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
      active
        ? "border-[#EE2529] text-[#EE2529] bg-red-50"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [propertyList, setPropertyList] = useState([]); // For displaying list when no ID
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("property");
  const [activeFaq, setActiveFaq] = useState(null);
  console.log(property);
  useEffect(() => {
    console.log("PropertyDetails mounted. ID:", id);
    if (id && id !== "undefined" && id !== "null") {
      setLoading(true);
      apiCall.get({
        route: `/properties/${id}`,
        onSuccess: (res) => {
          console.log("PropertyDetails API Success:", res);
          setLoading(false);
          const data = res.data || res;
          setProperty(data);
        },
        onError: (err) => {
          console.error("PropertyDetails API Error:", err);
          setLoading(false);
          console.error("Error fetching property details:", err);
        },
      });
    } else {
      // Logic for NO ID: Fetch list of properties
      console.log("No ID provided. Fetching property list...");
      setLoading(true);
      apiCall.get({
        route: `/properties?limit=12`, // limit to 12 for the selection view
        onSuccess: (res) => {
          setLoading(false);
          if (res.success) {
            setPropertyList(res.data || []);
          }
        },
        onError: (err) => {
          setLoading(false);
          console.error("Error fetching property list:", err);
        },
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // --- No ID Case: Show List ---
  if (!id || id === "undefined" || id === "null") {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight mb-2">
              Select A Property
            </h1>
            <p className="text-gray-600">
              Please choose a property from the list below to view its
              comprehensive details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyList.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                No properties available to display.
              </div>
            ) : (
              propertyList.map((item) => (
                <div
                  key={item.propertyId}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative bg-gray-100">
                    <img
                      src={
                        item.media?.[0]?.fileUrl ||
                        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=300&fit=crop"
                      }
                      alt={item.microMarket}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest">
                      {item.propertyType}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                      {item.microMarket ||
                        `Commercial Space ${item.propertyId.slice(0, 4)}`}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                      <FiMapPin className="text-[#EE2529]" />
                      {item.city}, {item.state}
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">
                          Price
                        </p>
                        <p className="text-sm font-black text-gray-800">
                          ₹{item.sellingPrice} Cr
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          navigate(
                            `/property/property-details/${item.propertyId}`,
                          )
                        }
                        className="flex items-center gap-2 bg-[#EE2529] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#D32F2F] transition"
                      >
                        View <MdArrowForward />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Normal Case: Show Details (if property loaded) ---

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-500 font-bold uppercase tracking-widest">
          Property Not Found
        </p>
        <button
          onClick={() => navigate("/property/property-details")}
          className="px-6 py-2 bg-[#EE2529] text-white rounded-lg font-bold uppercase tracking-wider hover:bg-[#D32F2F] transition"
        >
          View All Properties
        </button>
      </div>
    );
  }

  // --- Content Renderers ---

  const renderPropertyContent = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Description */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="flex gap-2">
            <span className="bg-[#FFF8E1] text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <MdStar /> Premium Location
            </span>
            {property.tenantType && (
              <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {property.tenantType} Client
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-600 transition">
              <FiDownload size={14} /> Download Brochure
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-600 transition">
              <FiShare2 size={14} /> Share
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
          {property.microMarket || `${property.propertyType} Space`}
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          Excellent {property.propertyType} property located at {property.city},{" "}
          {property.state}. Offering a great investment opportunity with an
          expected ROI of {property.grossRentalYield || "N/A"}%. This property
          features {property.carpetArea} {property.carpetAreaUnit} of premium
          space in a {property.buildingGrade || "Grade A"} building.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Basic Information" icon={FiInfo}>
          <InfoRow label="Property ID" value={property.propertyId} />
          <InfoRow label="Property Type" value={property.propertyType} />
          <InfoRow label="Price" value={`₹${property.sellingPrice} Cr`} />
          <InfoRow label="Building Grade" value={property.buildingGrade} />
          <InfoRow
            label="Carpet Area"
            value={`${property.carpetArea} ${property.carpetAreaUnit}`}
          />
          <InfoRow label="Built Year" value={property.completionYear} />
          <InfoRow label="Ownership" value={property.ownershipType} />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Legal & Title" icon={FaRegFileAlt}>
          <InfoRow
            label="Lease Registration"
            value={property.leaseRegistration}
          />
          <InfoRow label="OC Status" value={property.occupancyCertificate} />
          <InfoRow label="Litigation" value={property.titleStatus} />
          <InfoRow label="RERA ID" value={property.reraId || "N/A"} />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Amenities" icon={MdFitnessCenter}>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MdLocalParking className="text-[#EE2529]" />
              <span className="font-semibold">
                {property.parkingFourWheeler} Car Parking
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MdPower className="text-[#EE2529]" />
              <span className="font-semibold">{property.powerBackup}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MdSecurity className="text-[#EE2529]" />
              <span className="font-semibold">24/7 Security</span>
            </div>
            {property.amenities?.map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <MdCheckCircle className="text-[#EE2529]" />
                <span className="font-semibold">{amenity.amenityName}</span>
              </div>
            ))}
          </div>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Infrastructure" icon={MdBusiness}>
          <InfoRow label="Total Floors" value={property.totalFloors} />
          <InfoRow label="Wing/Block" value={property.wing} />
          <InfoRow label="Lifts" value={property.numberOfLifts} />
          <InfoRow label="HVAC System" value={property.hvacType || "Central"} />
          <InfoRow
            label="Maintenance"
            value={property.caretaker?.caretakerName || "Professional"}
          />
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderLeaseContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight mb-2">
          Lease & Tenant Details
        </h2>
        <p className="text-gray-500 text-sm">
          Comprehensive breakdown of current lease terms and tenant information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Tenant Profile" icon={MdBusiness}>
          <InfoRow
            label="Tenant Name"
            value={property.tenantName || "Available"}
          />
          <InfoRow label="Industry" value={property.tenantIndustry || "N/A"} />
          <InfoRow label="Tenant Type" value={property.tenantType} />
          <InfoRow
            label="Occupancy Status"
            value={property.isActive ? "Occupied" : "Vacant"}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Financials" icon={FaChartLine}>
          <InfoRow
            label="Monthly Rent"
            value={`₹${property.totalMonthlyRent}`}
          />
          <InfoRow
            label="Security Deposit"
            value={`₹${property.securityDepositAmount} (${property.securityDepositMonths} Mos)`}
          />
          <InfoRow
            label="Rent / Sq.ft"
            value={`₹${property.rentPerSqftMonthly}`}
          />
          <InfoRow
            label="Maintenance"
            value={property.maintenanceCostsIncluded ? "Included" : "Excluded"}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Lease Terms" icon={FaRegFileAlt}>
          <InfoRow
            label="Start Date"
            value={new Date(property.leaseStartDate).toLocaleDateString()}
          />
          <InfoRow
            label="End Date"
            value={new Date(property.leaseEndDate).toLocaleDateString()}
          />
          <InfoRow
            label="Lock-in Period"
            value={`${property.lockInPeriodYears} Yrs ${property.lockInPeriodMonths} Months`}
          />
          <InfoRow
            label="Total Duration"
            value={`${property.leaseDurationYears} Yrs`}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Escalation" icon={FaChartLine}>
          <InfoRow
            label="Escalation Rate"
            value={`${property.annualEscalationPercent}%`}
          />
          <InfoRow
            label="Frequency"
            value={`Every ${property.escalationFrequencyYears} Years`}
          />
          <InfoRow label="Next Escalation" value="12 Aug 2026" />
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Gross Yield",
            value: `${property.grossRentalYield || 0}%`,
            icon: FiActivity,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Net Yield",
            value: `${property.netRentalYield || 0}%`,
            icon: FaChartLine,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "Payback Period",
            value: `${property.paybackPeriodYears || 0} Yrs`,
            icon: FiCalendar,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            label: "Annual Rent",
            value: `₹${property.annualGrossRent || 0} L`,
            icon: MdVerified,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition"
          >
            <div className={`p-3 rounded-xl mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Investment Summary" icon={FaChartLine}>
          <InfoRow
            label="Total Investment"
            value={`₹${property.sellingPrice} Cr`}
          />
          <InfoRow
            label="Gross Annual Rent"
            value={`₹${property.annualGrossRent} L`}
          />
          <InfoRow
            label="Annual Expenses"
            value={`₹${property.totalOperatingAnnualCosts} L`}
          />
          <div className="my-2 border-t border-dashed border-gray-200"></div>
          <div className="flex justify-between py-2 px-2 rounded-lg bg-green-50">
            <span className="text-xs font-bold text-green-700 uppercase">
              Net Annual Income
            </span>
            <span className="text-sm font-black text-green-700">
              ₹{property.netAnnualIncome} L
            </span>
          </div>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Annual Expenses" icon={FiInfo}>
          <InfoRow
            label="Property Tax"
            value={`₹${property.propertyTaxAnnual} L`}
          />
          <InfoRow label="Insurance" value={`₹${property.insuranceAnnual} L`} />
          <InfoRow
            label="Maintenance"
            value={`₹${property.maintenanceAmount} L`}
          />
          <InfoRow label="Mgmt Fees" value="₹0.5 L" />
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderLocationContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-80 relative group">
        {/* Placeholder Map - In real app insert Google Maps Iframe or Component */}
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <FaMapMarkedAlt className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              Interactive Map View
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {property.city}, {property.state}
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg max-w-xs">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm mb-1">
            <FiMapPin className="text-[#EE2529]" /> {property.microMarket}
          </h4>
          <p className="text-xs text-gray-500 pl-6">
            {property.city}, {property.state}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Connectivity" icon={MdTrain}>
          <InfoRow label="Airport" value="12 km" />
          <InfoRow label="Metro Station" value="1.5 km" />
          <InfoRow label="Highway Access" value="200 m" />
          <InfoRow label="Bus Terminal" value="500 m" />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Demand Drivers" icon={MdBusiness}>
          <ul className="space-y-3 px-2">
            {[
              "Proximity to IT Parks",
              "High demand for Grade A Office",
              "Planned Metro Phase 2",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EE2529] mt-1.5"></span>
                {item}
              </li>
            ))}
          </ul>
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderFaqContent = () => (
    <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
      {[
        "Can we schedule a virtual tour?",
        "What are the property tax rates?",
        "Are there association fees?",
        "Lease renewal terms?",
      ].map((q, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <button
            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition"
          >
            <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              {q}
            </span>
            <FiHelpCircle
              className={`text-gray-400 transition-transform ${activeFaq === i ? "rotate-180 text-[#EE2529]" : ""}`}
            />
          </button>
          {activeFaq === i && (
            <div className="p-5 pt-0 bg-gray-50 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold text-gray-800 uppercase tracking-widest">
            Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-green-100 text-green-700 flex items-center gap-1`}
          >
            <MdVerified /> Verified
          </span>
          <span
            className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-blue-100 text-blue-700`}
          >
            {property?.status || "For Sale"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                <img
                  src={
                    property?.media?.[0]?.fileUrl ||
                    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  }
                  alt="Property"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 text-[#EE2529]">
                  <FiHeart className="fill-current" />
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiPhone className="text-[#EE2529]" /> Contact Agent
              </h3>
              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Have specific questions? Our property advisors are ready to
                  help you with viewing arrangements and negotiations.
                </p>
                <button className="w-full bg-[#EE2529] hover:bg-[#D32F2F] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-100 text-sm uppercase tracking-wider">
                  <FiPhone /> Call Now
                </button>
                <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                  <FiMessageSquare /> Message
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs & Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide">
                {[
                  { id: "property", label: "Property", icon: FaRegBuilding },
                  { id: "lease", label: "Lease", icon: FiFileText },
                  { id: "analytics", label: "Analytics", icon: FaChartLine },
                  { id: "location", label: "Location", icon: FiMapPin },
                  { id: "faqs", label: "FAQs", icon: FiHelpCircle },
                ].map((tab) => (
                  <TabButton
                    key={tab.id}
                    {...tab}
                    active={activeTab === tab.id}
                    onClick={setActiveTab}
                  />
                ))}
              </div>
            </div>

            <div className="min-h-[500px]">
              {activeTab === "property" && renderPropertyContent()}
              {activeTab === "lease" && renderLeaseContent()}
              {activeTab === "analytics" && renderAnalyticsContent()}
              {activeTab === "location" && renderLocationContent()}
              {activeTab === "faqs" && renderFaqContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;

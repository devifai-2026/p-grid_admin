import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiHome,
  FiActivity,
  FiExternalLink,
} from "react-icons/fi";
import { MdVerified } from "react-icons/md";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { formatPrice } from "../../../../../helpers/formatPrice";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(Boolean(id));
  const [customer, setCustomer] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Pick the correct property filter based on the user's role.
    const fetchCustomerProperties = (user) => {
      const userId = user.userId;
      const roleName = (user.roles?.[0]?.roleName || "").toLowerCase();
      const isBroker = roleName.includes("broker");
      const queryKey = isBroker ? "brokerId" : "ownerId";

      apiCall.get({
        route: `/properties?${queryKey}=${userId}`,
        onSuccess: (res) => {
          if (res.success) setProperties(res.data || []);
          setLoading(false);
        },
        onError: (err) => {
          console.error("Error fetching customer properties:", err);
          setLoading(false);
        },
      });
    };

    apiCall.get({
      route: `/admin/users/${id}`,
      onSuccess: (res) => {
        if (res.success && res.data) {
          setCustomer(res.data);
          fetchCustomerProperties(res.data);
        } else {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error("Error fetching customer details:", err);
        setLoading(false);
      },
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-10 h-10 border-2 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-50 to-slate-100 p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 mx-auto">
          <FiUser size={32} className="text-slate-200" />
        </div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Customer Not Found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#EE2529] text-white text-xs rounded-lg font-bold uppercase tracking-widest hover:bg-[#D32F2F] transition shadow-lg shadow-red-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fullName =
    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
    "Unknown User";
  const role = customer.roles?.[0]?.roleName || "Customer";
  const broker = customer.brokerProfile;

  const stats = [
    {
      icon: FiHome,
      label: "Total Properties",
      value: properties.length,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: MdVerified,
      label: "Verified",
      value: properties.filter(
        (p) => p.isVerified === "completed" || p.isVerified === "verified",
      ).length,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      icon: FiActivity,
      label: "Deals Closed",
      value:
        broker?.dealsClosed !== undefined && broker?.dealsClosed !== null
          ? broker.dealsClosed
          : "N/A",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-500 shadow-sm border border-slate-100 bg-white/80 active:scale-95"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 uppercase tracking-widest leading-none mb-1">
              Customer Profile
            </h1>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#EE2529] rounded-full animate-pulse" />
              Administrative Console
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 md:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={
                  broker?.profilePhoto ||
                  customer.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    fullName,
                  )}&background=EE2529&color=fff&size=512`
                }
                alt={fullName}
                className="w-24 h-24 rounded-full border-4 border-[#EE2529] object-cover bg-slate-100"
              />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                  {fullName}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-[#EE2529] text-white rounded-full text-xs font-bold uppercase tracking-widest">
                    {role}
                  </span>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      customer.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {customer.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EE2529] flex-shrink-0">
                  <FiMail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Email Address
                  </p>
                  <p className="text-slate-900 text-sm break-all">
                    {customer.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EE2529] flex-shrink-0">
                  <FiPhone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Phone Number
                  </p>
                  <p className="text-slate-900 text-sm">
                    {customer.mobileNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EE2529] flex-shrink-0">
                  <FiBriefcase size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    {broker ? "Company" : "RERA Registration"}
                  </p>
                  <p className="text-slate-900 text-sm break-all">
                    {broker?.companyName ||
                      customer.reraNumber ||
                      "N/A"}
                  </p>
                </div>
              </div>
              {broker?.locality && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#EE2529] flex-shrink-0">
                    <FiMapPin size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500 font-medium mb-1">
                      Locality
                    </p>
                    <p className="text-slate-900 text-sm">{broker.locality}</p>
                  </div>
                </div>
              )}
            </div>

            {broker?.specializations?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs text-slate-500 font-medium mb-2">
                  Specializations
                </p>
                <div className="flex flex-wrap gap-2">
                  {broker.specializations.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm p-6">
              <div
                className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Properties */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Properties ({properties.length})
            </h3>
          </div>

          {properties.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <FiHome size={40} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-bold uppercase tracking-widest">
                No Properties Found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <div
                  key={property.propertyId}
                  onClick={() =>
                    navigate(
                      `/property/property-details/${property.propertyId}`,
                    )
                  }
                  className="flex flex-col gap-3 group cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-xl bg-slate-100 h-48">
                    {property.media?.[0]?.fileUrl ? (
                      <img
                        src={property.media[0].fileUrl}
                        alt={property.microMarket || "Property"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <FiHome size={36} />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          property.isVerified === "completed" ||
                          property.isVerified === "verified"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {property.isVerified === "completed" ||
                        property.isVerified === "verified"
                          ? "Verified"
                          : "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg flex-1 border border-slate-100">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {property.microMarket || "Unspecified"}
                      </p>
                      <span className="text-xs font-bold text-[#EE2529] bg-red-50 px-2 py-1 rounded whitespace-nowrap">
                        {property.propertyType || "N/A"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                      <FiMapPin className="w-3 h-3" />{" "}
                      {[property.city, property.state]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                      <span className="text-slate-600">
                        Value:{" "}
                        <span className="font-semibold text-slate-900">
                          {formatPrice(property.sellingPrice)}
                        </span>
                      </span>
                      <FiExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#EE2529]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;

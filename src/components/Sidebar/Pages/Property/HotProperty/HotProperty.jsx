import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../../helpers/useUserStorage";
import PropertyCard from "../Common/PropertyCard";
import VerificationFilter from "../Common/VerificationFilter";
import { showSuccess, showError, confirmAction } from "../../../../../helpers/swalHelper";


const HotProperty = () => {
  const navigate = useNavigate();
  const { user } = useUserStorage();
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchHotProperties = (page = 1) => {
    setLoading(true);
    let route = `/get-hot-properties?page=${page}&limit=10`;
    if (verificationFilter !== "all") {
      const mappedFilter =
        verificationFilter === "verified" ? "completed" : verificationFilter;
      route += `&isVerified=${mappedFilter}`;
    }

    apiCall.get({
      route,
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
        console.error("Error fetching hot properties:", err);
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotProperties(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [verificationFilter]);

  const handleVerify = async (e, propertyId) => {
    e.stopPropagation();
    const isConfirmed = await confirmAction(
      "Verify Property?",
      "Are you sure you want to verify this property?",
      "Yes, verify it!"
    );
    if (!isConfirmed) return;

    apiCall.post({
      route: `/admin/properties/${propertyId}/verify`,
      onSuccess: (res) => {
        if (res.success) {
          showSuccess("Property verified successfully!");
          fetchHotProperties(pagination.currentPage); // Refresh list
        }
      },
      onError: (err) => {
        showError(err.message || "Failed to verify property");
      },
    });
  };


  const handleUnverify = async (e, propertyId) => {
    e.stopPropagation();
    const isConfirmed = await confirmAction(
      "Remove Verification?",
      "Are you sure you want to remove your verification from this property?",
      "Yes, remove it!"
    );
    if (!isConfirmed) return;

    apiCall.delete({
      route: `/admin/properties/${propertyId}/verify`,
      onSuccess: (res) => {
        if (res.success) {
          showSuccess("Verification removed successfully!");
          fetchHotProperties(pagination.currentPage); // Refresh list
        }
      },
      onError: (err) => {
        showError(err.message || "Failed to remove verification");
      },
    });
  };


  if (loading && propertyList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">
          Loading Hot Properties...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              Hot Properties
            </h1>
            <p className="text-gray-500 font-medium max-w-2xl">
              Experience our handpicked selection of the latest properties that
              have been recently updated in our ecosystem.
            </p>
          </div>
        </div>

        {/* Verification Filters */}
        <VerificationFilter
          currentFilter={verificationFilter}
          onFilterChange={setVerificationFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {propertyList.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <FiInfo size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-black uppercase tracking-widest">
                No {verificationFilter !== "all" ? verificationFilter : ""} hot
                properties found
              </p>
            </div>
          ) : (
            propertyList.map((item) => (
              <PropertyCard
                key={item.propertyId}
                item={item}
                user={user}
                onVerify={handleVerify}
                onUnverify={handleUnverify}
                onView={(id) => navigate(`/property/property-details/${id}`)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-10">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => fetchHotProperties(pagination.currentPage - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-extrabold text-xs uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchHotProperties(i + 1)}
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
              onClick={() => fetchHotProperties(pagination.currentPage + 1)}
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

export default HotProperty;

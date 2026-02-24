import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiMessageSquare,
  FiCalendar,
  FiUser,
  FiMapPin,
  FiSearch,
  FiFilter,
  FiChevronRight,
  FiHash,
} from "react-icons/fi";
import { MdOutlineNotes, MdVerified } from "react-icons/md";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../helpers/useUserStorage";

const PropertyNotes = () => {
  const navigate = useNavigate();
  const { user } = useUserStorage();
  const [loading, setLoading] = useState(true);
  const [notesData, setNotesData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const fetchNotes = (page = 1) => {
    setLoading(true);
    apiCall.get({
      route: `/notes/properties?page=${page}&limit=10`,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setNotesData(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching notes:", err);
      },
    });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && notesData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">
          Loading Property Notes...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <div className="p-2 bg-red-100 text-[#EE2529] rounded-xl">
                <MdOutlineNotes size={24} />
              </div>
              Property Communication Board
            </h1>
            <p className="text-gray-500 mt-1 font-medium italic">
              Viewing all manager and executive notes for assigned properties
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
              <FiUser className="text-gray-400" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {user?.role}: {user?.firstName}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {notesData.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <FiMessageSquare size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-black uppercase tracking-widest">
              No Communication Logs Found
            </p>
            <p className="text-xs text-gray-400 mt-2 font-bold uppercase">
              Notes added by managers or executives will appear here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notesData.map((record) => (
              <div
                key={`${record.propertyId}-${record.salesExecutiveId}`}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Property Header */}
                <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white px-2 py-0.5 rounded text-[10px] font-black text-gray-400 border border-gray-200 uppercase tracking-tighter">
                        #{record.propertyId.slice(-6).toUpperCase()}
                      </span>
                      {record.property?.isVerified === "completed" && (
                        <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                          <MdVerified size={12} /> Verified
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-gray-900 truncate uppercase tracking-tight">
                      {record.property?.microMarket || "Property Details"}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase tracking-tighter">
                      <FiMapPin className="text-[#EE2529]" />
                      {record.property?.city}, {record.property?.state}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/property/property-details/${record.propertyId}`,
                      )
                    }
                    className="p-2 bg-white text-gray-400 hover:text-[#EE2529] hover:bg-red-50 rounded-xl transition-all shadow-sm border border-gray-100"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>

                {/* Notes Section */}
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-[#EE2529]" />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Added By: {record.salesExecutive?.firstName}{" "}
                        {record.salesExecutive?.lastName}
                      </span>
                    </div>
                    <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">
                      {record.totalNotesCount} Logs
                    </span>
                  </div>

                  {/* Latest Note Highlight */}
                  <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <FiMessageSquare size={48} />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#EE2529] uppercase mb-2">
                      <FiCalendar /> Latest Activity:{" "}
                      {formatDate(record.updatedAt)}
                    </div>
                    <p className="text-sm font-bold text-gray-800 leading-relaxed italic">
                      "{record.notes?.[0]?.note || "No note content"}"
                    </p>
                  </div>

                  {/* Note History Preview */}
                  {record.notes?.length > 1 && (
                    <div className="mt-2 space-y-3">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-1">
                        Previous Logs
                      </p>
                      {record.notes.slice(1, 3).map((note, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start group/note"
                        >
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-200 group-hover/note:bg-[#EE2529] transition-colors shadow-sm"></div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-gray-600 line-clamp-2">
                              {note.note}
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                              {formatDate(note.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        Type
                      </p>
                      <p className="text-[11px] font-black text-gray-700 uppercase">
                        {record.property?.propertyType}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">
                        Price
                      </p>
                      <p className="text-[11px] font-black text-gray-700">
                        ₹{record.property?.sellingPrice} Cr
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      navigate(
                        `/property/property-details/${record.propertyId}`,
                      )
                    }
                    className="text-[10px] font-black text-[#EE2529] uppercase hover:underline flex items-center gap-1"
                  >
                    View Property <FiChevronRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination placeholder */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-10">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => fetchNotes(pagination.currentPage - 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-extrabold text-xs uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchNotes(i + 1)}
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
              onClick={() => fetchNotes(pagination.currentPage + 1)}
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

export default PropertyNotes;

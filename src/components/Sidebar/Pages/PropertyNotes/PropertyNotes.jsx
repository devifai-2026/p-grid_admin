import React, { useState, useEffect, useMemo } from "react";
import {
  FiMessageSquare,
  FiUser,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";
import { MdOutlineNotes, MdVerified } from "react-icons/md";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../helpers/useUserStorage";
import NotesAndActivityModal from "../WorkBoard/NotesAndActivityModal";

const PropertyNotes = () => {
  const { user } = useUserStorage();
  const [loading, setLoading] = useState(true);
  const [notesData, setNotesData] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
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
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Group flat notes by propertyId
  const grouped = useMemo(() => {
    const map = {};
    notesData.forEach((note) => {
      const pid = note.propertyId;
      if (!map[pid]) {
        map[pid] = {
          propertyId: pid,
          property: note.property || {},
          salesExecutive: note.salesExecutive || {},
          notes: [],
          latestDate: note.updatedAt || note.createdAt,
        };
      }
      map[pid].notes.push(note);
      // Track latest date
      const noteDate = note.updatedAt || note.createdAt;
      if (noteDate > map[pid].latestDate) {
        map[pid].latestDate = noteDate;
      }
    });
    return Object.values(map);
  }, [notesData]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.map((group) => (
              <div
                key={group.propertyId}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() =>
                  setSelectedProperty({
                    propertyId: group.propertyId,
                    propertyType: group.property?.propertyType,
                    microMarket: group.property?.microMarket,
                    city: group.property?.city,
                  })
                }
              >
                {/* Property Header */}
                <div className="p-5 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-white px-2 py-0.5 rounded text-[10px] font-black text-gray-400 border border-gray-200 uppercase tracking-tighter">
                      #{group.propertyId.slice(-6).toUpperCase()}
                    </span>
                    {group.property?.isVerified === "completed" && (
                      <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold uppercase">
                        <MdVerified size={12} /> Verified
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 truncate uppercase tracking-tight">
                    {group.property?.microMarket || "Property Details"}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs font-bold uppercase tracking-tighter mt-1">
                    <FiMapPin className="text-[#EE2529]" size={12} />
                    {group.property?.city}, {group.property?.state}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-[#EE2529]" size={14} />
                    <span className="text-xs font-bold text-gray-700">
                      {group.salesExecutive?.firstName}{" "}
                      {group.salesExecutive?.lastName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {"Notes"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      Last: {formatDate(group.latestDate)}
                    </span>
                  </div>

                  {/* Latest note preview */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-600 line-clamp-2 italic">
                      "{group.notes[0]?.originalNote || "No note content"}"
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase">
                    {group.property?.propertyType && (
                      <span>{group.property.propertyType}</span>
                    )}
                    {group.property?.sellingPrice && (
                      <span>₹{group.property.sellingPrice} Cr</span>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-[#EE2529] uppercase flex items-center gap-1">
                    View Logs <FiChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
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

      {/* Notes Modal */}
      <NotesAndActivityModal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        property={selectedProperty}
      />
    </div>
  );
};

export default PropertyNotes;

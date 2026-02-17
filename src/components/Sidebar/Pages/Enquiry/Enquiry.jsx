import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiMessageSquare,
  FiHome,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";

const Enquiry = () => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchNotes = () => {
      setLoading(true);
      apiCall.get({
        route: "/properties/investor-notes",
        onSuccess: (res) => {
          setLoading(false);
          if (res.success) {
            setNotes(res.data || []);
          }
        },
        onError: (err) => {
          setLoading(false);
          console.error("Error fetching notes:", err);
        },
      });
    };

    fetchNotes();
  }, [refreshKey]);

  const filteredNotes = notes.filter(
    (n) =>
      (n.propertyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.investorName || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Property Enquiries
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage investor notes for your assigned properties
          </p>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by property or investor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors flex items-center gap-2 text-sm font-medium"
          title="Refresh List"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Enquiries List */}
      <div className="grid grid-cols-1 gap-6">
        {loading && notes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="flex justify-center items-center gap-2 text-slate-500">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              Loading enquiries...
            </div>
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((item) => (
            <div
              key={item.propertyId}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <FiHome className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {item.propertyName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Property ID: {item.propertyId}
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                  {item.notes?.length || 0} Notes
                </div>
              </div>

              <div className="p-5 space-y-4">
                {item.notes && item.notes.length > 0 ? (
                  item.notes.map((note, index) => (
                    <div
                      key={note.noteId || index}
                      className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm">
                          <FiUser className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <p className="font-semibold text-slate-800 text-sm">
                            {note.investorName || "Investor"}
                          </p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {note.noteText}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-4 italic">
                    No notes available for this property.
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                <FiMessageSquare className="w-8 h-8" />
              </div>
              <p className="text-lg font-medium">No enquiries found</p>
              <p className="text-sm">
                Properties with investor notes will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiry;

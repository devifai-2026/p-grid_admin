import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiRefreshCw,
  FiMessageSquare,
  FiHome,
  FiUser,
  FiCalendar,
  FiUserPlus,
  FiCheckCircle,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useAuth } from "../../../../context/AuthContext";

const dummyInquiries = [];

const Enquiry = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState(dummyInquiries);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [executives, setExecutives] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedExec, setSelectedExec] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const isManager = ["Admin", "Super Admin", "Sales Manager"].includes(
    user?.role,
  );

  useEffect(() => {
    const fetchInquiries = () => {
      setLoading(true);

      // Determine endpoint based on role
      const isAdmin = ["Admin", "Super Admin", "Sales Manager"].includes(
        user?.role,
      );
      const endpoint = isAdmin
        ? "/admin/pending-inquiries"
        : "/sales/assigned-inquiries";

      apiCall.get({
        route: endpoint,
        onSuccess: (res) => {
          setLoading(false);
          if (res.success && res.data && res.data.length > 0) {
            setInquiries(res.data);
          }
        },
        onError: (err) => {
          setLoading(false);
          console.error("Error fetching inquiries:", err);
        },
      });
    };

    if (user) {
      const timer = setTimeout(() => {
        fetchInquiries();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [refreshKey, user]);

  useEffect(() => {
    if (isManager) {
      apiCall.get({
        route:
          "/admin/sales-related-active-users/Sales Executive - Client Dealer",
        onSuccess: (res) => {
          if (res.success && res.data) {
            setExecutives(res.data);
          }
        },
      });
    }
  }, [isManager]);

  const handleAssign = (propertyId, inquirerId) => {
    if (!selectedExec) return;
    setAssignLoading(true);

    apiCall.post({
      route: "/admin/inquiries/assign",
      payload: {
        propertyId,
        inquirerId,
        assignedTo: selectedExec,
      },
      onSuccess: (res) => {
        setAssignLoading(false);
        setAssigningId(null);
        setSelectedExec("");
        setRefreshKey((prev) => prev + 1);
      },
      onError: (err) => {
        setAssignLoading(false);
        alert(err.message || "Failed to assign inquiry");
      },
    });
  };

  const filteredInquiries = inquiries.filter((item) => {
    const propTitle =
      `${item.property?.propertyType || ""} ${item.property?.city || ""}`.toLowerCase();
    const inquirerName =
      `${item.inquirer?.firstName || ""} ${item.inquirer?.lastName || ""}`.toLowerCase();
    const idMatch = (item.propertyId || "").toLowerCase();

    return (
      propTitle.includes(searchTerm.toLowerCase()) ||
      inquirerName.includes(searchTerm.toLowerCase()) ||
      idMatch.includes(searchTerm.toLowerCase())
    );
  });

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
        {loading && inquiries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="flex justify-center items-center gap-2 text-slate-500">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              Loading inquiries...
            </div>
          </div>
        ) : filteredInquiries.length > 0 ? (
          filteredInquiries.map((item) => (
            <div
              key={item.id || item.propertyId}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                    <FiHome className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {item.property?.propertyType || "Property Enquiry"} in{" "}
                      {item.property?.city || "Unknown City"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Property ID: {item.propertyId}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col items-end gap-1">
                    <div className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600">
                      {item.inquiries?.length || 0} Queries
                    </div>
                    {item.status && (
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          item.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : item.status === "assigned"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>

                  {isManager && item.status === "pending" && (
                    <button
                      onClick={() => setAssigningId(item.id || item.propertyId)}
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                    >
                      <FiUserPlus className="w-3.5 h-3.5" />
                      Assign
                    </button>
                  )}
                </div>
              </div>

              {assigningId === (item.id || item.propertyId) && (
                <div className="p-4 bg-red-50/50 border-b border-red-100 animate-in slide-in-from-top duration-300">
                  <div className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 w-full">
                      <select
                        value={selectedExec}
                        onChange={(e) => setSelectedExec(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm bg-white cursor-pointer"
                      >
                        <option value="">Select Executive to Assign</option>
                        {executives.map((exec) => (
                          <option
                            key={exec.value || exec.userId || exec.id}
                            value={exec.value || exec.userId || exec.id}
                          >
                            {exec.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() =>
                          handleAssign(item.propertyId, item.inquirerId)
                        }
                        disabled={!selectedExec || assignLoading}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2"
                      >
                        {assignLoading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FiCheckCircle className="w-4 h-4" />
                        )}
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          setAssigningId(null);
                          setSelectedExec("");
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-white text-slate-500 rounded-lg text-sm font-bold hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4">
                {item.inquiries && item.inquiries.length > 0 ? (
                  item.inquiries.map((note, index) => (
                    <div
                      key={index}
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
                            {item.inquirer
                              ? `${item.inquirer.firstName || ""} ${item.inquirer.lastName || ""}`
                              : "User Inquiry"}
                          </p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {note.createdAt
                              ? new Date(note.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {note.question}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-4 italic">
                    No questions available for this enquiry.
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
                New property inquiries will appear here once submitted.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enquiry;

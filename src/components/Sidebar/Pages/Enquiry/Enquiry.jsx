import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare } from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useAuth } from "../../../../context/AuthContext";
import { showError } from "../../../../helpers/swalHelper";


// Sub-components
import EnquiryHeader from "./components/EnquiryHeader";
import EnquiryCard from "./components/EnquiryCard";

const Enquiry = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [executives, setExecutives] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedExec, setSelectedExec] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const [autoAssignLoading, setAutoAssignLoading] = useState(null);

  const isManager = useMemo(
    () => ["Admin", "Super Admin", "Sales Manager"].includes(user?.role),
    [user?.role],
  );

  const fetchInquiries = useCallback(() => {
    if (!user) return;
    setLoading(true);

    const endpoint = isManager
      ? "/admin/pending-inquiries"
      : "/sales/assigned-inquiries";

    apiCall.get({
      route: endpoint,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success && res.data) {
          setInquiries(res.data);
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching inquiries:", err);
      },
    });
  }, [isManager, user]);

  useEffect(() => {
    fetchInquiries();
  }, [refreshKey, fetchInquiries]);

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
      onSuccess: () => {
        setAssignLoading(false);
        setAssigningId(null);
        setSelectedExec("");
        setRefreshKey((prev) => prev + 1);
      },
      onError: (err) => {
        setAssignLoading(false);
        showError(err.message || "Failed to assign inquiry");
      },
    });
  };

  const handleAutoAssign = (propertyId, inquirerId) => {
    setAutoAssignLoading(propertyId + inquirerId);

    apiCall.post({
      route: "/admin/inquiries/auto-assign",
      payload: { propertyId, inquirerId },
      onSuccess: () => {
        setAutoAssignLoading(null);
        setRefreshKey((prev) => prev + 1);
      },
      onError: (err) => {
        setAutoAssignLoading(null);
        showError(err.message || "Failed to auto-assign inquiry");
      },
    });
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const propTitle =
        `${item.property?.propertyType || ""} ${item.property?.city || ""} ${item.property?.microMarket || ""}`.toLowerCase();
      const inquirerInfo =
        `${item.inquirer?.firstName || ""} ${item.inquirer?.lastName || ""} ${item.inquirer?.email || ""}`.toLowerCase();
      const idMatch = (item.propertyId || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      // Check inquiry content (Timeline)
      const inquiryText = (item.inquiry || "").toLowerCase();
      const inquiriesText = (item.inquiries || [])
        .map((i) => `${i.question || ""} ${i.answer || ""}`.toLowerCase())
        .join(" ");

      return (
        propTitle.includes(search) ||
        inquirerInfo.includes(search) ||
        idMatch.includes(search) ||
        inquiryText.includes(search) ||
        inquiriesText.includes(search)
      );
    });
  }, [inquiries, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Premium Header */}
      <EnquiryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        onRefresh={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Main List Container */}
      <div className="space-y-4 md:space-y-6">
        <AnimatePresence mode="popLayout">
          {loading && inquiries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl md:rounded-3xl p-12 text-center border-2 border-dashed border-slate-100"
            >
              <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">
                Synchronizing Enquiries...
              </p>
            </motion.div>
          ) : filteredInquiries.length > 0 ? (
            filteredInquiries.map((item, index) => (
              <EnquiryCard
                key={item.id || item.propertyId}
                item={item}
                index={index}
                isManager={isManager}
                autoAssignLoading={autoAssignLoading}
                handleAutoAssign={handleAutoAssign}
                assigningId={assigningId}
                setAssigningId={setAssigningId}
                selectedExec={selectedExec}
                setSelectedExec={setSelectedExec}
                executives={executives}
                handleAssign={handleAssign}
                assignLoading={assignLoading}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-3xl p-12 md:p-20 text-center border border-white shadow-xl shadow-slate-100"
            >
              <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 shadow-inner">
                <FiMessageSquare size={40} />
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter mb-2">
                Inbox Clear
              </h2>
              <p className="text-slate-400 text-xs font-medium italic max-w-md mx-auto">
                {searchTerm
                  ? `No results for "${searchTerm}".`
                  : "No pending enquiries found."}
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Enquiry;

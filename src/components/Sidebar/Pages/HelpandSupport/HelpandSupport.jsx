import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiChevronDown,
  FiUser,
  FiHome,
  FiCreditCard,
  FiShield,
  FiExternalLink,
  FiClock,
  FiMinus,
  FiPlus,
  FiBarChart2,
  FiLink,
  FiZap,
  FiUsers,
  FiInbox,
  FiRefreshCw,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError } from "../../../../helpers/swalHelper";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_STYLES = {
  open: "bg-amber-50 text-amber-600 border-amber-100",
  in_progress: "bg-blue-50 text-blue-600 border-blue-100",
  resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime()) || d.getFullYear() <= 1970) return "N/A";
  return d.toLocaleString();
};

const HelpandSupport = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Customer Support Requests (real data from backend)
  const [supportRequests, setSupportRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSupportRequests = () => {
    setRequestsLoading(true);
    apiCall.get({
      route: "/admin/support-requests",
      onSuccess: (res) => {
        setRequestsLoading(false);
        if (res?.success) {
          setSupportRequests(Array.isArray(res.data) ? res.data : []);
        }
      },
      onError: (err) => {
        setRequestsLoading(false);
        console.error("Error fetching support requests:", err);
      },
    });
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  const handleStatusChange = (requestId, status) => {
    setUpdatingId(requestId);
    // Optimistic update
    setSupportRequests((prev) =>
      prev.map((r) => (r.requestId === requestId ? { ...r, status } : r)),
    );
    apiCall.patch({
      route: `/admin/support-requests/${requestId}`,
      payload: { status },
      onSuccess: (res) => {
        setUpdatingId(null);
        if (!res?.success) {
          fetchSupportRequests();
        }
      },
      onError: (err) => {
        setUpdatingId(null);
        showError(err?.message || "Failed to update support request");
        fetchSupportRequests(); // revert optimistic change
      },
    });
  };

  const categories = [
    {
      id: "verification",
      title: "Verification workflow",
      icon: FiShield,
      color: "bg-red-50 text-red-600",
      description: "Understanding the 2-step verification process",
    },
    {
      id: "leads",
      title: "Lead Management",
      icon: FiZap,
      color: "bg-amber-50 text-amber-600",
      description: "How auto-assignment and manual leads work",
    },
    {
      id: "dashboard",
      title: "Dashboard Tools",
      icon: FiBarChart2,
      color: "bg-blue-50 text-blue-600",
      description: "Using analytics and workboards effectively",
    },
    {
      id: "team",
      title: "User Roles",
      icon: FiUsers,
      color: "bg-emerald-50 text-emerald-600",
      description: "Permissions for Managers and Executives",
    },
  ];

  const faqs = [
    {
      question: "What is the 'Two-Step' verification protocol?",
      answer:
        "Prelease Grid uses a rigorous Two-Step verification. First, a Sales Executive verifies the physical and document details of a property. Second, a Sales Manager reviews these logs to mark the property as 'Completed'. This ensures 100% data integrity for our investors.",
    },
    {
      question: "How does the 'Auto-Assign' feature work for enquiries?",
      answer:
        "In the Enquiry management section, Admins can use 'Auto-Assign'. Our system automatically identifies the best-suited active Sales Executive - Client Dealer to handle the lead based on their current workload and activity status.",
    },
    {
      question: "What information is included in 'Property Connectivity'?",
      answer:
        "We track crucial distance metrics to public transport, airports, highways, and major commercial hubs. This data helps calculate the property's accessibility score, which is a key factor in our ROI projections.",
    },
    {
      question: "Can I track my personal performance as an Executive?",
      answer:
        "Yes! Your personal 'Work Board' provides a tailored view of your assigned properties and pending inquiries. You can track your completion rate and see real-time updates on your verification tasks.",
    },
    {
      question: "How are 'Hot Properties' identified?",
      answer:
        "The 'Hot Properties' section automatically highlights the most recently updated listings in our database. These are properties that have either been newly listed or have recent verification updates, making them the most relevant for active brokers.",
    },
    {
      question: "What are 'Verification Logs'?",
      answer:
        "Verification logs are immutable records of who verified a property and when. They include the user's role and timestamp, providing a transparent audit trail for every single property in the ecosystem.",
    },
  ];

  const togggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 px-6 pt-10 pb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
            Help & <span className="text-[#EE2529]">Support</span>
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Customer support requests submitted by users
          </p>
        </div>
      </div>

      {/* Customer Support Requests */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
              <FiInbox size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                Customer Support <span className="text-[#EE2529]">Requests</span>
              </h2>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                {supportRequests.length} request
                {supportRequests.length === 1 ? "" : "s"} received
              </p>
            </div>
          </div>
          <button
            onClick={fetchSupportRequests}
            disabled={requestsLoading}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-40"
          >
            <FiRefreshCw
              className={`w-3.5 h-3.5 ${requestsLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
          {requestsLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-10 h-10 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                Loading requests...
              </p>
            </div>
          ) : supportRequests.length === 0 ? (
            <div className="text-center py-20">
              <FiInbox size={48} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                No support requests yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Requester
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Subject / Message
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {supportRequests.map((req) => (
                    <tr
                      key={req.requestId}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors align-top"
                    >
                      <td className="px-6 py-5">
                        <p className="font-bold text-gray-900 text-sm">
                          {req.name || "N/A"}
                        </p>
                        {req.user && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                            Registered User
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          {req.email && (
                            <p className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                              <FiMail className="text-gray-300 shrink-0" />
                              <span className="truncate max-w-[180px]">
                                {req.email}
                              </span>
                            </p>
                          )}
                          {req.phone && (
                            <p className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                              <FiPhone className="text-gray-300 shrink-0" />
                              {req.phone}
                            </p>
                          )}
                          {!req.email && !req.phone && (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-md">
                        {req.subject && (
                          <p className="font-bold text-gray-800 text-sm mb-1">
                            {req.subject}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                          {req.message || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                          {formatDateTime(req.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={req.status || "open"}
                          disabled={updatingId === req.requestId}
                          onChange={(e) =>
                            handleStatusChange(req.requestId, e.target.value)
                          }
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border outline-none cursor-pointer transition-all disabled:opacity-50 ${
                            STATUS_STYLES[req.status] ||
                            "bg-gray-50 text-gray-600 border-gray-100"
                          }`}
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default HelpandSupport;

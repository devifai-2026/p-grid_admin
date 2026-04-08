import React, { useState } from "react";
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
} from "react-icons/fi";

const HelpandSupport = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      {/* Premium Hero Header */}
      <div className="relative bg-white pt-16 pb-24 px-6 border-b border-gray-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -ml-20 -mb-20 opacity-30" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm border border-red-100/50">
            <FiZap /> Powered by Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-6 leading-[0.9]">
            Prelease Grid <span className="text-[#EE2529]">Support</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Master our property verification ecosystem. Find guides on lead
            management, analytics tools, and role-based permissions.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-red-500/5 rounded-[2rem] blur-xl group-focus-within:bg-red-500/10 transition-all" />
            <div className="relative flex items-center bg-white rounded-[1.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden p-1.5 focus-within:border-red-500/30 transition-all">
              <div className="flex items-center justify-center w-14 h-14">
                <FiSearch className="text-gray-400 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features, workflows, or FAQs..."
                className="flex-1 bg-transparent py-4 text-gray-900 placeholder:text-gray-400 outline-none font-medium"
              />
              <button className="hidden md:flex bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] items-center gap-2 hover:bg-red-600 transition-all shadow-lg active:scale-95">
                Search Help
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20 pb-20">
        {/* Core Feature Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex flex-col items-center text-center cursor-pointer"
            >
              <div
                className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}
              >
                <cat.icon size={26} />
              </div>
              <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm mb-2">
                {cat.title}
              </h3>
              <p className="text-gray-400 text-[10px] font-bold leading-relaxed px-2">
                {cat.description}
              </p>
              <div className="mt-6 w-0 group-hover:w-full h-0.5 bg-red-500 transition-all duration-500 opacity-20" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* FAQ Column - Features Driven */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                Knowledge <span className="text-[#EE2529]">Repository</span>
              </h2>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                <FiZap className="text-amber-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Feature Focused
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-3xl border transition-all duration-500 ${activeFaq === index ? "border-red-100 ring-4 ring-red-50/50 shadow-xl" : "border-gray-100 hover:border-red-100 shadow-sm"}`}
                  >
                    <button
                      onClick={() => togggleFaq(index)}
                      className="w-full flex items-center justify-between p-6 text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${activeFaq === index ? "bg-red-600 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500"}`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-black text-gray-800 uppercase tracking-tight text-sm md:text-base leading-tight">
                          {faq.question}
                        </span>
                      </div>
                      <div
                        className={`p-2 rounded-xl transition-all ${activeFaq === index ? "bg-red-50 text-red-600 rotate-180" : "bg-gray-50 text-gray-300"}`}
                      >
                        {activeFaq === index ? (
                          <FiMinus size={14} />
                        ) : (
                          <FiPlus size={14} />
                        )}
                      </div>
                    </button>
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${activeFaq === index ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <div className="px-6 pb-6 pt-2 text-gray-500 font-medium leading-relaxed text-sm md:text-base pl-[3.5rem]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                  <FiSearch size={48} className="mx-auto text-gray-100 mb-4" />
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                    No matching features found
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Status Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-8">
              Executive <span className="text-[#EE2529]">Support</span>
            </h2>

            {/* Live Chat Feature Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-gray-300 relative overflow-hidden group border border-gray-800">
              <div className="absolute top-0 right-0 p-8">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <FiMessageSquare className="text-red-500" />
                </div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Agents Online
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-tight">
                  Direct <br />
                  <span className="text-red-500">Concierge</span>
                </h3>
                <p className="text-gray-400 font-medium mb-8 leading-relaxed text-sm">
                  Priority assistance for Sales Managers and Super Admins only.
                </p>
                <button className="bg-[#EE2529] hover:bg-red-700 text-white w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-red-500/20 active:scale-95">
                  Request Callback
                </button>
              </div>
            </div>

            {/* Support Channels */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-blue-100 hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <FiMail size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Administrative Mail
                  </p>
                  <p className="font-black text-gray-900 truncate">
                    admin@preleasegrid.com
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:border-emerald-100 hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                  <FiPhone size={24} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    24/7 Hotline
                  </p>
                  <p className="font-black text-gray-900">+91 8800 555 123</p>
                </div>
              </div>
            </div>

            {/* Data Feed Status */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Real-time Data Feed
                </span>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                    Live
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500">
                    API Latency
                  </span>
                  <span className="text-[10px] font-black text-gray-900">
                    24ms
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div className="h-full bg-red-500 w-[95%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Footer */}
      <div className="bg-white border-t border-gray-100 py-16 px-6 text-center mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-red-100 to-transparent" />
        <div className="max-w-2xl mx-auto relative z-10">
          <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-4">
            Integrity is our <span className="text-red-500">Benchmark</span>
          </h4>
          <p className="text-gray-400 font-medium mb-10 text-sm">
            Every property verification log is protected by our internal
            security protocols to ensure maximum transparency.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {["Architecture", "Verification", "ROI Analytics", "Security"].map(
              (tag) => (
                <div key={tag} className="flex items-center gap-2">
                  <FiLink className="text-red-500 w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {tag}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
        <p className="mt-16 text-gray-300 text-[10px] font-bold uppercase tracking-[0.5em]">
          PRELEASE GRID ENTERPRISE ECOSYSTEM &copy; 2026
        </p>
      </div>
    </div>
  );
};

export default HelpandSupport;

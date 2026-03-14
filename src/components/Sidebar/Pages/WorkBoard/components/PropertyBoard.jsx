import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiMapPin, FiUser, FiArrowRight, FiMessageSquare } from "react-icons/fi";

const PropertyRow = ({ prop, idx, isAdminOrManager, openAssignModal, openNotesModal }) => {
  return (
    <motion.tr
      key={prop.propertyId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group hover:bg-slate-50/80 transition-all duration-200"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative group-hover:shadow-md transition-all">
            {prop.media?.[0]?.fileUrl ? (
              <img
                src={prop.media[0].fileUrl}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <FiHome size={20} />
              </div>
            )}
          </div>
          <div className="max-w-[150px]">
            <p className="font-black text-slate-800 text-[11px] truncate uppercase">
              {prop.microMarket || "Premium Block"}
            </p>
            <p className="font-bold text-red-500 mt-0.5">{prop.propertyType}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-600">
            <span className="text-slate-400">Yield:</span>
            <span className="text-emerald-600">
              {prop.grossRentalYield || 0}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-600">
            <span className="text-slate-400">Price:</span>
            <span>₹{prop.sellingPrice || 0}Cr</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2 font-bold text-slate-600">
          <FiMapPin className="text-red-500 opacity-50" />
          <span className="truncate max-w-[120px]">
            {prop.city}, {prop.state}
          </span>
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter shadow-sm border ${
            prop.isVerified === "completed"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-orange-50 text-orange-600 border-orange-100"
          }`}
        >
          {prop.isVerified || "Pending"}
        </span>
      </td>

      {isAdminOrManager && (
        <td className="px-6 py-4">
          <div
            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer ${
              prop.salesAgent
                ? "bg-indigo-50/30 border-indigo-100 hover:bg-indigo-50"
                : "bg-slate-50 border-slate-100 hover:border-red-200"
            }`}
            onClick={() => openAssignModal(prop)}
          >
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center font-black ${
                prop.salesAgent
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-200 text-slate-400"
              }`}
            >
              {(prop.salesAgent?.firstName || prop.salesAgent?.name)
                ?.charAt(0)
                ?.toUpperCase() || <FiUser size={12} />}
            </div>
            <span
              className={`font-black uppercase tracking-tight ${
                prop.salesAgent ? "text-indigo-600" : "text-slate-400"
              }`}
            >
              {prop.salesAgent
                ? prop.salesAgent.name ||
                  `${prop.salesAgent.firstName || ""} ${prop.salesAgent.lastName || ""}`.trim() ||
                  "Agent"
                : "UNASSIGNED"}
            </span>
          </div>
        </td>
      )}

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-amber-50 hover:text-amber-500 hover:border-amber-100 transition-all group-hover:scale-110 active:scale-90"
            title="View Notes"
            onClick={(e) => {
              e.stopPropagation();
              openNotesModal(prop);
            }}
          >
            <div className="relative">
              <FiMessageSquare size={16} />
              {prop.hasUnreadNotes && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </div>
          </button>
          <button
            className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group-hover:scale-110 active:scale-90"
            title="View Details"
            onClick={() =>
              (window.location.href = `/property/property-details/${prop.propertyId}`)
            }
          >
            <FiArrowRight size={16} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

const PropertyBoard = ({
  showProperties,
  isPropertyManager,
  filteredProperties,
  isAdminOrManager,
  viewType,
  setViewType,
  loading,
  properties,
  openAssignModal,
  openNotesModal,
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const itemsPerPage = 8;

  // Filter properties based on search term
  const displayedProperties = React.useMemo(() => {
    if (!searchTerm.trim()) return filteredProperties;
    const term = searchTerm.toLowerCase().trim();
    return filteredProperties.filter((prop) => {
      const city = (prop.city || "").toLowerCase();
      const state = (prop.state || "").toLowerCase();
      const microMarket = (prop.microMarket || "").toLowerCase();
      const type = (prop.propertyType || "").toLowerCase();
      const agent = (prop.salesAgent?.name || 
                   `${prop.salesAgent?.firstName || ""} ${prop.salesAgent?.lastName || ""}`).toLowerCase();

      return (
        city.includes(term) ||
        state.includes(term) ||
        microMarket.includes(term) ||
        type.includes(term) ||
        agent.includes(term)
      );
    });
  }, [filteredProperties, searchTerm]);

  const totalPages = Math.ceil(displayedProperties.length / itemsPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [displayedProperties.length, viewType]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = displayedProperties.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (!showProperties) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1">
          <h2 className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase tracking-tight shrink-0">
            <FiHome className="text-red-500" />
            {isPropertyManager ? "Your Assigned Properties" : "Property Board"}
            <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
              {displayedProperties.length}
            </span>
          </h2>

          {/* Search Bar */}
          <div className="relative group flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 group-focus-within:text-red-500 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
            <input
              type="text"
              placeholder="Search by city, micro-market, type or agent..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl pl-11 pr-4 py-2.5 text-[11px] font-bold text-slate-700 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500/30 transition-all shadow-sm"
            />
          </div>
        </div>

        {isAdminOrManager && (
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm self-start">
            {["all", "assigned", "unassigned"].map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewType === type
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-[10px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 font-black uppercase tracking-widest text-slate-400">
                <th className="px-6 py-5">Property Info</th>
                <th className="px-6 py-5">Financials</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Status</th>
                {isAdminOrManager && <th className="px-6 py-5">Assigned To</th>}
                <th className="px-6 py-5 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && properties.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdminOrManager ? 6 : 5}
                    className="px-6 py-20 text-center"
                  >
                    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      Loading Properties...
                    </p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="wait">
                  {paginatedProperties.map((prop, idx) => (
                    <PropertyRow
                      key={prop.propertyId}
                      prop={prop}
                      idx={idx}
                      isAdminOrManager={isAdminOrManager}
                      openAssignModal={openAssignModal}
                      openNotesModal={openNotesModal}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>

          {displayedProperties.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
              No properties found matching "{searchTerm}"
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, displayedProperties.length)}{" "}
              of {displayedProperties.length}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all font-black uppercase tracking-widest"
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show current page, its neighbors, first and last page
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                          currentPage === page
                            ? "bg-red-500 text-white shadow-md shadow-red-100"
                            : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="text-slate-300 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-100 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition-all font-black uppercase tracking-widest"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyBoard;

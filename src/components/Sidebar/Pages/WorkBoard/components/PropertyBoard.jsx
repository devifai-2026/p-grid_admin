import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiMapPin, FiUser, FiArrowRight } from "react-icons/fi";

const PropertyRow = ({ prop, idx, isAdminOrManager, openAssignModal }) => {
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
        <button
          className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group-hover:scale-110 active:scale-90"
          title="View Details"
          onClick={() =>
            (window.location.href = `/property/property-details/${prop.propertyId}`)
          }
        >
          <FiArrowRight size={16} />
        </button>
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
}) => {
  if (!showProperties) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <h2 className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase tracking-tight">
          <FiHome className="text-red-500" />
          {isPropertyManager ? "Your Assigned Properties" : "Property Board"}
          <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
            {filteredProperties.length}
          </span>
        </h2>

        {isAdminOrManager && (
          <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm self-start">
            {["all", "assigned", "unassigned"].map((type) => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  viewType === type
                    ? "bg-slate-900 text-white shadow-lg"
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
                <AnimatePresence>
                  {filteredProperties.map((prop, idx) => (
                    <PropertyRow
                      key={prop.propertyId}
                      prop={prop}
                      idx={idx}
                      isAdminOrManager={isAdminOrManager}
                      openAssignModal={openAssignModal}
                    />
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>

          {filteredProperties.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
              No properties found matching criteria
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PropertyBoard;

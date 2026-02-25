import React from "react";
import { FiImage, FiMapPin, FiLayers, FiTrendingUp } from "react-icons/fi";
import { MdVerified, MdArrowForward } from "react-icons/md";

const PropertyCard = ({
  item,
  user,
  onVerify,
  onUnverify,
  onView,
  isSalesRelated = false,
}) => {
  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${price} Cr`;
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full">
      {/* Image Section - Reduced Height */}
      <div className="h-44 overflow-hidden relative bg-gray-50">
        {item.media?.[0]?.fileUrl ? (
          <img
            src={item.media[0].fileUrl}
            alt={item.microMarket}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FFF9F9] relative overflow-hidden">
            {/* Edge-to-Edge Geometric Pattern */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none grid grid-cols-4 gap-8 p-0">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center justify-center p-2">
                  <FiImage size={48} className="-rotate-12" />
                </div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-md flex items-center justify-center mb-3 border border-red-50/50">
                <FiImage size={28} className="text-red-300" />
              </div>
              <div className="flex items-center gap-3 w-full justify-center px-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-red-100" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400/60 whitespace-nowrap">
                  Media Missing
                </p>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-red-100" />
              </div>
              <div className="mt-3 flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-200" />
                <div className="w-8 h-1.5 rounded-full bg-red-100/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-red-200" />
              </div>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1.5">
            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-sm uppercase tracking-wider border border-white/20">
              {item.propertyType}
            </span>
            {(item.isVerified === "partial" ||
              item.isVerified === "completed") && (
              <div
                className={`text-white text-[9px] font-black px-2.5 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-white/10 ${
                  item.isVerified === "partial" ? "bg-orange-500" : "bg-red-500"
                }`}
              >
                <MdVerified size={10} />
                {item.isVerified === "partial" ? "Partial" : "Verified"}
              </div>
            )}
          </div>

          {item.isVerified === "partial" &&
            !item.verificationLogs?.some(
              (log) => log.userId === user?.userId,
            ) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onVerify(e, item.propertyId);
                }}
                className="pointer-events-auto bg-amber-400 text-amber-950 text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-wider hover:bg-amber-300 transition-colors shadow-lg border border-amber-300/50 flex items-center gap-1"
              >
                2nd Verify
              </button>
            )}
        </div>
      </div>

      {/* Content Section - Compact Padding */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-3">
          <h3 className="text-base font-black text-gray-900 mb-0.5 leading-tight line-clamp-1 group-hover:text-red-600 transition-colors">
            {item.microMarket ||
              `Premier Space ${item.propertyId?.slice(0, 4)}`}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
            <FiMapPin className="text-[#EE2529] shrink-0" />
            <span className="truncate">
              {item.city}, {item.state}
            </span>
          </div>
        </div>

        {/* Quick Specs - More Compact */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 p-2 rounded-xl border border-gray-100 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-gray-400">
              <FiLayers size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                Area
              </span>
            </div>
            <p className="text-xs font-black text-gray-800">
              {item.carpetArea || "N/A"} {item.carpetAreaUnit || "sqft"}
            </p>
          </div>
          <div className="bg-red-50/50 p-2 rounded-xl border border-red-50 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 text-red-400">
              <FiTrendingUp size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest text-red-400">
                Yield
              </span>
            </div>
            <p className="text-xs font-black text-red-600">
              {item.grossRentalYield || "0"}% ROI
            </p>
          </div>
        </div>

        {item.salesAgent && (
          <div className="flex items-center gap-2 text-indigo-700 text-[9px] font-black uppercase mb-4 bg-indigo-50/30 p-2 rounded-xl border border-indigo-100/30 w-full group/agent hover:bg-indigo-50 transition-colors cursor-default">
            <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-black text-[9px] shrink-0">
              {item.salesAgent.firstName[0]}
              {item.salesAgent.lastName[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] text-indigo-400 font-bold leading-none mb-0.5">
                Assigned
              </span>
              <span className="truncate leading-none">
                {item.salesAgent.firstName} {item.salesAgent.lastName}
              </span>
            </div>
          </div>
        )}

        {/* Footer Actions - Compact & Red Theme */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
          <div>
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
              Market Price
            </p>
            <p className="text-sm font-black text-gray-900">
              {formatPrice(item.sellingPrice)}
            </p>
          </div>

          <div className="flex gap-1.5 items-center">
            {item.verificationLogs?.some(
              (log) => log.userId === user?.userId,
            ) ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnverify(e, item.propertyId);
                }}
                className="bg-red-50 text-red-600 h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100 active:scale-95"
              >
                Unverify
              </button>
            ) : (
              item.isVerified !== "completed" &&
              item.isVerified !== "partial" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerify(e, item.propertyId);
                  }}
                  className="bg-green-600 text-white h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-green-700 transition-all active:scale-95"
                >
                  Verify
                </button>
              )
            )}

            <button
              onClick={() => onView(item.propertyId)}
              className="flex items-center justify-center gap-1.5 bg-[#EE2529] text-white h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 hover:shadow-lg hover:shadow-red-100 transition-all active:scale-95 group/btn"
            >
              Details
              <MdArrowForward className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

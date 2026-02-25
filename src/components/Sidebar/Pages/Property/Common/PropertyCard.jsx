import React from "react";
import { FiImage, FiMapPin, FiInfo } from "react-icons/fi";
import { MdVerified, MdArrowForward } from "react-icons/md";

const PropertyCard = ({
  item,
  user,
  onVerify,
  onUnverify,
  onView,
  isSalesRelated = false,
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col">
      <div className="h-48 overflow-hidden relative bg-gray-100">
        {item.media?.[0]?.fileUrl ? (
          <img
            src={item.media[0].fileUrl}
            alt={item.microMarket}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <FiImage size={40} className="mb-2 opacity-50" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
              No Image
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-blue-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest w-fit">
            {item.propertyType}
          </div>
          {(item.isVerified === "partial" ||
            item.isVerified === "completed") && (
            <div
              className={`text-white text-[10px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-widest flex items-center gap-1 w-fit ${
                item.isVerified === "partial" ? "bg-orange-500" : "bg-red-500"
              }`}
            >
              <MdVerified size={10} />
              {item.isVerified === "partial" ? "Partial" : "Verified"}
            </div>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 truncate flex-1">
            {item.microMarket ||
              `Commercial Space ${item.propertyId.slice(0, 4)}`}
          </h3>
          {item.isVerified === "partial" &&
            !item.verificationLogs?.some(
              (log) => log.userId === user?.userId,
            ) && (
              <button
                onClick={(e) => onVerify(e, item.propertyId)}
                className="px-2 py-1 bg-yellow-400 text-yellow-900 text-[9px] font-black rounded uppercase tracking-tighter hover:bg-yellow-500 transition shrink-0 ml-2"
              >
                2nd Verify
              </button>
            )}
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
          <FiMapPin className="text-[#EE2529]" />
          {item.city}, {item.state}
        </div>

        {item.salesAgent && (
          <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-bold uppercase mb-4 bg-indigo-50 px-2 py-1 rounded w-fit">
            <FiInfo size={10} />
            Assigned to: {item.salesAgent.firstName} {item.salesAgent.lastName}
          </div>
        )}

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 gap-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Price
            </p>
            <p className="text-sm font-black text-gray-800">
              ₹{item.sellingPrice} Cr
            </p>
          </div>
          <div className="flex gap-2">
            {item.verificationLogs?.some(
              (log) => log.userId === user?.userId,
            ) ? (
              <button
                onClick={(e) => onUnverify(e, item.propertyId)}
                className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-200 transition"
              >
                Unverify
              </button>
            ) : (
              <>
                {item.isVerified !== "completed" &&
                  item.isVerified !== "partial" && (
                    <button
                      onClick={(e) => onVerify(e, item.propertyId)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition"
                    >
                      Verify
                    </button>
                  )}
              </>
            )}
            <button
              onClick={() => onView(item.propertyId)}
              className="flex items-center gap-2 bg-[#EE2529] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#D32F2F] transition"
            >
              View <MdArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

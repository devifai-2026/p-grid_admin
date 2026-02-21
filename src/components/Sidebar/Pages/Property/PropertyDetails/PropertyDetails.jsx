import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiShare2,
  FiHeart,
  FiMapPin,
  FiMoreVertical,
  FiArrowLeft,
  FiActivity,
  FiInfo,
  FiFileText,
  FiMap,
  FiHelpCircle,
  FiDownload,
  FiNavigation,
  FiPhone,
  FiMessageSquare,
  FiCalendar,
  FiImage,
} from "react-icons/fi";
import {
  MdVerified,
  MdKingBed,
  MdBathtub,
  MdSquareFoot,
  MdApartment,
  MdStar,
  MdCheckCircle,
  MdBusiness,
  MdTrain,
  MdFlight,
  MdDirectionsCar,
  MdLocalParking,
  MdPool,
  MdSpa,
  MdFitnessCenter,
  MdRestaurant,
  MdPower,
  MdSecurity,
  MdArrowForward,
} from "react-icons/md";
import {
  FaRegBuilding,
  FaRegFileAlt,
  FaChartLine,
  FaMapMarkedAlt,
  FaQuestionCircle,
} from "react-icons/fa";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../../helpers/useUserStorage";

// --- Helper Components ---

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded-lg">
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm font-bold text-gray-800 text-right">
      {value || "N/A"}
    </span>
  </div>
);

const PropertyDetailsCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="mb-6 pb-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-red-50 rounded-lg text-[#EE2529]">
            <Icon size={20} />
          </div>
        )}
        <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
          {title}
        </h3>
      </div>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
      active
        ? "border-[#EE2529] text-[#EE2529] bg-red-50"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStorage();
  const [property, setProperty] = useState(null);
  const [propertyList, setPropertyList] = useState([]); // For displaying list when no ID
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("property");
  const [activeFaq, setActiveFaq] = useState(null);

  // Assignment States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Notes States
  const [notesData, setNotesData] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const isAdminOrSuperAdmin = ["Admin", "Super Admin"].includes(user?.role);
  const isSalesManager = user?.role === "Sales Manager";
  const canAssignProperty = isAdminOrSuperAdmin || isSalesManager;
  console.log(property);
  const handleVerify = (e, propertyId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to verify this property?"))
      return;

    apiCall.post({
      route: `/admin/properties/${propertyId}/verify`,
      onSuccess: (res) => {
        if (res.success) {
          alert("Property verified successfully!");
          const updatedData = res.data;
          // Refresh the list
          if (!id || id === "undefined" || id === "null") {
            setPropertyList((prev) =>
              prev.map((p) =>
                p.propertyId === propertyId
                  ? {
                      ...p,
                      isVerified: updatedData.isVerified,
                      verificationLogs: updatedData.verificationLogs,
                    }
                  : p,
              ),
            );
          } else {
            setProperty((prev) => ({
              ...prev,
              isVerified: updatedData.isVerified,
              verificationLogs: updatedData.verificationLogs,
            }));
          }
        }
      },
      onError: (err) => {
        alert(err.message || "Failed to verify property");
      },
    });
  };

  const handleUnverify = (e, propertyId) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "Are you sure you want to remove your verification from this property?",
      )
    )
      return;

    apiCall.delete({
      route: `/admin/properties/${propertyId}/verify`,
      onSuccess: (res) => {
        if (res.success) {
          alert("Verification removed successfully!");
          const updatedData = res.data;
          // Refresh the list
          if (!id || id === "undefined" || id === "null") {
            setPropertyList((prev) =>
              prev.map((p) =>
                p.propertyId === propertyId
                  ? {
                      ...p,
                      isVerified: updatedData.isVerified,
                      verificationLogs: updatedData.verificationLogs,
                    }
                  : p,
              ),
            );
          } else {
            setProperty((prev) => ({
              ...prev,
              isVerified: updatedData.isVerified,
              verificationLogs: updatedData.verificationLogs,
            }));
          }
        }
      },
      onError: (err) => {
        alert(err.message || "Failed to remove verification");
      },
    });
  };

  const fetchAssignableUsers = () => {
    apiCall.get({
      route: "/admin/users?limit=100",
      onSuccess: (res) => {
        if (res.success) {
          const salesRoles = [
            "Sales Manager",
            "Sales Executive - Property Manager",
          ];
          const filtered = (res.data || []).filter((u) =>
            salesRoles.includes(u.role),
          );
          setAssignableUsers(filtered);
        }
      },
      onError: (err) => {
        console.error("Error fetching users:", err);
      },
    });
  };

  const handleAssignSubmit = () => {
    if (!selectedUserId) {
      alert("Please select a user to assign the property to.");
      return;
    }

    setAssignLoading(true);
    apiCall.put({
      route: `/admin/properties/${id}/assign`,
      payload: { userId: selectedUserId },
      onSuccess: (res) => {
        setAssignLoading(false);
        if (res.success) {
          alert("Property assigned successfully!");
          setIsAssignModalOpen(false);
          // Update local state
          const assignedUser = assignableUsers.find(
            (u) => u.userId === selectedUserId,
          );
          if (assignedUser && property) {
            setProperty((prev) => ({
              ...prev,
              salesId: selectedUserId,
              salesAgent: {
                firstName:
                  assignedUser.firstName || assignedUser.name.split(" ")[0],
                lastName:
                  assignedUser.lastName ||
                  assignedUser.name.split(" ").slice(1).join(" "),
              },
            }));
          }
        }
      },
      onError: (err) => {
        setAssignLoading(false);
        alert(err.message || "Failed to assign property");
      },
    });
  };

  useEffect(() => {
    if (isAssignModalOpen) {
      fetchAssignableUsers();
    }
  }, [isAssignModalOpen]);

  useEffect(() => {
    console.log("PropertyDetails mounted. ID:", id);
    if (id && id !== "undefined" && id !== "null") {
      setLoading(true);
      const fetchRoute = isAdminOrSuperAdmin
        ? `/admin/properties/${id}`
        : `/properties/${id}`;
      apiCall.get({
        route: fetchRoute,
        onSuccess: (res) => {
          console.log("PropertyDetails API Success:", res);
          setLoading(false);
          const data = res.data || res;
          setProperty(data);
        },
        onError: (err) => {
          console.error("PropertyDetails API Error:", err);
          setLoading(false);
          console.error("Error fetching property details:", err);
        },
      });
    } else {
      // Logic for NO ID: Fetch list of properties
      console.log("No ID provided. Fetching property list...");
      setLoading(true);

      const salesRoles = [
        "Sales Manager",
        "Sales Executive",
        "Sales Executive - Property Manager",
        "Sales Executive - Client Dealer",
      ];
      const isSalesRelated = salesRoles.includes(user?.role);

      apiCall.get({
        route: isSalesRelated ? "/properties/assigned" : "/properties?limit=12",
        onSuccess: (res) => {
          setLoading(false);
          if (res.success) {
            console.log(res.data);
            setPropertyList(res.data || []);
          }
        },
        onError: (err) => {
          setLoading(false);
          console.error("Error fetching property list:", err);
        },
      });
    }
  }, [id, user]);

  const fetchNotes = () => {
    if (!id) return;
    setNotesLoading(true);
    apiCall.get({
      route: `/notes/${id}`,
      onSuccess: (res) => {
        setNotesLoading(false);
        if (res.success && res.data?.notes) {
          // The backend returns { property, notes, totalNotes }
          // notes is the record which contains the notes array
          setNotesData(res.data.notes.notes || []);
        } else {
          setNotesData([]);
        }
      },
      onError: (err) => {
        setNotesLoading(false);
        console.error("Error fetching notes:", err);
      },
    });
  };

  useEffect(() => {
    if (activeTab === "notes") {
      fetchNotes();
    }
  }, [activeTab, id]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    apiCall.post({
      route: `/properties/${id}/notes`,
      payload: {
        notes: [
          {
            note: newNote.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      },
      onSuccess: (res) => {
        setIsSubmittingNote(false);
        if (res.success) {
          setNewNote("");
          fetchNotes(); // Refresh notes list
        }
      },
      onError: (err) => {
        setIsSubmittingNote(false);
        alert(err.message || "Failed to add note");
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  // --- No ID Case: Show List ---
  if (!id || id === "undefined" || id === "null") {
    return (
      <div className="bg-gray-50 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight mb-2">
              Select A Property
            </h1>
            <p className="text-gray-600">
              Please choose a property from the list below to view its
              comprehensive details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyList.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500 font-medium">
                No properties available to display.
              </div>
            ) : (
              propertyList.map((item) => (
                <div
                  key={item.propertyId}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col"
                >
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
                            item.isVerified === "partial"
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                        >
                          <MdVerified size={10} />
                          {item.isVerified === "partial"
                            ? "Partial"
                            : "Verified"}
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
                            onClick={(e) => handleVerify(e, item.propertyId)}
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
                        Assigned to: {item.salesAgent.firstName}{" "}
                        {item.salesAgent.lastName}
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
                            onClick={(e) => handleUnverify(e, item.propertyId)}
                            className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-200 transition"
                          >
                            Unverify
                          </button>
                        ) : (
                          <>
                            {item.isVerified !== "completed" &&
                              item.isVerified !== "partial" && (
                                <button
                                  onClick={(e) =>
                                    handleVerify(e, item.propertyId)
                                  }
                                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition"
                                >
                                  Verify
                                </button>
                              )}
                          </>
                        )}
                        <button
                          onClick={() =>
                            navigate(
                              `/property/property-details/${item.propertyId}`,
                            )
                          }
                          className="flex items-center gap-2 bg-[#EE2529] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#D32F2F] transition"
                        >
                          View <MdArrowForward />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Normal Case: Show Details (if property loaded) ---

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-500 font-bold uppercase tracking-widest">
          Property Not Found
        </p>
        <button
          onClick={() => navigate("/property/property-details")}
          className="px-6 py-2 bg-[#EE2529] text-white rounded-lg font-bold uppercase tracking-wider hover:bg-[#D32F2F] transition"
        >
          View All Properties
        </button>
      </div>
    );
  }

  // --- Content Renderers ---

  const renderPropertyContent = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* Description */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="flex gap-2">
            <span className="bg-[#FFF8E1] text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <MdStar /> Premium Location
            </span>
            {property.tenantType && (
              <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                {property.tenantType} Client
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-600 transition">
              <FiDownload size={14} /> Download Brochure
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-600 transition">
              <FiShare2 size={14} /> Share
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-tight">
          {property.microMarket || `${property.propertyType} Space`}
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          Excellent {property.propertyType} property located at {property.city},{" "}
          {property.state}. Offering a great investment opportunity with an
          expected ROI of {property.grossRentalYield || "N/A"}%. This property
          features {property.carpetArea} {property.carpetAreaUnit} of premium
          space in a {property.buildingGrade || "Grade A"} building.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Basic Information" icon={FiInfo}>
          <InfoRow label="Property ID" value={property.propertyId} />
          <InfoRow label="Property Type" value={property.propertyType} />
          <InfoRow label="Price" value={`₹${property.sellingPrice} Cr`} />
          <InfoRow label="Building Grade" value={property.buildingGrade} />
          <InfoRow
            label="Carpet Area"
            value={`${property.carpetArea} ${property.carpetAreaUnit}`}
          />
          <InfoRow label="Built Year" value={property.completionYear} />
          <InfoRow label="Ownership" value={property.ownershipType} />
          <InfoRow
            label="Assigned Agent"
            value={
              property.salesAgent
                ? `${property.salesAgent.firstName} ${property.salesAgent.lastName}`
                : "Not Assigned"
            }
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Legal & Title" icon={FaRegFileAlt}>
          <InfoRow
            label="Lease Registration"
            value={property.leaseRegistration}
          />
          <InfoRow label="OC Status" value={property.occupancyCertificate} />
          <InfoRow label="Litigation" value={property.titleStatus} />
          <InfoRow label="RERA ID" value={property.reraId || "N/A"} />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Amenities" icon={MdFitnessCenter}>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MdLocalParking className="text-[#EE2529]" />
              <span className="font-semibold">
                {property.parkingFourWheeler} Car Parking
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MdPower className="text-[#EE2529]" />
              <span className="font-semibold">{property.powerBackup}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MdSecurity className="text-[#EE2529]" />
              <span className="font-semibold">24/7 Security</span>
            </div>
            {property.amenities?.map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <MdCheckCircle className="text-[#EE2529]" />
                <span className="font-semibold">{amenity.amenityName}</span>
              </div>
            ))}
          </div>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Infrastructure" icon={MdBusiness}>
          <InfoRow label="Total Floors" value={property.totalFloors} />
          <InfoRow label="Wing/Block" value={property.wing} />
          <InfoRow label="Lifts" value={property.numberOfLifts} />
          <InfoRow label="HVAC System" value={property.hvacType || "Central"} />
          <InfoRow
            label="Maintenance"
            value={property.caretaker?.caretakerName || "Professional"}
          />
        </PropertyDetailsCard>

        {property.verificationLogs && property.verificationLogs.length > 0 && (
          <PropertyDetailsCard title="Verification History" icon={MdVerified}>
            <div className="space-y-4">
              {property.verificationLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 pb-3 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-800">
                      {log.name}
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 uppercase">
                      {log.role}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span>{log.email}</span>
                    <span>{new Date(log.verifiedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </PropertyDetailsCard>
        )}
      </div>
    </div>
  );

  const renderLeaseContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight mb-2">
          Lease & Tenant Details
        </h2>
        <p className="text-gray-500 text-sm">
          Comprehensive breakdown of current lease terms and tenant information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Tenant Profile" icon={MdBusiness}>
          <InfoRow
            label="Tenant Name"
            value={property.tenantName || "Available"}
          />
          <InfoRow label="Industry" value={property.tenantIndustry || "N/A"} />
          <InfoRow label="Tenant Type" value={property.tenantType} />
          <InfoRow
            label="Occupancy Status"
            value={property.isActive ? "Occupied" : "Vacant"}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Financials" icon={FaChartLine}>
          <InfoRow
            label="Monthly Rent"
            value={`₹${property.totalMonthlyRent}`}
          />
          <InfoRow
            label="Security Deposit"
            value={`₹${property.securityDepositAmount} (${property.securityDepositMonths} Mos)`}
          />
          <InfoRow
            label="Rent / Sq.ft"
            value={`₹${property.rentPerSqftMonthly}`}
          />
          <InfoRow
            label="Maintenance"
            value={property.maintenanceCostsIncluded ? "Included" : "Excluded"}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Lease Terms" icon={FaRegFileAlt}>
          <InfoRow
            label="Start Date"
            value={new Date(property.leaseStartDate).toLocaleDateString()}
          />
          <InfoRow
            label="End Date"
            value={new Date(property.leaseEndDate).toLocaleDateString()}
          />
          <InfoRow
            label="Lock-in Period"
            value={`${property.lockInPeriodYears} Yrs ${property.lockInPeriodMonths} Months`}
          />
          <InfoRow
            label="Total Duration"
            value={`${property.leaseDurationYears} Yrs`}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Escalation" icon={FaChartLine}>
          <InfoRow
            label="Escalation Rate"
            value={`${property.annualEscalationPercent}%`}
          />
          <InfoRow
            label="Frequency"
            value={`Every ${property.escalationFrequencyYears} Years`}
          />
          <InfoRow label="Next Escalation" value="12 Aug 2026" />
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Gross Yield",
            value: `${property.grossRentalYield || 0}%`,
            icon: FiActivity,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Net Yield",
            value: `${property.netRentalYield || 0}%`,
            icon: FaChartLine,
            color: "text-green-500",
            bg: "bg-green-50",
          },
          {
            label: "Payback Period",
            value: `${property.paybackPeriodYears || 0} Yrs`,
            icon: FiCalendar,
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            label: "Annual Rent",
            value: `₹${property.annualGrossRent || 0} L`,
            icon: MdVerified,
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition"
          >
            <div className={`p-3 rounded-xl mb-3 ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              {stat.label}
            </p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Investment Summary" icon={FaChartLine}>
          <InfoRow
            label="Total Investment"
            value={`₹${property.sellingPrice} Cr`}
          />
          <InfoRow
            label="Gross Annual Rent"
            value={`₹${property.annualGrossRent} L`}
          />
          <InfoRow
            label="Annual Expenses"
            value={`₹${property.totalOperatingAnnualCosts} L`}
          />
          <div className="my-2 border-t border-dashed border-gray-200"></div>
          <div className="flex justify-between py-2 px-2 rounded-lg bg-green-50">
            <span className="text-xs font-bold text-green-700 uppercase">
              Net Annual Income
            </span>
            <span className="text-sm font-black text-green-700">
              ₹{property.netAnnualIncome} L
            </span>
          </div>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Annual Expenses" icon={FiInfo}>
          <InfoRow
            label="Property Tax"
            value={`₹${property.propertyTaxAnnual} L`}
          />
          <InfoRow label="Insurance" value={`₹${property.insuranceAnnual} L`} />
          <InfoRow
            label="Maintenance"
            value={`₹${property.maintenanceAmount} L`}
          />
          <InfoRow label="Mgmt Fees" value="₹0.5 L" />
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderLocationContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-80 relative group">
        {/* Placeholder Map - In real app insert Google Maps Iframe or Component */}
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <FaMapMarkedAlt className="text-gray-400 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">
              Interactive Map View
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {property.city}, {property.state}
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg max-w-xs">
          <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm mb-1">
            <FiMapPin className="text-[#EE2529]" /> {property.microMarket}
          </h4>
          <p className="text-xs text-gray-500 pl-6">
            {property.city}, {property.state}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Connectivity" icon={MdTrain}>
          <InfoRow label="Airport" value="12 km" />
          <InfoRow label="Metro Station" value="1.5 km" />
          <InfoRow label="Highway Access" value="200 m" />
          <InfoRow label="Bus Terminal" value="500 m" />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Demand Drivers" icon={MdBusiness}>
          <ul className="space-y-3 px-2">
            {[
              "Proximity to IT Parks",
              "High demand for Grade A Office",
              "Planned Metro Phase 2",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-gray-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EE2529] mt-1.5"></span>
                {item}
              </li>
            ))}
          </ul>
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderNotesContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight mb-2">
          Notes for the property owner
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Add important notes that will be visible to the property owner in
          their dashboard.
        </p>

        {/* Add Note Input */}
        <div className="mb-8">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type your note here..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-4 focus:ring-[#EE2529]/10 focus:border-[#EE2529] transition-all outline-none resize-none min-h-[120px]"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSubmittingNote}
              className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all flex items-center gap-2 ${
                !newNote.trim() || isSubmittingNote
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-[#EE2529] hover:bg-[#D32F2F] active:scale-95"
              }`}
            >
              {isSubmittingNote ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FiMessageSquare />
              )}
              Add Note
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            Previous Notes
          </h3>
          {notesLoading ? (
            <div className="py-8 text-center">
              <div className="w-8 h-8 border-3 border-[#EE2529] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Fetching notes...
              </p>
            </div>
          ) : notesData.length === 0 ? (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <FiFileText size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-400 font-medium">
                No notes added yet for this property.
              </p>
            </div>
          ) : (
            notesData.map((note, idx) => (
              <div
                key={idx}
                className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#EE2529]">
                      <FiMessageSquare size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-800">
                        Agent / Admin
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Sales Representative
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {new Date(note.createdAt).toLocaleDateString()} at{" "}
                    {new Date(note.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-10">
                  {note.note}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );

  const renderFaqContent = () => (
    <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
      {[
        "Can we schedule a virtual tour?",
        "What are the property tax rates?",
        "Are there association fees?",
        "Lease renewal terms?",
      ].map((q, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
        >
          <button
            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
            className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition"
          >
            <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              {q}
            </span>
            <FiHelpCircle
              className={`text-gray-400 transition-transform ${activeFaq === i ? "rotate-180 text-[#EE2529]" : ""}`}
            />
          </button>
          {activeFaq === i && (
            <div className="p-5 pt-0 bg-gray-50 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition text-gray-600"
          >
            <FiArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-gray-800 uppercase tracking-[0.1em] sm:tracking-widest">
            Overview
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {property && (
            <div className="flex items-center gap-2">
              <span
                className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1 ${
                  property.isVerified === "completed"
                    ? "bg-green-100 text-green-700"
                    : property.isVerified === "partial"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <MdVerified className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{" "}
                {property.isVerified === "completed"
                  ? "Verified"
                  : property.isVerified === "partial"
                    ? "Partially"
                    : "Pending"}
              </span>

              {[
                "Admin",
                "Super Admin",
                "Sales Manager",
                "Sales Executive - Property Manager",
              ].includes(user?.role) && (
                <>
                  {property.verificationLogs?.some(
                    (log) => log.userId === user?.userId,
                  ) ? (
                    <button
                      onClick={(e) => handleUnverify(e, property.propertyId)}
                      className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      Unverify
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleVerify(e, property.propertyId)}
                      className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                    >
                      {property.isVerified === "partial"
                        ? "2nd Verify"
                        : "Verify Now"}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
          {canAssignProperty && property && (
            <button
              onClick={() => {
                if (property.salesId) {
                  setSelectedUserId(property.salesId);
                }
                setIsAssignModalOpen(true);
              }}
              className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
            >
              {property.salesId ? "Reassign" : "Assign"}
            </button>
          )}
          <span
            className={`px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded bg-blue-100 text-blue-700`}
          >
            {property?.status || "For Sale"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                {property?.media?.[0]?.fileUrl ? (
                  <img
                    src={property.media[0].fileUrl}
                    alt="Property"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <FiImage size={64} className="mb-3 opacity-50" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
                      No Image Available
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-2 text-[#EE2529]">
                  <FiHeart className="fill-current" />
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiPhone className="text-[#EE2529]" /> Contact Agent
              </h3>
              <div className="space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Have specific questions? Our property advisors are ready to
                  help you with viewing arrangements and negotiations.
                </p>
                <button className="w-full bg-[#EE2529] hover:bg-[#D32F2F] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-100 text-sm uppercase tracking-wider">
                  <FiPhone /> Call Now
                </button>
                <button className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                  <FiMessageSquare /> Message
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs & Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide">
                {[
                  { id: "property", label: "Property", icon: FaRegBuilding },
                  { id: "lease", label: "Lease", icon: FiFileText },
                  { id: "analytics", label: "Analytics", icon: FaChartLine },
                  { id: "location", label: "Location", icon: FiMapPin },
                  user?.role === "Sales Executive - Property Manager" && {
                    id: "notes",
                    label: "Notes",
                    icon: FiMessageSquare,
                  },
                  { id: "faqs", label: "FAQs", icon: FiHelpCircle },
                ]
                  .filter(Boolean)
                  .map((tab) => (
                    <TabButton
                      key={tab.id}
                      {...tab}
                      active={activeTab === tab.id}
                      onClick={setActiveTab}
                    />
                  ))}
              </div>
            </div>

            <div className="min-h-[500px]">
              {activeTab === "property" && renderPropertyContent()}
              {activeTab === "lease" && renderLeaseContent()}
              {activeTab === "analytics" && renderAnalyticsContent()}
              {activeTab === "location" && renderLocationContent()}
              {activeTab === "notes" &&
                user?.role === "Sales Executive - Property Manager" &&
                renderNotesContent()}
              {activeTab === "faqs" && renderFaqContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scaleIn border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight mb-0.5">
                  {property?.salesId ? "Change Representative" : "Assign Agent"}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                  Team assignment management
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2.5">
                  Sales Agent
                </label>
                <div className="relative group">
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-[#EE2529]/10 focus:border-[#EE2529] transition-all outline-none appearance-none cursor-pointer group-hover:bg-white"
                  >
                    <option value="">Select from team list</option>
                    {assignableUsers.map((u) => (
                      <option key={u.userId} value={u.userId}>
                        {u.name || `${u.firstName} ${u.lastName}`} (
                        {u.role === "Sales Manager" ? "MGR" : "EXEC"})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <MdArrowForward className="rotate-90" />
                  </div>
                </div>
              </div>

              {selectedUserId && (
                <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3">
                  <FiInfo
                    className="text-indigo-500 mt-0.5 shrink-0"
                    size={14}
                  />
                  <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-tight">
                    The chosen agent will manage verification and inquiries for
                    this property. Review your choice before confirming.
                  </p>
                </div>
              )}
            </div>

            <div className="p-5 bg-gray-50/50 flex gap-3 border-t border-gray-100">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-white hover:text-gray-700 transition-all border border-transparent hover:border-gray-200"
              >
                Cancel
              </button>
              <button
                disabled={
                  !selectedUserId ||
                  assignLoading ||
                  selectedUserId === property?.salesId
                }
                onClick={handleAssignSubmit}
                className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  !selectedUserId ||
                  assignLoading ||
                  selectedUserId === property?.salesId
                    ? "bg-gray-200 cursor-not-allowed shadow-none"
                    : "bg-[#EE2529] hover:bg-[#D32F2F] shadow-red-200 active:scale-95"
                }`}
              >
                {assignLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : selectedUserId === property?.salesId ? (
                  "No Change"
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatPrice } from "../../../../../helpers/formatPrice";
import {
  FiShare2,
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
import PropertyCard from "../Common/PropertyCard";
import VerificationFilter from "../Common/VerificationFilter";
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
  FaQuestionCircle,
} from "react-icons/fa";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { CLIENT_URL } from "../../../../../environments";
import { useUserStorage } from "../../../../../helpers/useUserStorage";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PropertyBrochure from "./PropertyBrochure";
import NotesAndActivityModal from "../../WorkBoard/NotesAndActivityModal";
import InquiryMessagesModal from "../../Enquiry/InquiryMessagesModal";
import {
  showSuccess,
  showError,
  showWarning,
  confirmAction,
} from "../../../../../helpers/swalHelper";

// --- Helpers ---

// Safely format a date, returning "N/A" for missing / invalid / epoch (1970) values.
const safeDate = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "N/A";
  // Treat the Unix epoch (or anything before 1971) as "no real date".
  if (d.getFullYear() <= 1970) return "N/A";
  return d.toLocaleDateString();
};

// Render a numeric value with a unit, falling back to "N/A" when missing.
// e.g. safeUnit(property.leaseDurationYears, "Yrs") => "5 Yrs" | "N/A"
const safeUnit = (value, unit = "") =>
  value === null || value === undefined || value === ""
    ? "N/A"
    : `${value}${unit ? ` ${unit}` : ""}`;

// Analytics figures are stored in Lakhs (suffixed with " L"). Guard nulls so we
// render "N/A" instead of "₹null L".
// Values are stored in rupees. Render as lakhs (₹ … L) by dividing by 1e5,
// e.g. 60000 -> "₹0.60 L", 5000000 -> "₹50.00 L".
const lakhs = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `₹${(num / 100000).toFixed(2)} L`;
};

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
  const [activeMedia, setActiveMedia] = useState(0); // index into property.media
  const [verificationFilter, setVerificationFilter] = useState("all");

  // Assignment States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // Pagination States
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Notes States
  const [isNotesActivityOpen, setIsNotesActivityOpen] = useState(false);
  const [notesData, setNotesData] = useState([]);

  // Enquiry messages tab: this property's enquiries + the open conversation.
  const [propertyEnquiries, setPropertyEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [messageInquiry, setMessageInquiry] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const isAdminOrSuperAdmin = ["Admin", "Super Admin"].includes(user?.role);
  const isSalesManager = user?.role === "Sales Manager";
  const canAssignProperty = isAdminOrSuperAdmin || isSalesManager;

  // Share points to the consumer (client-facing) site, NOT the admin app.
  const handleShare = async () => {
    const propertyId = property?.propertyId || id;
    if (!propertyId) {
      showError("No property to share yet.");
      return;
    }
    const shareUrl = `${CLIENT_URL}/propertyDetails/${propertyId}`;
    const title = property?.microMarket
      ? `${property.microMarket}, ${property.city || ""}`
      : `${property?.propertyType || "Property"} in ${property?.city || ""}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check out this property: ${title}`,
          url: shareUrl,
        });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showSuccess("Property link copied to clipboard!");
        return;
      }
      // Last-resort fallback for browsers without the Clipboard API.
      window.prompt("Copy this property link:", shareUrl);
    } catch (err) {
      // User dismissing the native share sheet is not an error.
      if (err?.name === "AbortError") return;
      showError("Unable to share this property.");
    }
  };

  const handleVerify = async (e, propertyId) => {
    e.stopPropagation();
    const isConfirmed = await confirmAction(
      "Verify Property?",
      "Are you sure you want to verify this property?",
      "Yes, verify it!",
    );
    if (!isConfirmed) return;

    apiCall.post({
      route: `/admin/properties/${propertyId}/verify`,
      onSuccess: (res) => {
        if (res.success) {
          showSuccess("Property verified successfully!");
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
        showError(err.message || "Failed to verify property");
      },
    });
  };

  const handleUnverify = async (e, propertyId) => {
    e.stopPropagation();
    const isConfirmed = await confirmAction(
      "Remove Verification?",
      "Are you sure you want to remove your verification from this property?",
      "Yes, remove it!",
    );
    if (!isConfirmed) return;

    apiCall.delete({
      route: `/admin/properties/${propertyId}/verify`,
      onSuccess: (res) => {
        if (res.success) {
          showSuccess("Verification removed successfully!");
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
        showError(err.message || "Failed to remove verification");
      },
    });
  };

  const fetchAssignableUsers = () => {
    apiCall.get({
      route: "/admin/users?limit=100",
      onSuccess: (res) => {
        if (res.success) {
          const salesRoles = [
            // "Sales Manager",
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
      showWarning("Please select a user to assign the property to.");
      return;
    }

    setAssignLoading(true);
    apiCall.put({
      route: `/admin/properties/${id}/assign`,
      payload: { userId: selectedUserId },
      onSuccess: (res) => {
        setAssignLoading(false);
        if (res.success) {
          showSuccess("Property assigned successfully!");
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
        showError(err.message || "Failed to assign property");
      },
    });
  };

  useEffect(() => {
    if (isAssignModalOpen) {
      fetchAssignableUsers();
    }
  }, [isAssignModalOpen]);

  const fetchPropertyList = (page = 1) => {
    if (id && id !== "undefined" && id !== "null") return;
    setLoading(true);

    const salesRoles = [
      "Sales Manager",
      "Sales Executive",
      "Sales Executive - Property Manager",
      "Sales Executive - Client Dealer",
    ];
    const isSalesRelated = salesRoles.includes(user?.role);
    const baseRoute = isSalesRelated ? "/properties/assigned" : "/properties";
    let route = `${baseRoute}?page=${page}&limit=9`;

    if (verificationFilter !== "all") {
      const mappedFilter =
        verificationFilter === "verified" ? "completed" : verificationFilter;
      route += `&isVerified=${mappedFilter}`;
    }

    apiCall.get({
      route,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setPropertyList(res.data || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching property list:", err);
      },
    });
  };

  useEffect(() => {
    if (!id || id === "undefined" || id === "null") {
      fetchPropertyList(1);
    }
  }, [verificationFilter]);

  useEffect(() => {
    if (id && id !== "undefined" && id !== "null") {
      setLoading(true);
      const fetchRoute = isAdminOrSuperAdmin
        ? `/admin/properties/${id}`
        : `/properties/${id}`;
      apiCall.get({
        route: fetchRoute,
        onSuccess: (res) => {
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
      fetchPropertyList(1);
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

  // Load this property's enquiries (the dealer's assigned ones) for the
  // Messages tab — filtered from the assigned-inquiries list by propertyId.
  const fetchPropertyEnquiries = () => {
    setEnquiriesLoading(true);
    apiCall.get({
      route: "/sales/assigned-inquiries?limit=200",
      onSuccess: (res) => {
        setEnquiriesLoading(false);
        const list = Array.isArray(res?.data) ? res.data : res?.data?.rows || [];
        // Match on the inquiry's propertyId (top-level or nested property).
        setPropertyEnquiries(
          list.filter(
            (i) => i.propertyId === id || i.property?.propertyId === id
          )
        );
      },
      onError: () => setEnquiriesLoading(false),
    });
  };

  useEffect(() => {
    if (activeTab === "messages") {
      fetchPropertyEnquiries();
    }
  }, [activeTab, id]);


  const handleAddNote = () => {
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    apiCall.post({
      route: `/properties/${id}/notes`,
      payload: {
        notes: newNote.trim(),
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
        showError(err.message || "Failed to add note");
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

          {/* Verification Filters */}
          <VerificationFilter
            currentFilter={verificationFilter}
            onFilterChange={setVerificationFilter}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyList.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <FiInfo size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-black uppercase tracking-widest">
                  No {verificationFilter !== "all" ? verificationFilter : ""}{" "}
                  properties found
                </p>
                <p className="text-xs text-gray-400 mt-2 font-bold uppercase">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              propertyList.map((item) => (
                <PropertyCard
                  key={item.propertyId}
                  item={item}
                  user={user}
                  onVerify={handleVerify}
                  onUnverify={handleUnverify}
                  onView={(id) => navigate(`/property/property-details/${id}`)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pb-10">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => fetchPropertyList(pagination.currentPage - 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-extrabold text-xs uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => fetchPropertyList(i + 1)}
                    className={`w-10 h-10 rounded-lg font-black text-xs transition-all ${
                      pagination.currentPage === i + 1
                        ? "bg-[#EE2529] text-white shadow-lg shadow-red-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => fetchPropertyList(pagination.currentPage + 1)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-extrabold text-xs uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
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
            <PDFDownloadLink
              document={<PropertyBrochure property={property} />}
              fileName={`Brochure-${property.propertyId || "Property"}.pdf`}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              {({ loading }) =>
                loading ? (
                  "Preparing..."
                ) : (
                  <>
                    <FiDownload size={14} /> Download Brochure
                  </>
                )
              }
            </PDFDownloadLink>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-600 transition"
            >
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
          space{property.buildingGrade ? ` in a ${property.buildingGrade} building` : ""}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Basic Information" icon={FiInfo}>
          {/* <InfoRow label="Property ID" value={property.propertyId} /> */}
          <InfoRow label="Property Type" value={property.propertyType} />
          <InfoRow label="Price" value={formatPrice(property.sellingPrice)} />
          <InfoRow label="Building Grade" value={property.buildingGrade} />
          <InfoRow
            label="Carpet Area"
            value={
              property.carpetArea
                ? `${property.carpetArea} ${property.carpetAreaUnit || "sqft"}`
                : "N/A"
            }
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
            {property.parkingFourWheeler > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MdLocalParking className="text-[#EE2529]" />
                <span className="font-semibold">
                  {property.parkingFourWheeler} Car Parking
                </span>
              </div>
            )}
            {property.parkingTwoWheeler > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MdLocalParking className="text-[#EE2529]" />
                <span className="font-semibold">
                  {property.parkingTwoWheeler} Bike Parking
                </span>
              </div>
            )}
            {property.powerBackup && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MdPower className="text-[#EE2529]" />
                <span className="font-semibold">{property.powerBackup} Power Backup</span>
              </div>
            )}
            {property.amenities?.map((amenity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <MdCheckCircle className="text-[#EE2529]" />
                <span className="font-semibold">{amenity.amenityName}</span>
              </div>
            ))}
            {!property.parkingFourWheeler &&
              !property.parkingTwoWheeler &&
              !property.powerBackup &&
              (!property.amenities || property.amenities.length === 0) && (
                <p className="text-sm text-gray-400 col-span-2">No amenities added.</p>
              )}
          </div>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Infrastructure" icon={MdBusiness}>
          <InfoRow label="Lifts" value={property.numberOfLifts ?? "N/A"} />
          <InfoRow label="Furnishing" value={property.furnishingStatus || "N/A"} />
          <InfoRow label="HVAC System" value={property.hvacType || "N/A"} />
          <InfoRow
            label="Maintained By"
            value={property.caretaker?.caretakerName || "N/A"}
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
                    <span>{safeDate(log.verifiedAt)}</span>
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
            value={formatPrice(property.totalMonthlyRent)}
          />
          <InfoRow
            label="Security Deposit"
            value={
              property.securityDepositMonths
                ? `${formatPrice(property.securityDepositAmount)} (${property.securityDepositMonths} Mos)`
                : formatPrice(property.securityDepositAmount)
            }
          />
          <InfoRow
            label="Rent / Sq.ft"
            value={formatPrice(property.rentPerSqftMonthly)}
          />
          <InfoRow
            label="Maintenance"
            value={property.maintenanceCostsIncluded ? "Included" : "Excluded"}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Lease Terms" icon={FaRegFileAlt}>
          <InfoRow label="Start Date" value={safeDate(property.leaseStartDate)} />
          <InfoRow label="End Date" value={safeDate(property.leaseEndDate)} />
          <InfoRow
            label="Lock-in Period"
            value={
              property.lockInPeriodYears == null &&
              property.lockInPeriodMonths == null
                ? "N/A"
                : `${property.lockInPeriodYears ?? 0} Yrs ${
                    property.lockInPeriodMonths ?? 0
                  } Months`
            }
          />
          <InfoRow
            label="Total Duration"
            value={safeUnit(property.leaseDurationYears, "Yrs")}
          />
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Escalation" icon={FaChartLine}>
          <InfoRow
            label="Escalation Rate"
            value={
              property.annualEscalationPercent == null
                ? "N/A"
                : `${property.annualEscalationPercent}%`
            }
          />
          <InfoRow
            label="Frequency"
            value={
              property.escalationFrequencyYears == null
                ? "N/A"
                : `Every ${property.escalationFrequencyYears} Years`
            }
          />
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
            value: lakhs(property.annualGrossRent),
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
            value={formatPrice(property.sellingPrice)}
          />
          <InfoRow
            label="Gross Annual Rent"
            value={lakhs(property.annualGrossRent)}
          />
          <InfoRow
            label="Annual Expenses"
            value={lakhs(property.totalOperatingAnnualCosts)}
          />
          <div className="my-2 border-t border-dashed border-gray-200"></div>
          <div className="flex justify-between py-2 px-2 rounded-lg bg-green-50">
            <span className="text-xs font-bold text-green-700 uppercase">
              Net Annual Income
            </span>
            <span className="text-sm font-black text-green-700">
              {lakhs(property.netAnnualIncome)}
            </span>
          </div>
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Annual Expenses" icon={FiInfo}>
          <InfoRow
            label="Property Tax"
            value={lakhs(property.propertyTaxAnnual)}
          />
          <InfoRow label="Insurance" value={lakhs(property.insuranceAnnual)} />
          <InfoRow
            label="Maintenance"
            value={lakhs(property.maintenanceAmount)}
          />
          <InfoRow label="Other Costs" value={lakhs(property.otherCostsAnnual)} />
        </PropertyDetailsCard>
      </div>
    </div>
  );

  const renderLocationContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm mb-1">
          <FiMapPin className="text-[#EE2529]" /> {property.microMarket}
        </h4>
        <p className="text-xs text-gray-500 pl-6">
          {property.city}, {property.state}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PropertyDetailsCard title="Connectivity" icon={MdTrain}>
          {Array.isArray(property.connectivity) && property.connectivity.length > 0 ? (
            property.connectivity.map((c, i) => (
              <InfoRow
                key={c.connectivityId || i}
                label={[c.connectivityType, c.name].filter(Boolean).join(" — ") || "Connectivity"}
                value={
                  c.distanceKm !== null && c.distanceKm !== undefined && c.distanceKm !== ""
                    ? `${c.distanceKm} km`
                    : "—"
                }
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 px-2 py-3">
              No connectivity details added.
            </p>
          )}
        </PropertyDetailsCard>

        <PropertyDetailsCard title="Market Intelligence" icon={MdBusiness}>
          <div className="px-2 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Demand Drivers
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {property.demandDrivers || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                Upcoming Developments
              </p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {property.upcomingDevelopments || "—"}
              </p>
            </div>
          </div>
        </PropertyDetailsCard>
      </div>
    </div>
  );
  console.log(property);
  // The Notes tab now opens the full "Notes & Activity" approval experience
  // (All / Pending / Approved / Declined + Approve / Edit & Approve / Decline),
  // which also parses the API response correctly (the old inline list mis-read
  // the response shape and always showed empty).
  const renderNotesContent = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#EE2529] mx-auto mb-4">
          <FiMessageSquare size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Notes &amp; Activity</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Review notes submitted by the team, approve or decline them before they
          reach the client, and add your own.
        </p>
        <button
          onClick={() => setIsNotesActivityOpen(true)}
          className="px-6 py-3 bg-[#EE2529] hover:bg-[#D32F2F] text-white rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-all active:scale-95"
        >
          <FiMessageSquare size={16} /> Open Notes &amp; Activity
        </button>
      </div>
    </div>
  );

  // Legacy inline notes view (kept out of the render tree; superseded by the
  // NotesAndActivityModal above).
  const renderNotesContentLegacy = () => (
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
        {property.isVerified !== "completed" && (
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
        )}
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
                        Property Dealer
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

  // Messages tab — this property's enquiries; open a conversation per enquiry.
  const renderMessagesContent = () => (
    <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Enquiry Messages</h2>
        <p className="text-gray-500 text-sm mb-5">
          Conversations with clients who enquired about this property. Your
          messages are reviewed by an admin before the client sees them.
        </p>

        {enquiriesLoading ? (
          <div className="py-10 text-center text-gray-400 text-sm">Loading enquiries…</div>
        ) : propertyEnquiries.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <FiMessageSquare size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-400 font-medium">
              No enquiries assigned to you for this property.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {propertyEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {enq.inquirer?.firstName} {enq.inquirer?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 italic line-clamp-1">
                    "{enq.inquiry || "No message"}"
                  </p>
                </div>
                <button
                  onClick={() => setMessageInquiry(enq)}
                  className="shrink-0 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-[#EE2529] transition-all flex items-center gap-2"
                >
                  <FiMessageSquare size={14} /> Open Conversation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderFaqContent = () => {
    // FAQs are stored on the property as an array of { question, answer }.
    // They are optional, so guard against a missing/empty list.
    const faqs = Array.isArray(property?.faqs) ? property.faqs : [];

    if (faqs.length === 0) {
      return (
        <div className="animate-fadeIn max-w-3xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-sm">
            <FiHelpCircle className="mx-auto text-gray-300 w-10 h-10 mb-3" />
            <p className="text-gray-500 text-sm font-medium">
              No FAQs were added for this property.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fadeIn max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <button
              onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition"
            >
              <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                {faq.question}
              </span>
              <FiHelpCircle
                className={`text-gray-400 transition-transform shrink-0 ml-3 ${activeFaq === i ? "rotate-180 text-[#EE2529]" : ""}`}
              />
            </button>
            {activeFaq === i && (
              <div className="p-5 pt-0 bg-gray-50 text-sm text-gray-600 leading-relaxed border-t border-gray-100 whitespace-pre-wrap">
                {faq.answer || "—"}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

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
                    // Current user is one of the verifiers — they can remove
                    // their own verification regardless of overall status.
                    <button
                      onClick={(e) => handleUnverify(e, property.propertyId)}
                      className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      Unverify
                    </button>
                  ) : (
                    // Only offer to verify while the property still needs it.
                    // Once it's "completed" (2+ distinct roles verified), no
                    // further verification is needed — hide the button.
                    property.isVerified !== "completed" && (
                      <button
                        onClick={(e) => handleVerify(e, property.propertyId)}
                        className="px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                      >
                        {property.isVerified === "partial"
                          ? "2nd Verify"
                          : "Verify Now"}
                      </button>
                    )
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
              {(() => {
                const mediaList = Array.isArray(property?.media) ? property.media : [];
                const current = mediaList[activeMedia] || mediaList[0];
                return (
                  <>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative">
                      {current?.fileUrl ? (
                        current.mediaType === "video" ? (
                          <video
                            src={current.fileUrl}
                            controls
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={current.fileUrl}
                            alt="Property"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                          <FiImage size={64} className="mb-3 opacity-50" />
                          <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-50">
                            No Image Available
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Thumbnail strip — all images/videos for this property */}
                    {mediaList.length > 1 && (
                      <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                        {mediaList.map((m, i) => (
                          <button
                            key={m.mediaId || i}
                            onClick={() => setActiveMedia(i)}
                            className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                              i === activeMedia ? "border-[#EE2529]" : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            {m.mediaType === "video" ? (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-[10px] font-bold">
                                VIDEO
                              </div>
                            ) : (
                              <img src={m.fileUrl} alt={`Media ${i + 1}`} className="w-full h-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
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
                <button
                  onClick={() => {
                    const phone = property.salesAgent?.mobileNumber;
                    if (phone) {
                      window.location.href = `tel:${phone}`;
                    } else {
                      showWarning("No agent is assigned to this property yet.");
                    }
                  }}
                  className="w-full bg-[#EE2529] hover:bg-[#D32F2F] text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-red-100 text-sm uppercase tracking-wider"
                >
                  <FiPhone /> Call Now
                </button>
                <button
                  onClick={() => {
                    const email = property.salesAgent?.email;
                    if (email) {
                      const subject = encodeURIComponent(
                        `Enquiry about property ${property.propertyId || ""}`,
                      );
                      window.location.href = `mailto:${email}?subject=${subject}`;
                    } else {
                      showWarning("No agent is assigned to this property yet.");
                    }
                  }}
                  className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
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
                  // Notes are written by property managers and reviewed by the
                  // staff who manage properties — show the tab to Admin/Super
                  // Admin/Sales Manager and the Property Manager.
                  (isAdminOrSuperAdmin ||
                    isSalesManager ||
                    user?.role === "Sales Executive - Property Manager") && {
                    id: "notes",
                    label: "Notes",
                    icon: FiMessageSquare,
                  },
                  // Enquiry messages — for the Client Dealer who handles this
                  // property's enquiries (and admins/managers).
                  (isAdminOrSuperAdmin ||
                    isSalesManager ||
                    user?.role === "Sales Executive - Client Dealer") && {
                    id: "messages",
                    label: "Messages",
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
                (isAdminOrSuperAdmin ||
                  isSalesManager ||
                  user?.role === "Sales Executive - Property Manager") &&
                renderNotesContent()}
              {activeTab === "messages" && renderMessagesContent()}
              {activeTab === "faqs" && renderFaqContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
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

      {/* Full Notes & Activity approval experience (opened from the Notes tab) */}
      <NotesAndActivityModal
        isOpen={isNotesActivityOpen}
        onClose={() => setIsNotesActivityOpen(false)}
        property={property}
        onNoteAdded={() => fetchNotes()}
      />

      {/* Enquiry conversation (opened from the Messages tab) */}
      <InquiryMessagesModal
        isOpen={!!messageInquiry}
        inquiry={messageInquiry}
        onClose={() => setMessageInquiry(null)}
      />
    </div>
  );
};

export default PropertyDetails;

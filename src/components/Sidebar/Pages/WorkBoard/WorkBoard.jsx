import React, { useState, useEffect, useCallback, useMemo } from "react";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useAuth } from "../../../../context/AuthContext";

// Sub-components
import AnalyticsSummary from "./components/AnalyticsSummary";
import WorkBoardHeader from "./components/WorkBoardHeader";
import EnquirySection from "./components/EnquirySection";
import PropertyBoard from "./components/PropertyBoard";
import AssignPropertyModal from "./components/AssignPropertyModal";

const WorkBoard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Enquiry States
  const [inquiries, setInquiries] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedExec, setSelectedExec] = useState("");
  const [assignInquiryLoading, setAssignInquiryLoading] = useState(false);
  const [autoAssignLoading, setAutoAssignLoading] = useState(null);

  // Property States
  const [properties, setProperties] = useState([]);
  const [viewType, setViewType] = useState("all"); // all, assigned, unassigned
  const [assignPropertyLoading, setAssignPropertyLoading] = useState(false);

  // --- Assignment Modal States & Handlers ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetProperty, setTargetProperty] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Role Permissions
  const isAdminOrManager = useMemo(
    () => ["Admin", "Super Admin", "Sales Manager"].includes(user?.role),
    [user?.role],
  );

  const isClientDealer = user?.role === "Sales Executive - Client Dealer";
  const isPropertyManager = user?.role === "Sales Executive - Property Manager";

  const showEnquiries = isAdminOrManager || isClientDealer;
  const showProperties = isAdminOrManager || isPropertyManager;

  // --- Fetch Data ---

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const promises = [];

      // Fetch Enquiries if role allows
      if (showEnquiries) {
        const enquiryEndpoint = isAdminOrManager
          ? "/admin/pending-inquiries"
          : "/sales/assigned-inquiries";

        promises.push(
          apiCall.get({
            route: enquiryEndpoint,
            onSuccess: (res) => {
              if (res.success && res.data) setInquiries(res.data);
            },
          }),
        );

        if (isAdminOrManager) {
          promises.push(
            apiCall.get({
              route:
                "/admin/sales-related-active-users/Sales Executive - Client Dealer",
              onSuccess: (res) => {
                if (res.success && res.data) {
                  const mapped = res.data.map((exec) => ({
                    ...exec,
                    label: exec.label || `${exec.firstName} ${exec.lastName}`,
                  }));
                  setExecutives(mapped);
                }
              },
            }),
          );
        }
      }

      // Fetch Properties if role allows
      if (showProperties) {
        const propertyEndpoint = isPropertyManager
          ? "/properties/assigned"
          : "/properties?limit=50";

        promises.push(
          apiCall.get({
            route: propertyEndpoint,
            onSuccess: (res) => {
              if (res.success && res.data) setProperties(res.data);
            },
          }),
        );
      }

      await Promise.all(promises);
    } catch (err) {
      console.error("Error fetching board data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    user,
    isAdminOrManager,
    isClientDealer,
    isPropertyManager,
    showEnquiries,
    showProperties,
  ]);

  const searchUsers = useCallback(async (term) => {
    setSearchingUsers(true);
    const params = {
      roleName: "Sales Executive - Property Manager",
      limit: 10,
    };
    if (term) {
      params.search = term;
    }

    apiCall.get({
      route: "/admin/users",
      params,
      onSuccess: (res) => {
        setSearchingUsers(false);
        if (res.success && res.data) {
          setUserSearchResults(res.data);
        }
      },
      onError: () => setSearchingUsers(false),
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(userSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchTerm, searchUsers]);

  const openAssignModal = (prop) => {
    setTargetProperty(prop);
    setIsAssignModalOpen(true);
    setUserSearchTerm("");
    searchUsers("");
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // --- Enquiry Handlers ---
  const handleAssignInquiry = (propertyId, inquirerId) => {
    if (!selectedExec) return;
    setAssignInquiryLoading(true);
    apiCall.post({
      route: "/admin/inquiries/assign",
      payload: { propertyId, inquirerId, assignedTo: selectedExec },
      onSuccess: () => {
        setAssignInquiryLoading(false);
        setAssigningId(null);
        setSelectedExec("");
        setRefreshKey((prev) => prev + 1);
      },
      onError: (err) => {
        setAssignInquiryLoading(false);
        alert(err.message || "Failed to assign inquiry");
      },
    });
  };

  const handleAutoAssignInquiry = (propertyId, inquirerId) => {
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
        alert(err.message || "Failed to auto-assign inquiry");
      },
    });
  };

  // --- Property Handlers ---
  const handleAssignProperty = (propertyId, userId) => {
    if (!userId) return;
    if (targetProperty?.salesId === userId) return;
    setAssignPropertyLoading(true);
    apiCall.put({
      route: `/admin/properties/${propertyId}/assign`,
      payload: { userId },
      onSuccess: () => {
        setAssignPropertyLoading(false);
        setIsAssignModalOpen(false);
        setRefreshKey((prev) => prev + 1);
        alert("Property assigned successfully!");
      },
      onError: (err) => {
        setAssignPropertyLoading(false);
        alert(err.message || "Failed to assign property");
      },
    });
  };

  // --- Filtering ---
  const filteredInquiries = inquiries.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      (item.property?.microMarket || "").toLowerCase().includes(search) ||
      (item.inquirer?.firstName || "").toLowerCase().includes(search) ||
      (item.propertyId || "").toLowerCase().includes(search)
    );
  });

  const filteredProperties = properties.filter((prop) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (prop.microMarket || "").toLowerCase().includes(search) ||
      (prop.propertyId || "").toLowerCase().includes(search) ||
      (prop.city || "").toLowerCase().includes(search);

    if (viewType === "assigned") return matchesSearch && !!prop.salesId;
    if (viewType === "unassigned") return matchesSearch && !prop.salesId;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 pb-20">
      <AnalyticsSummary
        loading={loading}
        inquiriesCount={inquiries.length}
        propertiesCount={properties.length}
      />

      <WorkBoardHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        onRefresh={() => setRefreshKey((prev) => prev + 1)}
      />

      <EnquirySection
        showEnquiries={showEnquiries}
        loading={loading}
        inquiries={inquiries}
        filteredInquiries={filteredInquiries}
        isAdminOrManager={isAdminOrManager}
        autoAssignLoading={autoAssignLoading}
        handleAutoAssignInquiry={handleAutoAssignInquiry}
        assigningId={assigningId}
        setAssigningId={setAssigningId}
        selectedExec={selectedExec}
        setSelectedExec={setSelectedExec}
        executives={executives}
        handleAssignInquiry={handleAssignInquiry}
        assignInquiryLoading={assignInquiryLoading}
      />

      <PropertyBoard
        showProperties={showProperties}
        isPropertyManager={isPropertyManager}
        filteredProperties={filteredProperties}
        isAdminOrManager={isAdminOrManager}
        viewType={viewType}
        setViewType={setViewType}
        loading={loading}
        properties={properties}
        openAssignModal={openAssignModal}
      />

      <AssignPropertyModal
        isAssignModalOpen={isAssignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        targetProperty={targetProperty}
        userSearchTerm={userSearchTerm}
        setUserSearchTerm={setUserSearchTerm}
        searchingUsers={searchingUsers}
        userSearchResults={userSearchResults}
        assignPropertyLoading={assignPropertyLoading}
        handleAssignProperty={handleAssignProperty}
      />
    </div>
  );
};

export default WorkBoard;

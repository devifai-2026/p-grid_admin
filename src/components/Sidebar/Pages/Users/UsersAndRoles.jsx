import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  Chip,
  IconButton,
  Switch,
  TextField,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { useUserStorage } from "../../../../helpers/useUserStorage";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showWarning, showError, confirmAction } from "../../../../helpers/swalHelper";
import UserFormDialog from "./components/UserFormDialog";

// Roles selectable when creating/editing a user. Mirrors the seeded admin
// roles in pre-lease-server (Super Admin is intentionally omitted — it is not
// assignable from the UI). Keep labels human-friendly, values match roleName.
const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Sales Manager", label: "Sales Manager" },
  { value: "Sales Executive - Client Dealer", label: "Sales Executive (Client Dealer)" },
  { value: "Sales Executive - Property Manager", label: "Sales Executive (Property Manager)" },
];

// Avatar background colour derived from the name so each user is visually distinct.
const initialsColor = (seed = "") => {
  const palette = ["#E53935", "#1565C0", "#2E7D32", "#6A1B9A", "#EF6C00", "#00838F"];
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum += seed.charCodeAt(i);
  return palette[sum % palette.length];
};

// Short, colour-coded label for the access-level column.
const roleChip = (role) => {
  if (!role) return { label: "—", color: "default" };
  if (role.includes("Super Admin")) return { label: "Super Admin", color: "secondary" };
  if (role.includes("Admin")) return { label: "Admin", color: "secondary" };
  if (role.includes("Sales Manager")) return { label: "Manager", color: "warning" };
  if (role.includes("Sales Executive")) return { label: "Executive", color: "info" };
  return { label: role, color: "default" };
};

const UsersAndRoles = () => {
  const location = useLocation();
  const { user: currentUser } = useUserStorage();

  // Initialise the role filter from ?roleName= so sidebar deep-links land
  // pre-filtered without a post-mount setState (avoids a cascading render).
  const initialRole = new URLSearchParams(location.search).get("roleName") || "All";

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [users, setUsers] = useState([]);
  const [salesManagers, setSalesManagers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // --- Permissions ---
  const userRole = currentUser?.role || "";
  const isAdminOrSuperAdmin = ["Admin", "Super Admin"].includes(userRole);
  const isSalesManager = userRole === "Sales Manager";
  const canManage = isAdminOrSuperAdmin || isSalesManager;

  // React to ?roleName= changes after mount (e.g. switching sidebar deep-links
  // while already on this page). Only re-syncs when the param actually differs;
  // this is a deliberate URL->state sync so the set-state-in-effect rule is off.
  const roleParam = new URLSearchParams(location.search).get("roleName");
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (roleParam && roleParam !== selectedRole) {
      setSelectedRole(roleParam);
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [roleParam]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  // --- Fetch users. Pass isActive=all so deactivated users remain visible
  // (the API hides inactive users by default); otherwise a user we just
  // deactivated would disappear and could never be re-activated from here.
  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = {
      page: pagination.currentPage,
      limit: 10,
      isActive: "all",
    };
    if (selectedRole !== "All") params.roleName = selectedRole;

    apiCall.get({
      route: "/admin/users",
      params,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setUsers(res.data || []);
          if (res.pagination) setPagination(res.pagination);
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching users:", err);
      },
    });
  }, [pagination.currentPage, selectedRole]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [fetchUsers, refreshKey]);

  // Sales managers for the "reporting to" picker (admins only).
  useEffect(() => {
    if (!isAdminOrSuperAdmin) return;
    apiCall.get({
      route: "/admin/sales-related-active-users/Sales Manager",
      onSuccess: (res) => {
        if (res.success) setSalesManagers(res.data || []);
      },
      onError: (err) => console.error("Error fetching sales managers:", err),
    });
  }, [isAdminOrSuperAdmin, refreshKey]);

  const reload = () => setRefreshKey((k) => k + 1);

  // --- Deactivate / activate (the previously-missing feature). The backend
  // blocks login for users with isActive=false, and rejects deactivation when
  // the user has ongoing work — surface that error to the admin.
  const toggleActive = (u) => {
    apiCall.put({
      route: `/admin/users/${u.userId}`,
      payload: { isActive: !u.isActive },
      onSuccess: (res) => {
        if (res.success) {
          // Optimistic local flip, then reconcile with the server.
          setUsers((prev) =>
            prev.map((x) => (x.userId === u.userId ? { ...x, isActive: !u.isActive } : x))
          );
          reload();
        } else {
          showError(res.message || "Failed to update status");
        }
      },
      onError: (err) =>
        showError(err?.data?.message || err?.message || "Failed to update status"),
    });
  };

  const handleDelete = async (u) => {
    if (u.role === "Super Admin") {
      showWarning("Super Admin accounts cannot be deleted.");
      return;
    }
    const ok = await confirmAction(
      "Are you sure?",
      "You are about to delete this user!",
      "Yes, delete it!"
    );
    if (!ok) return;
    apiCall.delete({
      route: `/admin/users/${u.userId}`,
      onSuccess: () => {
        setUsers((prev) => prev.filter((x) => x.userId !== u.userId));
        reload();
      },
      onError: (err) => showError(err.message || "Failed to delete user"),
    });
  };

  // Client-side search on the current page (name / email / mobile).
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.mobileNumber || "").toLowerCase().includes(term)
    );
  }, [users, search]);

  const managerName = (id) => {
    if (!id) return "—";
    const m = salesManagers.find((sm) => (sm.value || sm.userId || sm.id) === id);
    return m ? m.label || m.name || `${m.firstName} ${m.lastName}` : "Assigned";
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#222", margin: 0 }}>
          Users &amp; Roles
        </h1>
        <p style={{ color: "#888", marginTop: 4, fontSize: 13 }}>
          Manage platform users, their access level and account status
        </p>
      </div>

      {/* Toolbar: role filter + refresh + add + search (extraaedge layout) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FilterAltIcon sx={{ color: "#E53935" }} />
          <TextField
            select
            size="small"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPagination((p) => ({ ...p, currentPage: 1 }));
            }}
            SelectProps={{ native: true }}
            sx={{ minWidth: 220, background: "#fff" }}
          >
            <option value="All">All Roles</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </TextField>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Tooltip title="Refresh">
            <IconButton sx={{ color: "#E53935" }} onClick={reload}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {canManage && (
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setAddOpen(true)}
              sx={{
                bgcolor: "#E53935",
                "&:hover": { bgcolor: "#c62828" },
                textTransform: "none",
                whiteSpace: "nowrap",
                fontWeight: 600,
              }}
            >
              Add User
            </Button>
          )}
          <TextField
            size="small"
            placeholder="Search by Name / Email / Mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 320, background: "#fff" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          border: "1px solid #e8e8e8",
          borderRadius: 4,
        }}
      >
        <thead>
          <tr style={{ background: "#fdf3ed" }}>
            {["", "User Name", "Email Id", "Mobile Number", "Access Level", "Reporting To", "Account Status", "Actions"].map(
              (h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b4a3a",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8} style={{ padding: 32, textAlign: "center" }}>
                <CircularProgress size={28} sx={{ color: "#E53935" }} />
              </td>
            </tr>
          )}
          {!loading && filteredUsers.length === 0 && (
            <tr>
              <td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#888" }}>
                No users match the filters
              </td>
            </tr>
          )}
          {!loading &&
            filteredUsers.map((u, idx) => {
              const initial = (u.name || u.email || "?")[0].toUpperCase();
              const chip = roleChip(u.role);
              const isSelf = u.userId === currentUser?.userId;
              const isSuper = u.role === "Super Admin";
              return (
                <tr
                  key={u.userId}
                  style={{
                    background: idx % 2 ? "#fafafa" : "#fff",
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <td style={{ padding: "10px 16px" }}>
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 14,
                        bgcolor: initialsColor(u.name || u.email),
                      }}
                    >
                      {initial}
                    </Avatar>
                  </td>
                  <td style={{ padding: "14px 16px", fontWeight: 500, color: "#222" }}>
                    {u.name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#555" }}>{u.email}</td>
                  <td style={{ padding: "14px 16px", color: "#555" }}>
                    {u.mobileNumber || "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Chip size="small" label={chip.label} color={chip.color} variant="outlined" />
                  </td>
                  <td style={{ padding: "14px 16px", color: "#555" }}>
                    {u.salesManagerId ? managerName(u.salesManagerId) : "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Tooltip title={u.isActive ? "Deactivate user (blocks login)" : "Activate user"}>
                      <span>
                        <Switch
                          size="small"
                          checked={!!u.isActive}
                          onChange={() => canManage && !isSuper && toggleActive(u)}
                          disabled={!canManage || isSuper || isSelf}
                          sx={{
                            "& .MuiSwitch-thumb": {
                              backgroundColor: u.isActive ? "#2E7D32" : undefined,
                            },
                          }}
                        />
                      </span>
                    </Tooltip>
                    <span
                      style={{
                        marginLeft: 4,
                        fontSize: 12,
                        color: u.isActive ? "#2E7D32" : "#c62828",
                        fontWeight: 600,
                      }}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <Tooltip title="Edit user">
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canManage || isSuper}
                          onClick={() => setEditUser(u)}
                          sx={{ color: "#1565C0" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Delete user">
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canManage || isSelf || isSuper}
                          onClick={() => handleDelete(u)}
                          sx={{ color: "#dc2626" }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            fontSize: 13,
            color: "#666",
          }}
        >
          <span>
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalUsers} users)
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPagination((p) => ({ ...p, currentPage: p.currentPage - 1 }))}
              style={{
                padding: "4px 12px",
                border: "1px solid #ddd",
                borderRadius: 4,
                background: "#fff",
                cursor: pagination.hasPrevPage ? "pointer" : "not-allowed",
                opacity: pagination.hasPrevPage ? 1 : 0.5,
              }}
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPagination((p) => ({ ...p, currentPage: p.currentPage + 1 }))}
              style={{
                padding: "4px 12px",
                border: "1px solid #ddd",
                borderRadius: 4,
                background: "#fff",
                cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
                opacity: pagination.hasNextPage ? 1 : 0.5,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add user */}
      <UserFormDialog
        open={addOpen}
        mode="add"
        onClose={() => setAddOpen(false)}
        onSaved={() => {
          setAddOpen(false);
          reload();
        }}
        roleOptions={ROLE_OPTIONS}
        salesManagers={salesManagers}
        isAdminOrSuperAdmin={isAdminOrSuperAdmin}
        isSalesManager={isSalesManager}
        currentUser={currentUser}
      />

      {/* Edit user */}
      <UserFormDialog
        open={Boolean(editUser)}
        mode="edit"
        user={editUser}
        onClose={() => setEditUser(null)}
        onSaved={() => {
          setEditUser(null);
          reload();
        }}
        roleOptions={ROLE_OPTIONS}
        salesManagers={salesManagers}
        isAdminOrSuperAdmin={isAdminOrSuperAdmin}
        isSalesManager={isSalesManager}
        currentUser={currentUser}
      />
    </div>
  );
};

export default UsersAndRoles;

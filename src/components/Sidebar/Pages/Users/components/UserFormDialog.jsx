import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import { apiCall } from "../../../../../helpers/apicall/apiCall";

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  roleName: "Sales Executive - Client Dealer",
  salesManagerId: "",
};

/**
 * Add / Edit user dialog (MUI), matching the extraaedge "AddUserDialog" /
 * "UserProfileDialog" experience but wired to pre-lease's data shape:
 *   firstName/lastName, mobileNumber, roleName (string), salesManagerId.
 *
 * Create  -> POST /admin/users
 * Update  -> PUT  /admin/users/:userId
 * Mobile  -> OTP flow via /send-otp + /change-mobile (edit mode only, since
 *            the number is the login identity and can't be changed inline).
 */
const UserFormDialog = ({
  open,
  mode = "add",
  user,
  onClose,
  onSaved,
  roleOptions,
  salesManagers = [],
  isAdminOrSuperAdmin,
  isSalesManager,
  currentUser,
}) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Mobile-change sub-flow (edit mode)
  const [mobileStep, setMobileStep] = useState(null); // null | "phone" | "otp"
  const [newMobile, setNewMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [mobileLoading, setMobileLoading] = useState(false);
  const [mobileErr, setMobileErr] = useState("");

  // Seed the form from props each time the dialog opens / target user changes.
  // This is a deliberate prop->state sync; the set-state-in-effect rule is
  // disabled for the block since the resets are intentional, not derived state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setErr("");
    setMobileStep(null);
    setMobileErr("");
    if (isEdit && user) {
      const parts = (user.name || "").split(" ");
      setForm({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        roleName: user.role || "Sales Executive - Client Dealer",
        salesManagerId: user.salesManagerId || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, isEdit, user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const isExecutive = form.roleName.startsWith("Sales Executive");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    if (!form.firstName.trim()) return setErr("First name is required");
    if (!form.email.trim()) return setErr("Email is required");
    if (!isEdit && !/^[6-9]\d{9}$/.test(form.mobileNumber))
      return setErr("Enter a valid 10-digit mobile number");

    // Admin must pick a manager for a new executive. A sales manager creating an
    // executive is auto-assigned as that executive's manager by the server.
    if (isAdminOrSuperAdmin && isExecutive && !form.salesManagerId)
      return setErr("Please select a Sales Manager for the Sales Executive.");

    const payload = { ...form };
    if (isSalesManager && isExecutive) payload.salesManagerId = currentUser?.userId;

    setSaving(true);
    const done = (res, failMsg) => {
      setSaving(false);
      if (res?.success) onSaved?.();
      else setErr(res?.message || failMsg);
    };

    if (isEdit) {
      apiCall.put({
        route: `/admin/users/${user.userId}`,
        payload,
        onSuccess: (res) => done(res, "Failed to update user"),
        onError: (e2) => {
          setSaving(false);
          setErr(e2?.data?.message || e2?.message || "Failed to update user");
        },
      });
    } else {
      apiCall.post({
        route: "/admin/users",
        payload,
        onSuccess: (res) => done(res, "Failed to create user"),
        onError: (e2) => {
          setSaving(false);
          setErr(e2?.data?.message || e2?.message || "Failed to create user");
        },
      });
    }
  };

  // --- Mobile change (edit only) ---
  const sendOtp = () => {
    setMobileErr("");
    if (!/^[6-9]\d{9}$/.test(newMobile))
      return setMobileErr("Enter a valid 10-digit mobile number");
    if (newMobile === form.mobileNumber)
      return setMobileErr("New mobile number must be different");
    setMobileLoading(true);
    apiCall.post({
      route: "/send-otp",
      payload: { mobileNumber: newMobile },
      onSuccess: (res) => {
        setMobileLoading(false);
        if (res.success && res.data?.verificationId) {
          setVerificationId(res.data.verificationId);
          setMobileStep("otp");
        } else setMobileErr(res.message || "Failed to send OTP");
      },
      onError: (e2) => {
        setMobileLoading(false);
        setMobileErr(e2?.data?.message || e2?.message || "Failed to send OTP");
      },
    });
  };

  const verifyMobile = () => {
    setMobileErr("");
    if (!/^\d{4}$/.test(otp)) return setMobileErr("Enter a valid 4-digit OTP");
    setMobileLoading(true);
    apiCall.patch({
      route: "/change-mobile",
      payload: { newMobileNumber: newMobile, otp, verificationId, userId: user?.userId },
      onSuccess: (res) => {
        setMobileLoading(false);
        if (res.success) {
          setField("mobileNumber", newMobile);
          setMobileStep(null);
          setNewMobile("");
          setOtp("");
        } else setMobileErr(res.message || "Failed to update mobile");
      },
      onError: (e2) => {
        setMobileLoading(false);
        setMobileErr(e2?.data?.message || e2?.message || "Failed to update mobile");
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
        }}
      >
        {isEdit ? "Edit User" : "Add New User"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {err && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {err}
            </Alert>
          )}

          <Typography variant="overline" color="text.secondary">
            User Details
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              fullWidth
              size="small"
            />
          </Box>

          <TextField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            fullWidth
            required
            size="small"
            sx={{ mt: 2 }}
          />

          <TextField
            label="Mobile Number"
            value={form.mobileNumber}
            onChange={
              isEdit
                ? undefined
                : (e) => setField("mobileNumber", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            fullWidth
            required
            size="small"
            sx={{ mt: 2 }}
            inputProps={{ inputMode: "numeric", maxLength: 10, readOnly: isEdit }}
            helperText={isEdit ? "Use Change to update the login number via OTP" : ""}
            InputProps={
              isEdit
                ? {
                    endAdornment: (
                      <Button
                        size="small"
                        startIcon={<EditIcon fontSize="small" />}
                        onClick={() => {
                          setMobileStep("phone");
                          setNewMobile("");
                          setOtp("");
                          setMobileErr("");
                        }}
                        sx={{ color: "#E53935", whiteSpace: "nowrap" }}
                      >
                        Change
                      </Button>
                    ),
                  }
                : undefined
            }
          />

          {/* Mobile change sub-flow */}
          {isEdit && mobileStep && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px solid #f0d0d0",
                borderRadius: 1,
                background: "#fff7f7",
              }}
            >
              {mobileErr && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {mobileErr}
                </Alert>
              )}
              {mobileStep === "phone" ? (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    label="New Mobile Number"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    size="small"
                    fullWidth
                    inputProps={{ inputMode: "numeric", maxLength: 10 }}
                  />
                  <Button
                    variant="contained"
                    onClick={sendOtp}
                    disabled={mobileLoading}
                    sx={{ bgcolor: "#E53935", "&:hover": { bgcolor: "#c62828" } }}
                  >
                    {mobileLoading ? <CircularProgress size={20} color="inherit" /> : "Send OTP"}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <TextField
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    size="small"
                    fullWidth
                    inputProps={{ inputMode: "numeric", maxLength: 4 }}
                  />
                  <Button onClick={() => setMobileStep("phone")} disabled={mobileLoading}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={verifyMobile}
                    disabled={mobileLoading}
                  >
                    {mobileLoading ? <CircularProgress size={20} color="inherit" /> : "Verify"}
                  </Button>
                </Box>
              )}
            </Box>
          )}

          <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 3 }}>
            Role Information
          </Typography>
          <TextField
            select
            label="Access Level / Role"
            value={form.roleName}
            onChange={(e) => setField("roleName", e.target.value)}
            fullWidth
            size="small"
            sx={{ mt: 1 }}
            disabled={isEdit}
            helperText={isEdit ? "Role cannot be changed after creation" : ""}
          >
            {roleOptions.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Reporting manager (admins assigning an executive) */}
          {isAdminOrSuperAdmin && isExecutive && (
            <TextField
              select
              label="Reporting To (Sales Manager)"
              value={form.salesManagerId}
              onChange={(e) => setField("salesManagerId", e.target.value)}
              fullWidth
              required
              size="small"
              sx={{ mt: 2 }}
            >
              <MenuItem value="">
                <em>Assign Sales Manager</em>
              </MenuItem>
              {salesManagers.map((sm) => {
                const val = sm.value || sm.userId || sm.id;
                return (
                  <MenuItem key={val} value={val}>
                    {sm.label || sm.name || `${sm.firstName} ${sm.lastName}`}
                  </MenuItem>
                );
              })}
            </TextField>
          )}

          {isSalesManager && isExecutive && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This executive will be assigned directly under you.
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ bgcolor: "#E53935", "&:hover": { bgcolor: "#c62828" } }}
          >
            {saving ? (
              <CircularProgress size={20} color="inherit" />
            ) : isEdit ? (
              "Update User"
            ) : (
              "Create User"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormDialog;

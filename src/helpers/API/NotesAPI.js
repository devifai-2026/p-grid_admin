import { apiCall } from "../apicall/apiCall";
import pako from "pako";
import { Buffer } from "buffer";

/**
 * Enhanced decryption with deep logging.
 */
const decryptData = (res) => {
  console.log("[NotesAPI] RAW RESPONSE DATA TYPE:", typeof res?.data);
  
  if (res && typeof res.data === "string" && res.data.length > 5 && res.data.startsWith("eJ")) {
    try {
      const binaryData = Buffer.from(res.data, "base64");
      const decompressedData = pako.inflate(binaryData, { to: "string" });
      const parsed = JSON.parse(decompressedData);
      console.log("[NotesAPI] SUCCESSFUL DECODE. Keys found:", Object.keys(parsed));
      return { ...res, data: parsed };
    } catch (e) {
      console.error("[NotesAPI] FAILED DECODE. Error:", e.message);
    }
  }
  return res;
};

export const fetchNotes = ({ propertyId, onSuccess, onError }) => {
  apiCall.get({
    route: `/notes/${propertyId}`,
    onSuccess: (raw) => {
      const res = decryptData(raw);
      let allChatItems = [];

      if (res.success && res.data) {
        const data = res.data;
        // Search for records in all known return paths
        const records = data.notes || (data.property ? (data.property.notes || data.property.managerNotes) : null) || (Array.isArray(data) ? data : []);
        
        console.log("[NotesAPI] RECORDS FOUND:", Array.isArray(records) ? records.length : "NOT AN ARRAY");

        if (Array.isArray(records)) {
          records.forEach((record, rIdx) => {
            const exec = record.salesExecutive || {};
            const senderName = exec.firstName ? `${exec.firstName} ${exec.lastName || ""}` : (record.senderName || "Team Member");
            const senderRole = (exec.roles && Array.isArray(exec.roles)) ? (exec.roles[0]?.roleName || "Sales") : (record.senderRole || "Sales");
            const sId = record.salesExecutiveId || record.sales_executive_id || exec.userId || rIdx;

            const chatLog = Array.isArray(record.notes) ? record.notes : [];
            chatLog.forEach((item, iIdx) => {
              allChatItems.push({
                id: item.id || item._id || `${sId}-${rIdx}-${iIdx}`,
                note: item.note || (typeof item === 'string' ? item : ""),
                message: item.note || item.message || "",
                createdAt: item.createdAt || record.createdAt || new Date().toISOString(),
                senderId: sId,
                senderName: item.senderName || senderName,
                senderRole: item.senderRole || senderRole,
                status: item.status || "pending_review",
              });
            });
          });
        }
      }

      console.log("[NotesAPI] FINAL CHAT ITEMS COUNT:", allChatItems.length);
      onSuccess({ ...res, data: allChatItems });
    },
    onError,
  });
};

export const submitNote = ({ propertyId, message, onSuccess, onError }) => {
  apiCall.post({
    route: `/properties/${propertyId}/notes`,
    payload: { 
      notes: [{ note: message, createdAt: new Date().toISOString() }] 
    },
    onSuccess,
    onError,
  });
};

export const approveNote = (p) => p.onSuccess({ success: true, message: "Simulated Success" });
export const declineNote = (p) => p.onSuccess({ success: true, message: "Simulated Success" });
export const editAndApproveNote = (p) => p.onSuccess({ success: true, message: "Simulated Success" });

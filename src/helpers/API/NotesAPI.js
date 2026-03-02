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

            const chatItem = {
              id: record.id || record._id || `${sId}-${rIdx}`,
              note: record.originalNote || (typeof record.note === 'string' ? record.note : ""),
              message: record.originalNote || (typeof record.note === 'string' ? record.note : ""),
              createdAt: record.createdAt || new Date().toISOString(),
              updatedAt: record.updatedAt || record.createdAt || new Date().toISOString(),
              senderId: sId,
              senderName: senderName,
              senderRole: senderRole,
              status: record.status || "pending_review",
              isEdited: record.isEdited,
              editedMessage: record.adminNote || null,
              adminName: record.approvedBy || record.updatedBy ? "Admin" : null,
              declineReason: record.status === "denied" ? "Admin declined the note" : undefined
            };
            allChatItems.push(chatItem);
          });
        }
      }
      
      // Attempt 2: sometimes we might just get property objects in array (like from /notes/properties)
      if (allChatItems.length === 0 && res.success && res.data && Array.isArray(res.data)) {
         res.data.forEach((item, rIdx) => {
           if (item.originalNote) {
             allChatItems.push({
                id: item.id || item._id || rIdx.toString(),
                note: item.originalNote,
                message: item.originalNote,
                createdAt: item.createdAt || new Date().toISOString(),
                updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
                status: item.status || "pending_review",
                isEdited: item.isEdited,
                editedMessage: item.adminNote || null,
                senderRole: "Sales",
                senderName: "Team Member"
             });
           }
         });
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
      notes: message 
    },
    onSuccess,
    onError,
  });
};

export const approveNote = ({ propertyId, salesExecutiveId, onSuccess, onError }) => {
  apiCall.patch({
    route: `/notes/${propertyId}/review`,
    payload: { action: "approve", salesExecutiveId },
    onSuccess,
    onError,
  });
};

export const declineNote = ({ propertyId, salesExecutiveId, onSuccess, onError }) => {
  apiCall.patch({
    route: `/notes/${propertyId}/review`,
    payload: { action: "deny", salesExecutiveId },
    onSuccess,
    onError,
  });
};

export const editAndApproveNote = ({ propertyId, salesExecutiveId, message, onSuccess, onError }) => {
  apiCall.patch({
    route: `/notes/${propertyId}/review`,
    payload: { action: "approve", salesExecutiveId, editedNote: message },
    onSuccess,
    onError,
  });
};

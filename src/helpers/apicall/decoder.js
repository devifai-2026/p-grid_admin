import pako from "pako";
import { Buffer } from "buffer";

/**
 * Decodes the custom encoded response data from the backend.
 * The backend compresses data with Zlib Deflate and then Base64 encodes it.
 *
 * @param encodedData - The compressed/encoded data (as a string or object of characters)
 * @returns The original JSON object
 */
export const decodeResponseData = (response) => {
  if (!response) return null;

  try {
    // Case 1: The input is already the response object from backend
    // { success: true, message: "...", data: "eJ..." }
    if (
      typeof response === "object" &&
      !Array.isArray(response) &&
      response.data &&
      typeof response.data === "string" &&
      response.data.startsWith("eJ")
    ) {
      const decodedData = decodeString(response.data);
      return { ...response, data: decodedData };
    }

    // Case 2: The input is a string starting with eJ
    if (typeof response === "string" && response.startsWith("eJ")) {
      return decodeString(response);
    }

    // Case 3: The input is an indexed character object {"0": "e", "1": "J", ...}
    if (
      typeof response === "object" &&
      !Array.isArray(response) &&
      response["0"] &&
      typeof response["0"] === "string"
    ) {
      const mergedString = Object.values(response).join("");
      if (mergedString.startsWith("eJ")) {
        return decodeString(mergedString);
      }
      try {
        return JSON.parse(mergedString);
      } catch (e) {
        return mergedString;
      }
    }

    return response;
  } catch (error) {
    console.error("Decoding response data failed:", error);
    return response;
  }
};

/**
 * Helper to decode a base64-encoded, zlib-compressed string
 */
const decodeString = (base64String) => {
  try {
    const binaryData = Buffer.from(base64String, "base64");
    const decompressedData = pako.inflate(binaryData, { to: "string" });
    return JSON.parse(decompressedData);
  } catch (e) {
    console.error("Error decoding string:", e);
    return base64String;
  }
};

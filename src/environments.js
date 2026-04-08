const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

const isBrowser = typeof window !== "undefined";

const isLocalhost =
  isBrowser &&
  (LOCAL_HOSTS.has(window.location.hostname) ||
    window.location.search.includes("localhost"));

/* Shared constants */
const CLOUDINARY_BASE_URL = "";
const CLOUD_NAME = "";
const UPLOAD_PRESET = "";

const EMAILJS = {
  SERVICE_ID: "",
  TEMPLATE_ID: "",
  PUBLIC_KEY: "",
};

/* Environment configs */
const ENV_CONFIG = {
  local: {
    // BASE_URL: "http://localhost:3000/api/v1",
    BASE_URL: "https://pre-release-production.up.railway.app/api/v1",
  },
  prod: {
    BASE_URL: "https://pre-release-production.up.railway.app/api/v1",
  },
};
const env_ = 
  import.meta.env.PROD || 
  (isBrowser && window.location.hostname.includes("netlify.app")) || 
  !isLocalhost 
    ? "prod" : "local";


/* Final env object */
export const env = {
  BASE_URL: ENV_CONFIG[env_].BASE_URL,

  cloudinary: CLOUDINARY_BASE_URL,
  CLOUD_NAME,
  UPLOAD_PRESET,

  EMAILJS_SERVICE_ID: EMAILJS.SERVICE_ID,
  EMAILJS_TEMPLATE_ID: EMAILJS.TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY: EMAILJS.PUBLIC_KEY,

  RAZORPAY_KEY_ID: "rzp_test_QXGpp1JoJV5PfY",
};

export const BASE_URL = env.BASE_URL;

// Production backend deployed on Vercel
const DEFAULT_PRODUCTION_BACKEND = "https://portfolio-nu-ten-27.vercel.app/api";

const normalizeApiUrl = (url) => {
  if (!url) return "";
  let clean = url.trim().replace(/\/+$/, "");
  if (!clean.endsWith("/api")) {
    clean = `${clean}/api`;
  }
  return clean;
};

const resolveApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. If explicit environment variable is set and NOT localhost, use it
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return normalizeApiUrl(envUrl);
  }

  // 2. If running in browser and NOT on localhost (e.g. on Vercel deployment), use production backend
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".local");

    if (!isLocalhost) {
      return DEFAULT_PRODUCTION_BACKEND;
    }
  }

  // 3. If built for production (server-side during build/SSR), use production backend
  if (process.env.NODE_ENV === "production" && (!envUrl || envUrl.includes("localhost"))) {
    return DEFAULT_PRODUCTION_BACKEND;
  }

  // 4. Fallback to env URL or local development server
  return normalizeApiUrl(envUrl) || "http://localhost:5000/api";
};

export const API_BASE_URL = resolveApiBaseUrl();


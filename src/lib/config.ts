export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8888",
  mongodb: {
    uri: process.env.MONGODB_URI || "",
  },
  env: process.env.NODE_ENV || "development",
} as const;

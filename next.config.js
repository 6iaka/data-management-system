import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: { bodySizeLimit: "700mb" },
  },
};

export default config;

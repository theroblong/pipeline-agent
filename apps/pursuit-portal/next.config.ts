import type { NextConfig } from "next";
import path from "path";

const repoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  outputFileTracingIncludes: {
    "/*": ["../../knowledge/**/*.md"],
    "/opportunities/*": ["../../knowledge/**/*.md"],
    "/enablement/*": ["../../knowledge/**/*.md"],
    "/briefs/*": ["../../knowledge/**/*.md"],
    "/crm-staging": ["../../knowledge/**/*.md"]
  },
  poweredByHeader: false
};

export default nextConfig;

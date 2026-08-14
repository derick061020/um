import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "bcryptjs", "sharp", "pdf-lib"],
  experimental: {
    serverActions: {
      // Los escaneos de la tablet se suben por Server Action.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;

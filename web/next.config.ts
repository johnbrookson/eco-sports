import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Fotos mock de atletas durante desenvolvimento do perfil público.
      // Substituir por bucket próprio (S3-compatible) quando o upload real existir.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

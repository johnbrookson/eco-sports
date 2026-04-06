import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Mantido como fallback: o editor de perfil aceita URLs externas.
      // Substituir por bucket próprio (S3-compatible) quando o upload real existir.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// API key pública do app da Web do Firebase, usada pelo login no servidor
// (lib/auth/firebase.ts). No build do App Hosting ela vem do
// FIREBASE_WEBAPP_CONFIG; só é embutida quando existe, para não esconder um
// FIREBASE_API_KEY definido em runtime.
function firebaseApiKey(): string | undefined {
  if (process.env.FIREBASE_API_KEY) return process.env.FIREBASE_API_KEY;
  try {
    return JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG ?? "{}").apiKey;
  } catch {
    return undefined;
  }
}

const apiKey = firebaseApiKey();

const nextConfig: NextConfig = {
  env: apiKey ? { FIREBASE_API_KEY: apiKey } : {},
  images: {
    remotePatterns: [
      // Mantido como fallback: o editor de perfil aceita URLs externas.
      // Substituir por bucket próprio (S3-compatible) quando o upload real existir.
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;

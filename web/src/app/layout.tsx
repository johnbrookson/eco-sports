import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eco-Sports — Gestão de Carreira e Desenvolvimento de Atletas",
  description:
    "Plataforma para gestão completa de carreira, desenvolvimento técnico, análise de desempenho e captação de recursos para atletas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="basketball"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("eco-theme");if(t)document.documentElement.setAttribute("data-theme",t);var m=localStorage.getItem("eco-color-mode");if(m==="dark")document.documentElement.classList.add("dark")}catch(e){}})()`,
          }}
        />
        {children}
      </body>
    </html>
  );
}

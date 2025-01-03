import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest: {
    name: "React-vite-app",
    short_name: "react-vite-app",
    description: "Gemini Chatbot",
    icons: [
      {
        src: "/gemini-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/gemini-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "favicon",
      },
      {
        src: "/gemini-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/gemini-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#171717",
    background_color: "#f0e7db",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
});

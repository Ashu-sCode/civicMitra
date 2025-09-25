import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext.jsx";

// PWA helper from vite-plugin-pwa (virtual import)
import { registerSW } from "virtual:pwa-register";

// register SW with optional hooks
registerSW({
  onNeedRefresh() {
    console.log("SW needs refresh — prompt the user to reload");
  },
  onOfflineReady() {
    console.log("App ready to work offline");
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
     <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      }}
    />
    </ThemeProvider>
  </StrictMode>
);

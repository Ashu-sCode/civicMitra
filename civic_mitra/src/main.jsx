import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
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
    </ThemeProvider>
  </StrictMode>
);

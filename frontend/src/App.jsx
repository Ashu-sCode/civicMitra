import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import ReportPage from "./pages/ReportPage";
import { flushQueue } from "./lib/sync";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  // Flush local queue at startup
  useEffect(() => {
    flushQueue();
    window.addEventListener("online", flushQueue);
    return () => window.removeEventListener("online", flushQueue);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <main className="p-4 container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/report" element={<ReportPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Landing from "./pages/Landing";
import ReportPage from "./pages/ReportPage";
import ReportTracking from "./pages/ReportTracking";
import { ThemeProvider } from "./context/ThemeContext";
import ReportListPage from "./pages/ReportListPage";
import AdminReportList from "./admin/pages/AdminReportList";
import AdminHotspotMap from "./admin/pages/AdminHotspotMap";
import CitizenDashboard from "./pages/CitizenDashboard";


export default function App() {
  // Flush local queue at startup

  return (

    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="py-4 mx-auto container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/track-report" element={<ReportTracking />} />
              <Route path="/track-report/:trackingId" element={<ReportTracking />} />
              <Route path="/report-list" element={<ReportListPage />} />
              <Route path="/admin/report-list" element={<AdminReportList />} />
              <Route path="/admin/map" element={<AdminHotspotMap />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>

  );
}

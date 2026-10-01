import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import InterviewReport from "./pages/InterviewReport";
import InterviewSetup from "./pages/InterviewSetup";
import LiveInterview from "./pages/LiveInterview";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      {/* Focused interview route without the normal sidebar */}
      <Route path="/interview/live" element={<LiveInterview />} />

      {/* Standard application pages */}
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="interview/new" element={<InterviewSetup />} />
        <Route path="interview/report" element={<InterviewReport />} />
        <Route path="history" element={<History />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

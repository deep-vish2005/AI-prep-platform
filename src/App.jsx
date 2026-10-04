import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import InterviewReport from "./pages/InterviewReport";
import InterviewSetup from "./pages/InterviewSetup";
import LiveInterview from "./pages/LiveInterview";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/interview/live" element={<LiveInterview />} />
        <Route
          path="/interview/live/:interviewId"
          element={<LiveInterview />}
        />
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="interview/new" element={<InterviewSetup />} />
          <Route path="interview/report" element={<InterviewReport />} />
          <Route
            path="interview/report/:interviewId"
            element={<InterviewReport />}
          />
          <Route path="history" element={<History />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

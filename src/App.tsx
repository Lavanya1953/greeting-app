import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import HomePage from "./pages/HomePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profileComplete } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!profileComplete) return <Navigate to="/profile" replace />;
  return <>{children}</>;
}

function ProfileGate({ children }: { children: React.ReactNode }) {
  const { user, profileComplete } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (profileComplete) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/profile"
        element={
          <ProfileGate>
            <ProfileSetupPage />
          </ProfileGate>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

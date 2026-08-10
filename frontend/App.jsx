import { Routes, Route } from "react-router-dom";
import Navbar from "./src/components/Navbar";
import Home from "./src/pages/Home";
import Login from "./src/pages/Login";
import Register from "./src/pages/Register";
import Dashboard from "./src/pages/Dashboard";
import PalmAnalysis from "./src/pages/PalmAnalysis";
import Profile from "./src/pages/Profile";
import History from "./src/pages/History";
import Results from "./src/pages/Results";
import NotFound from "./src/pages/NotFound";
import ProtectedRoute from "./src/components/ProtectedRoute";
import { AuthProvider } from "./src/context/AuthContext";
import { ToastProvider } from "./src/components/ToastProvider";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/palm" element={<ProtectedRoute><PalmAnalysis /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

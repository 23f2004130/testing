import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./ToastProvider";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.notify("Logged out successfully.", "success");
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-purple-700">
          Palmistry AI
        </Link>

        <nav className="hidden items-center gap-6 md:flex text-sm font-medium text-slate-600">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-purple-700" : "hover:text-purple-700"}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-purple-700" : "hover:text-purple-700"}>
            Dashboard
          </NavLink>
          <NavLink to="/palm" className={({ isActive }) => isActive ? "text-purple-700" : "hover:text-purple-700"}>
            Palm Analysis
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? "text-purple-700" : "hover:text-purple-700"}>
            History
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "text-purple-700" : "hover:text-purple-700"}>
            Profile
          </NavLink>
          <Link to="/tarot">Tarot Reading</Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-500 md:block">{user.full_name || user.email}</span>
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-2xl border border-purple-700 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50">
                Login
              </Link>
              <Link to="/register" className="rounded-2xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

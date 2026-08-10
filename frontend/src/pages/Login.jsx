import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

function Login() {
  const { login, user, authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, from, navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await login(form);
      toast.notify("Welcome back! Redirecting to dashboard.", "success");
      navigate(from, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || "Invalid email or password.";
      toast.notify(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-10 text-white">
            <div className="max-w-md">
              <h1 className="text-4xl font-semibold">Welcome back</h1>
              <p className="mt-5 text-slate-200">Log in to continue your palmistry dashboard and access personalized insights instantly.</p>
              <div className="mt-8 space-y-4 rounded-3xl bg-white/10 p-6 text-sm text-slate-200 shadow-inner">
                <p className="font-semibold">Secure token-based login</p>
                <p>Persistent sessions, protected dashboard, and automatic bearer authorization.</p>
              </div>
            </div>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-semibold text-slate-900">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your account to access the AI palmistry platform.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="w-full rounded-3xl bg-purple-700 px-5 py-3 text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting || authLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              New to the platform? <Link to="/register" className="font-semibold text-purple-700 hover:text-purple-900">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

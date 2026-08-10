import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ToastProvider";

function Register() {
  const { register, authLoading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.notify("Passwords do not match.", "error");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      toast.notify("Account created successfully. Please log in.", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || error?.message || "Unable to register.";
      toast.notify(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 md:p-14">
            <h1 className="text-4xl font-semibold text-slate-900">Create your account</h1>
            <p className="mt-4 text-slate-600">Start using the AI palmistry dashboard and review your readings in a modern workspace.</p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || authLoading}
                className="w-full rounded-3xl bg-purple-700 px-5 py-3 text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting || authLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          </div>

          <div className="hidden md:block bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-10 text-white">
            <div className="rounded-[2rem] bg-white/10 p-10">
              <h2 className="text-3xl font-semibold">AI palm analysis</h2>
              <p className="mt-4 text-slate-200">Register now and access powerful analysis tools, history tracking, and PDF-ready reports for every session.</p>
              <div className="mt-10 space-y-4 rounded-3xl bg-white/10 p-6">
                <p className="font-semibold">What you get</p>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li>• Secure JWT authentication.</li>
                  <li>• Personalized dashboard insights.</li>
                  <li>• History and report downloads.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <Link to="/login" className="font-semibold text-purple-700 hover:text-purple-900">Sign in here</Link>
      </p>
    </div>
  );
}

export default Register;

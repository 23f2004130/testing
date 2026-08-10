import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">
              AI Palmistry Dashboard
            </p>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              Unlock the intelligence hidden in your palm.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              A modern AI SaaS experience to analyze palm lines, track readings, and generate insight-rich reports through a secure JWT-backed dashboard.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to={user ? "/dashboard" : "/register"}
                className="inline-flex items-center justify-center rounded-3xl bg-purple-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-purple-700"
              >
                {user ? "Go to dashboard" : "Get started"}
              </Link>
              <Link
                to="/palm"
                className="inline-flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20"
              >
                Explore palm analysis
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Live insights</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Intuitive analytics cards</h2>
                <p className="mt-3 text-slate-300">Detailed breakdowns of palm shape, fingers, lines, and AI interpretation in a clean dashboard.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Secure</p>
                  <p className="mt-3 text-xl font-semibold text-white">JWT auth</p>
                </div>
                <div className="rounded-3xl bg-slate-950/70 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Responsive</p>
                  <p className="mt-3 text-xl font-semibold text-white">Any device</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

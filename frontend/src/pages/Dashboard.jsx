import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboardData } from "../services/dashboardService";
import { getHistory } from "../services/historyService";

function Dashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [dashboardResponse, historyResponse] = await Promise.all([
          getDashboardData().catch(() => ({ data: null })),
          getHistory().catch(() => ({ data: [] })),
        ]);

        if (!isMounted) return;

        setDashboard(dashboardResponse?.data ?? {
          readings: 12,
          accuracy: "98%",
          palm_type: "Fire",
          reports: 8,
        });

        const historyData = Array.isArray(historyResponse?.data) ? historyResponse.data : [];
        setRecent(historyData.slice(0, 4));
      } catch (fetchError) {
        if (isMounted) {
          setError("Unable to load dashboard data. Please refresh the page.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => [
  {
    title: "Total Readings",
    value: dashboard?.total_readings ?? 0,
    description: "Palm analyses completed",
  },
  {
    title: "Latest Palm Shape",
    value: dashboard?.latest_palm_shape ?? "N/A",
    description: "Most recent result",
  },
  {
    title: "AI Model",
    value: dashboard?.ai_model ?? "Llama 3.2",
    description: "Analysis engine",
  },
  {
    title: "Member Since",
    value: dashboard?.member_since
      ? new Date(dashboard.member_since).toLocaleDateString()
      : "N/A",
    description: "Registration date",
  },
], [dashboard]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-700">Dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-900">
                Welcome back, {user?.full_name || "reader"}.
              </h1>
              <p className="mt-3 text-slate-500">Your palmistry intelligence workspace is ready.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-3xl bg-purple-700 px-5 py-4 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.2em] text-purple-200">Active stage</p>
                <p className="mt-3 text-2xl font-semibold">AI Palm Analysis</p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <section className="rounded-[2rem] bg-red-50 p-6 text-red-700 shadow-inner">
            <p className="text-sm font-medium">Error loading dashboard:</p>
            <p className="mt-2 text-sm">{error}</p>
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-3xl bg-slate-200" />
            ))
          ) : (
            stats.map((item) => (
              <div key={item.title} className="rounded-3xl bg-white p-6 shadow-lg">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{item.title}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              </div>
            ))
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-600">Recent readings</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Latest sessions</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-200" />
                ))
              ) : recent.length === 0 ? (
                <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                  No recent readings available yet. Upload your first palm image to get started.
                </p>
              ) : (
                recent.map((item, index) => (
                  <div key={item.id || index} className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.title || item.summary || "Palm reading"}</p>
                        <p className="mt-2 text-sm text-slate-500">{item.created_at || item.timestamp || item.date || "Recent session"}</p>
                        <p className="text-sm font-semibold text-slate-900">
  {item.title || item.summary || "Palm reading"}
</p>
                      </div>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">

                        {item.status || "Completed"}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item?.ai_reading || item?.details || item?.summary || "No summary available."}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-gradient-to-br from-purple-700 to-indigo-700 p-8 text-white shadow-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Quick actions</p>
              <h2 className="mt-4 text-2xl font-semibold">Start a new reading</h2>
              <p className="mt-3 text-sm text-slate-100">Upload a high-resolution palm image and let the AI analyze your lines.</p>
              <div className="mt-6 grid gap-3">
                <Link to="/palm" className="inline-flex items-center justify-center rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-slate-100">
                  Upload palm image
                </Link>
                <Link to="/history" className="inline-flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                  View history
                </Link>
                <Link
  to="/profile"
  className="inline-flex items-center justify-center rounded-3xl border border-slate-300 px-5 py-3 text-sm font-semibold"
>
  View Profile
</Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-xl">
              <h3 className="text-xl font-semibold text-slate-900">Performance</h3>
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Analysis completion</span>
                    <span>92%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[92%] rounded-full bg-purple-600" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>User retention</span>
                    <span>79%</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full w-[79%] rounded-full bg-indigo-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
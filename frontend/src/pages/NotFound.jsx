import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-600">404 error</p>
        <h1 className="mt-4 text-5xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600">The page you are looking for does not exist or has been moved.</p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-purple-700 px-6 py-3 text-white transition hover:bg-purple-800"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

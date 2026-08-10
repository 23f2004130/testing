import { useEffect, useState } from "react";
import { getHistory, getHistoryById } from "../services/historyService";
import { useNavigate } from "react-router-dom";
function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getHistory()
      .then((response) => {
        setHistory(Array.isArray(response.data) ? response.data : []);
      })
      .catch((errorResponse) => {
        setError(errorResponse?.response?.data?.detail || "Unable to load history.");
      })
      .finally(() => setLoading(false));
  }, []);
  const handleViewReport = async (readingId) => {
  try {
    const response = await getHistoryById(readingId);

    navigate("/results", {
      state: {
        analysis: {
          original_image: response.data.original_image,
          processed_image: response.data.processed_image,
          line_image: response.data.line_image,

          classification: response.data.classification,
          finger_analysis: response.data.finger_analysis,
          line_analysis: response.data.line_analysis,

          interpretation: response.data.interpretation
        },

        readingId: response.data.id
      }
    });

  } catch (err) {
    console.error(err);
    alert("Unable to load report.");
  }
};
  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-slate-900">History</h1>
        <p className="mt-2 text-slate-600">Review your previous palm analyses and track insights over time.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-900 shadow-sm">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">No history found</h2>
          <p className="mt-3 text-slate-600">Upload your first palm image to start building your history.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item, index) => (
  <div
    key={item.id}
    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <div className="flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold">
          Analysis #{item.id}
        </h2>

        <p className="text-gray-500">
          {new Date(item.created_at).toLocaleString()}
        </p>
      </div>

      <span className="rounded-full bg-green-100 px-4 py-1 text-green-700">
        Completed
      </span>

    </div>

    <div className="grid md:grid-cols-2 gap-4 mt-6">

      <div className="bg-gray-100 rounded-xl p-4">
        <h3 className="font-semibold">
          Palm Shape
        </h3>

        <p className="mt-4 text-sm leading-6 text-slate-600">
  {item?.ai_reading || item?.details || item?.summary || "No summary available."}
</p>
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <h3 className="font-semibold">
          Longest Finger
        </h3>

        <p className="mt-2 text-lg">
          {item.longest_finger}
        </p>
      </div>

      <div className="bg-gray-100 rounded-xl p-4">
        <h3 className="font-semibold">
          Shortest Finger
        </h3>

        <p className="mt-2 text-lg">
          {item.shortest_finger}
        </p>
      </div>

    </div>

    <div className="mt-6">

      <h3 className="font-semibold mb-2">
        AI Interpretation
      </h3>

      <p className="whitespace-pre-wrap">
        {item.interpretation}
      </p>
      <button
  onClick={() => handleViewReport(item.id)}
  className="mt-5 rounded-xl bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
>
  View Report
</button>

    </div>

  </div>
))}
        </div>
      )}
    </div>
  );
}

export default History;

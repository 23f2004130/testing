import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [latestAnalysis, setLatestAnalysis] = useState({ analysis: null, readingId: null });
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const stored = window.localStorage.getItem("latestAnalysis");
      const parsedStored = stored ? JSON.parse(stored) : null;

      if (state?.analysis) {
        const payload = {
          analysis: state.analysis,
          readingId: state.readingId || parsedStored?.readingId || null,
        };
        setLatestAnalysis(payload);
        window.localStorage.setItem("latestAnalysis", JSON.stringify(payload));
      } else if (parsedStored) {
        setLatestAnalysis(parsedStored);
      }
    } catch (e) {
      console.error(e);
      setError("Unable to load the latest analysis.");
    } finally {
      setLoading(false);
    }
  }, [state]);

  const downloadPDF = async () => {
    console.log("Reading ID:", latestAnalysis.readingId);
    if (!latestAnalysis.readingId) {
      window.print();
      return;
    }

    try {
  setDownloading(true);

  const response = await api.get(`/reports/${latestAnalysis.readingId}`, {
    responseType: "blob",
  });

  console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Palm_Report_${latestAnalysis.readingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Unable to download PDF report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

   const analysis = latestAnalysis.analysis;

const summary = useMemo(() => {
  if (!analysis) return {};

  return {
    originalImage: analysis.original_image || null,

    processedImage: analysis.processed_image || null,

    lineImage: analysis.line_image || null,

    classification: analysis.classification || {},

    finger: analysis.finger_analysis || {},

    lines: analysis.line_analysis || {},

    interpretation:
      analysis.interpretation?.ai_reading ||
      analysis.interpretation ||
      "No interpretation available.",

    structured:
      analysis.interpretation?.structured_analysis || {},
  };
}, [analysis]);

console.log("Analysis:", analysis);
console.log("Summary:", summary);
  return (
    <div className="grid lg:grid-cols-2 gap-8 mt-8">

  {/* LEFT COLUMN */}
  <div className="space-y-6">

    {/* Original Image */}
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold">
        Original Palm Image
      </h2>

      {summary.originalImage ? (
        <img
          src={`http://127.0.0.1:8000/uploads/${summary.originalImage}`}
          alt="Original"
          className="mt-4 w-full rounded-xl"
        />
      ) : (
        <p className="mt-4 text-gray-500">
          Original image unavailable
        </p>
      )}
    </div>

    {/* Processed Image */}
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold">
        Processed Palm
      </h2>

      {summary.processedImage ? (
        <>

          <img
            src={`http://127.0.0.1:8000/uploads/${summary.processedImage}`}
            alt="Processed Palm"
            className="mt-4 w-full rounded-xl"
          />
        </>
      ) : (
        <p className="mt-4 text-gray-500">
          Processed image unavailable
        </p>
      )}
    </div>

    {/* Palm Lines */}
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="text-xl font-semibold">
        Detected Palm Lines
      </h2>

      {summary.lineImage ? (
        <img
          src={`http://127.0.0.1:8000/uploads/${summary.lineImage}`}
          alt="Palm Lines"
          className="mt-4 w-full rounded-xl"
        />
      ) : (
        <p className="mt-4 text-gray-500">
          Palm line image unavailable
        </p>
      )}
    </div>

  </div>

  {/* RIGHT COLUMN */}
  <div className="space-y-6">

    {/* Palm Classification */}
<div className="rounded-3xl bg-white p-6 shadow-lg">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    Palm Classification
  </h2>

  <div className="grid grid-cols-2 gap-4">

    <div className="bg-indigo-50 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Palm Shape</p>
      <p className="text-lg font-semibold text-indigo-700">
        {summary.classification?.palm_shape || "N/A"}
      </p>
    </div>

    <div className="bg-purple-50 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Palm Type</p>
      <p className="text-lg font-semibold text-purple-700">
        {summary.classification?.palm_type || "N/A"}
      </p>
    </div>

    <div className="bg-green-50 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Finger Type</p>
      <p className="text-lg font-semibold text-green-700">
        {summary.classification?.finger_type || "N/A"}
      </p>
    </div>

    <div className="bg-orange-50 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Palm Ratio</p>
      <p className="text-lg font-semibold text-orange-700">
        {summary.classification?.palm_ratio?.toFixed(2) ?? "N/A"}
      </p>
    </div>

    <div className="bg-pink-50 rounded-xl p-4 col-span-2">
      <p className="text-gray-500 text-sm">Finger Ratio</p>
      <p className="text-lg font-semibold text-pink-700">
        {summary.classification?.finger_ratio?.toFixed(2) ?? "N/A"}
      </p>
    </div>

  </div>
</div>
{/* Finger Analysis */}
<div className="rounded-3xl bg-white p-6 shadow-lg">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    Finger Analysis
  </h2>

  <div className="space-y-4">

    <div className="bg-indigo-50 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Longest Finger</p>
      <p className="text-lg font-semibold text-indigo-700">
        {summary.finger?.longest_finger || "N/A"}
      </p>
    </div>

    <div className="bg-purple-50 rounded-xl p-4">
      <p className="text-gray-500 text-sm">Shortest Finger</p>
      <p className="text-lg font-semibold text-purple-700">
        {summary.finger?.shortest_finger || "N/A"}
      </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-4">
      <h3 className="font-semibold mb-3">Finger Lengths</h3>

      {summary.finger?.lengths ? (
        Object.entries(summary.finger.lengths).map(([name, value]) => (
          <div
            key={name}
            className="flex justify-between border-b py-2 last:border-none"
          >
            <span className="capitalize">{name}</span>
            <span className="font-semibold">
              {Number(value).toFixed(2)} px
            </span>
          </div>
        ))
      ) : (
        <p>No finger data available.</p>
      )}
    </div>

  </div>
</div>

   {/* Palm Line Analysis */}
<div className="rounded-3xl bg-white p-6 shadow-lg">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">
    Palm Line Analysis
  </h2>

  {summary.lines && Object.keys(summary.lines).length > 0 ? (
    <div className="space-y-4">
      {Object.entries(summary.lines).map(([lineName, details]) => (
        <div
          key={lineName}
          className="rounded-xl border border-gray-200 bg-gray-50 p-4"
        >
          <h3 className="text-lg font-semibold text-indigo-700 capitalize mb-3">
            {lineName.replace(/_/g, " ")}
          </h3>

          {typeof details === "object" && details !== null ? (
            <div className="space-y-2">
              {Object.entries(details).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between border-b pb-2 last:border-none"
                >
                  <span className="capitalize text-gray-600">
                    {key.replace(/_/g, " ")}
                  </span>

                  <span className="font-semibold text-gray-800">
                    {typeof value === "number"
                      ? value.toFixed(2)
                      : String(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">{String(details)}</p>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">
      No palm line analysis available.
    </p>
  )}
</div>

  

<div className="space-y-5">
  {summary.interpretation
    ?.split("**")
    .filter((item) => item.trim() !== "")
    .map((item, index) => {
      // First paragraph before any headings
      if (index === 0) {
        return (
          <p key={index} className="text-gray-700 leading-7">
            {item.trim()}
          </p>
        );
      }

      const parts = item.split(":");
      const title = parts[0];
      const content = parts.slice(1).join(":").trim();

      return (
        <div
          key={index}
          className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm"
        >
          <h3 className="text-lg font-bold text-indigo-700 mb-2">
            {title}
          </h3>

          <p className="text-gray-700 leading-7">
            {content}
          </p>
        </div>
      );
    })}
</div>
{analysis?.recommendations && (
  <div className="mt-8 rounded-2xl bg-white p-6 shadow">
    <h2 className="text-2xl font-bold mb-4">
      Personalized Recommendations
    </h2>

    {analysis.recommendations.map((item, index) => (
      <div
        key={index}
        className="mb-4 rounded-xl bg-slate-100 p-4"
      >
        <h3 className="font-semibold text-indigo-700">
          {item.category}
        </h3>

        <p className="mt-2">
          {item.message}
        </p>
      </div>
    ))}
  </div>
)}

{analysis?.life_trends && (
  <div className="mt-8 rounded-2xl bg-white p-6 shadow">
    <h2 className="mb-6 text-2xl font-bold">
      Life Trend Analysis
    </h2>

    {Object.entries(analysis.life_trends).map(([key, value]) => (
      <div
        key={key}
        className="mb-5 rounded-xl bg-slate-100 p-5"
      >
        <h3 className="text-lg font-semibold capitalize text-indigo-700">
          {key.replace("_", " ")}
        </h3>

        <p className="mt-2 font-medium">
          Trend: {value.trend}
        </p>

        <p className="mt-2 text-slate-700">
          {value.description}
        </p>
      </div>
    ))}
  </div>
)}
    <button
      onClick={downloadPDF}
      disabled={downloading}
      className="w-full rounded-xl bg-indigo-600 py-3 text-white hover:bg-indigo-700"
    >
      {downloading ? "Downloading..." : "Download PDF Report"}
    </button>

  </div>

</div>
  );
}
export default Results; 
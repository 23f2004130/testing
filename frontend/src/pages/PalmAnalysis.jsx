import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import { uploadPalmImage } from "../services/analysisService";
import { getHistory } from "../services/historyService";

const analysisStages = [
  "Uploading image",
  "Detecting palm",
  "Extracting landmarks",
  "Detecting palm lines",
  "Finger analysis",
  "AI interpretation",
  "Generating report",
];

function PalmAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [result, setResult] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const currentStage = analysisStages[stageIndex] || "Waiting for upload";

  const handleFile = (fileItem) => {
    if (fileItem) {
      setFile(fileItem);
      setPreview(URL.createObjectURL(fileItem));
      setResult(null);
      setProgress(0);
      setStageIndex(0);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.files?.[0]) {
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.notify("Please select an image first.", "error");
      return;
    }

    setUploading(true);
    setStageIndex(0);
    setResult(null);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    const stageTimer = setInterval(() => {
  setStageIndex((current) => {
    if (current < analysisStages.length - 1) {
      return current + 1;
    }
    return current;
  });
}, 2500);

    try {
  setUploadError(null);

  
  const response = await uploadPalmImage(formData, (progressEvent) => {
    const percentage = Math.round(
      (progressEvent.loaded / progressEvent.total) * 100
    );
    setProgress(percentage);
});


console.log("UPLOAD RESPONSE:");
console.log(response.data);

  setResult(response.data);

  clearInterval(stageTimer);
  setStageIndex(analysisStages.length - 1);
  setProgress(100);
  setUploading(false);

  toast.notify("Upload completed. Analysis is ready.", "success");

  const latestAnalysis = {
    analysis: response.data,
    readingId: null,
  };

  window.localStorage.setItem(
    "latestAnalysis",
    JSON.stringify(latestAnalysis)
  );

  navigate("/results", { state: latestAnalysis });

} catch (error) {

  console.log("FULL ERROR:", error);
  console.log("ERROR RESPONSE:", error.response);
  console.log("ERROR DATA:", error.response?.data);
  console.log("ERROR MESSAGE:", error.message);

  clearInterval(stageTimer);
  setUploading(false);

  const message =
    error?.response?.data?.detail ||
    error?.message ||
    "Unable to upload image.";

  setUploadError(message);
  toast.notify(message, "error");
}
  };

  const previewImage = useMemo(() => preview, [preview]);

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-700">Palm analysis</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Upload your palm image for AI reading.</h1>
              <p className="mt-3 text-slate-500">Drag and drop an image, preview it, track upload progress, and receive instant results.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-6 py-4 text-slate-700 shadow-sm">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Current stage</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{currentStage}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block cursor-pointer rounded-[2rem] border-2 border-dashed border-purple-300 bg-purple-50/70 p-10 text-center transition hover:border-purple-500 hover:bg-purple-50"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-purple-700">Drag & Drop</p>
              <p className="mt-4 text-xl font-semibold text-slate-900">Drop your palm image here</p>
              <p className="mt-3 text-slate-500">Or click to select a file.</p>
              <label className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-3xl border-2 border-gray-300 bg-gray-100 px-6 py-5 text-gray-600 transition hover:border-purple-500 hover:bg-purple-50">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />

  <span className="font-medium">
    {file ? file.name : "Choose File"}
  </span>
</label>
            </div>

            <div className="mt-8 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Upload progress</p>
                <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-purple-600 transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{progress}% complete</p>
                {uploading && (
                  <p className="mt-2 text-sm text-indigo-700">{currentStage}…</p>
                )}
                {uploadError && (
                  <p className="mt-2 text-sm text-rose-700">{uploadError}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {analysisStages.map((stage, index) => (
                  <div
                    key={stage}
                    className={`rounded-3xl border p-4 ${index <= stageIndex ? "border-purple-600 bg-purple-50" : "border-slate-200 bg-white"}`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{stage}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Preview</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-900">Image preview</h2>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">{file ? file.name : "No file selected"}</span>
            </div>

            <div className="mt-6 rounded-[1.5rem] bg-slate-100 p-4">
              {previewImage ? (
                <img src={previewImage} alt="Palm preview" className="h-96 w-full rounded-[1.5rem] object-cover" />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-[1.5rem] bg-slate-200 text-slate-500">
                  Select a palm image to preview it here.
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-8 w-full rounded-3xl bg-purple-700 px-5 py-3 text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {uploading ? "Analyzing..." : "Upload and analyze"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PalmAnalysis;

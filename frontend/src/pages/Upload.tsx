import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Pick a file first");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      await API.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.dispatchEvent(new Event("upload"));
      navigate("/my-files");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-warmWhite dark:bg-charcoal px-4 py-10 transition-colors duration-300">
      <div className="max-w-2xl mx-auto scandi-card">
        <h2 className="text-2xl font-semibold text-gray-100 mb-4">
          Upload file
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="scandi-input"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={busy} className="scandi-btn">
              {busy ? "Uploading…" : "Upload"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/my-files")}
              className="scandi-btn bg-transparent border border-[#1f1f1f] text-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

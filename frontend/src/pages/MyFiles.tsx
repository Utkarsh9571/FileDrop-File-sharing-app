import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import FileCard from "../components/FileCard";

interface FileItem {
  _id: string;
  filename: string;
  createdAt: string;
}

export default function MyFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/files");
      console.log("[MyFiles] raw response:", res.data);

      const parsed =
        res.data?.files ??
        res.data?.data?.files ??
        (Array.isArray(res.data) ? res.data : null);

      let normalized: any[] = [];
      if (Array.isArray(parsed)) normalized = parsed;
      else if (Array.isArray(res.data?.data)) normalized = res.data.data;
      else if (Array.isArray(res.data)) normalized = res.data;
      else if (res.data?.files && Array.isArray(res.data.files)) normalized = res.data.files;

      normalized = normalized.filter((f) => f && typeof f === "object" && f._id);
      setFiles(normalized);
    } catch (err: any) {
      console.error("[MyFiles] fetch error:", err, err?.response);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth"));
        navigate("/sign-in");
        return;
      }
      setError(err?.response?.data?.message || "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    fetchFiles();
    const onUpload = () => fetchFiles();
    const onAuth = () => {
      const t = localStorage.getItem("token");
      if (!t) {
        setFiles([]);
        navigate("/sign-in");
      } else {
        fetchFiles();
      }
    };

    window.addEventListener("upload", onUpload);
    window.addEventListener("auth", onAuth);
    return () => {
      window.removeEventListener("upload", onUpload);
      window.removeEventListener("auth", onAuth);
    };
  }, [fetchFiles, navigate]);

  return (
    <div className="min-h-screen bg-warmWhite dark:bg-charcoal px-4 py-10 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-mutedBlue dark:text-accent mb-6">My Files</h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading files...</p>
        ) : error ? (
          <div>
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button onClick={() => fetchFiles()} className="scandi-btn">Retry</button>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No files uploaded yet.</p>
            <button onClick={() => navigate("/upload")} className="scandi-btn">Upload a file</button>
          </div>
        ) : (
          <div className="space-y-4">
            {files.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { format } from "date-fns";

interface FileModel {
  _id: string;
  fileName?: string;
  createdAt?: string | null;
  size?: number;
}

interface Props {
  file?: FileModel | null;
}

export default function FileCard({ file }: Props) {
  const [shareUrl, setShareUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // Defensive guard: prevents runtime crash if parent passes undefined
  if (!file || !file._id) {
    return (
      <div className="scandi-card p-4">
        <div className="text-sm scandi-muted">Missing file data</div>
      </div>
    );
  }

  const filename = file.fileName || "untitled";
  const formattedDate =
    file.createdAt && !isNaN(Date.parse(file.createdAt))
      ? format(new Date(file.createdAt), "dd MMM yyyy, hh:mm a")
      : "Unknown date";

  const handleDownload = async () => {
    setBusy(true);
    try {
      const res = await API.get(`/files/${file._id}/download`);
      const url = res.data?.url || res.data?.signedUrl;
      if (url) {
        window.open(url, "_blank");
        return;
      }
      alert("Download URL not available");
    } catch (err: any) {
      console.error("Download failed:", err, err?.response);
      const signed = err?.response?.data?.url || err?.response?.data?.signedUrl;
      if (signed) {
        window.open(signed, "_blank");
        return;
      }
      alert(err?.response?.data?.message || "Download failed");
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    setBusy(true);
    try {
      const res = await API.get(`/files/${file._id}/share`);
      const url = res.data?.url || res.data?.shareUrl || "";
      if (url) setShareUrl(url);
      else alert("Share link not available");
    } catch (err) {
      console.error("Share failed:", err);
      alert("Failed to generate share link");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied");
    } catch {
      alert("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this file? This action cannot be undone.")) return;
    setBusy(true);
    try {
      // Matches your backend route
      await API.delete(`/files/${file._id}/delete`);
      window.dispatchEvent(new Event("upload"));
      alert("File deleted");
    } catch (err: any) {
      console.error("Delete failed:", err, err?.response);
      if (err?.response?.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth"));
        navigate("/sign-in");
      } else {
        alert(err?.response?.data?.message || "Failed to delete file");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="scandi-card flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-100 truncate">{filename}</p>
          <p className="text-sm scandi-muted">{formattedDate}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={busy}
            className="scandi-btn disabled:opacity-60"
            aria-label={`Download ${filename}`}
          >
            Download
          </button>

          <button
            onClick={handleShare}
            disabled={busy}
            className="scandi-btn disabled:opacity-60"
            aria-label={`Share ${filename}`}
          >
            Share
          </button>

          <button
            onClick={handleDelete}
            disabled={busy}
            className="text-red-400 px-3 py-1 rounded-lg disabled:opacity-60"
            aria-label={`Delete ${filename}`}
          >
            Delete
          </button>
        </div>
      </div>

      {shareUrl && (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="scandi-input flex-1 truncate"
            aria-label="Share URL"
          />
          <button onClick={handleCopy} className="scandi-btn">
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

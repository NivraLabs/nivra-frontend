import { useState } from "react";

type Meta = { cid: string; url?: string };

export default function EvidenceUploader({
  onComplete,
}: {
  onComplete?: (m: Meta) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  }

  async function handleUpload() {
    if (!file) return alert("Select a file");
    setUploading(true);
    await new Promise((r) => setTimeout(r, 800));
    const cid = "bafy" + Math.random().toString(36).slice(2, 9);
    setUploading(false);
    onComplete?.({ cid, url: URL.createObjectURL(file) });
    setFile(null);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input type="file" onChange={handleFile} />
      <button
        className="btn btn-ghost"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
      {file && <div className="muted small">{file.name}</div>}
    </div>
  );
}

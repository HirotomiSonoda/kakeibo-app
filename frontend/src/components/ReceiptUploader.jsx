import { useState } from "react";

// ファイルをBase64のdata URLに変換する
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました"));
    reader.readAsDataURL(file);
  });
}

export default function ReceiptUploader({ onAnalyzed }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setError(null);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const response = await fetch("/api/analyze-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "解析に失敗しました");
      }

      const data = await response.json();
      onAnalyzed(data);
      setFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card uploader">
      <h2>レシートを読み込む</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />
      {previewUrl && (
        <img src={previewUrl} alt="レシートのプレビュー" className="preview-image" />
      )}
      <button onClick={handleAnalyze} disabled={!file || loading}>
        {loading ? "解析中..." : "レシートを解析する"}
      </button>
      {error && <p className="error-text">{error}</p>}
    </section>
  );
}

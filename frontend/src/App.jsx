import { useEffect, useState } from "react";
import ReceiptUploader from "./components/ReceiptUploader.jsx";
import RecordList from "./components/RecordList.jsx";
import CategoryPieChart from "./components/CategoryPieChart.jsx";
import MonthlyBarChart from "./components/MonthlyBarChart.jsx";
import { loadRecords, saveRecords } from "./utils/storage.js";

export default function App() {
  const [records, setRecords] = useState(() => loadRecords());

  // 記録が変わるたびにlocalStorageへ保存し、リロードしても消えないようにする
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  function handleAnalyzed(result) {
    const newRecords = result.items.map((item) => ({
      id: crypto.randomUUID(),
      date: result.date,
      store: result.store,
      name: item.name,
      price: item.price,
      category: item.category,
      createdAt: new Date().toISOString(),
    }));
    setRecords((prev) => [...prev, ...newRecords]);
  }

  function handleDelete(id) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>レシート家計簿</h1>
        <p>レシートを撮影・アップロードするだけで自動的に家計簿をつけられます。</p>
      </header>

      <main className="app-main">
        <ReceiptUploader onAnalyzed={handleAnalyzed} />

        <div className="chart-grid">
          <CategoryPieChart records={records} />
          <MonthlyBarChart records={records} />
        </div>

        <RecordList records={records} onDelete={handleDelete} />
      </main>
    </div>
  );
}

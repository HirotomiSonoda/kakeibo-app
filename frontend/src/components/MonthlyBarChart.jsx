import { Bar } from "react-chartjs-2";
import { useIsDarkMode } from "../utils/useIsDarkMode.js";

// 日付（YYYY-MM-DD）から「YYYY-MM」の月キーを取り出す
function toMonthKey(date) {
  if (!date) return "不明";
  return date.slice(0, 7);
}

export default function MonthlyBarChart({ records }) {
  const isDarkMode = useIsDarkMode();

  const totalsByMonth = new Map();
  for (const record of records) {
    const key = toMonthKey(record.date);
    totalsByMonth.set(key, (totalsByMonth.get(key) ?? 0) + record.price);
  }

  const months = [...totalsByMonth.keys()].sort();

  if (months.length === 0) {
    return (
      <section className="card">
        <h2>月別集計</h2>
        <p className="empty-text">まだ集計できるデータがありません。</p>
      </section>
    );
  }

  const barColor = isDarkMode ? "#3987e5" : "#2a78d6";
  const inkColor = isDarkMode ? "#c3c2b7" : "#52514e";
  const gridColor = isDarkMode ? "#2c2c2a" : "#e1e0d9";

  const data = {
    labels: months,
    datasets: [
      {
        label: "支出合計",
        data: months.map((m) => totalsByMonth.get(m)),
        backgroundColor: barColor,
        borderRadius: 4,
        maxBarThickness: 48,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y.toLocaleString()}円`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: inkColor },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: inkColor,
          callback: (value) => `${value.toLocaleString()}円`,
        },
        grid: { color: gridColor },
      },
    },
  };

  return (
    <section className="card">
      <h2>月別集計</h2>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

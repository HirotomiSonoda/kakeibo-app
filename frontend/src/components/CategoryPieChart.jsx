import { Pie } from "react-chartjs-2";
import { CATEGORIES, getCategoryColor } from "../utils/categories.js";
import { useIsDarkMode } from "../utils/useIsDarkMode.js";

export default function CategoryPieChart({ records }) {
  const isDarkMode = useIsDarkMode();

  const totalsByCategory = CATEGORIES.map((category) => ({
    category,
    total: records
      .filter((r) => r.category === category)
      .reduce((sum, r) => sum + r.price, 0),
  })).filter((entry) => entry.total > 0);

  const grandTotal = totalsByCategory.reduce((sum, e) => sum + e.total, 0);

  if (totalsByCategory.length === 0) {
    return (
      <section className="card">
        <h2>カテゴリ別集計</h2>
        <p className="empty-text">まだ集計できるデータがありません。</p>
      </section>
    );
  }

  const data = {
    labels: totalsByCategory.map((e) => e.category),
    datasets: [
      {
        data: totalsByCategory.map((e) => e.total),
        backgroundColor: totalsByCategory.map((e) =>
          getCategoryColor(e.category, isDarkMode)
        ),
        borderColor: isDarkMode ? "#1a1a19" : "#fcfcfb",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDarkMode ? "#c3c2b7" : "#52514e",
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed;
            const percent = ((value / grandTotal) * 100).toFixed(1);
            return `${ctx.label}: ${value.toLocaleString()}円 (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <section className="card">
      <h2>カテゴリ別集計</h2>
      <div className="chart-wrapper">
        <Pie data={data} options={options} />
      </div>
      <table className="summary-table">
        <thead>
          <tr>
            <th>カテゴリ</th>
            <th>金額</th>
            <th>割合</th>
          </tr>
        </thead>
        <tbody>
          {totalsByCategory.map((e) => (
            <tr key={e.category}>
              <td>
                <span
                  className="color-dot"
                  style={{ backgroundColor: getCategoryColor(e.category, isDarkMode) }}
                />
                {e.category}
              </td>
              <td>{e.total.toLocaleString()}円</td>
              <td>{((e.total / grandTotal) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

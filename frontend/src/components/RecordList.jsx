export default function RecordList({ records, onDelete }) {
  const sorted = [...records].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? "")
  );

  return (
    <section className="card">
      <h2>登録済みの記録（{records.length}件）</h2>
      {sorted.length === 0 ? (
        <p className="empty-text">まだ記録がありません。レシートを読み込んで登録してください。</p>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>日付</th>
                <th>店舗</th>
                <th>商品名</th>
                <th>カテゴリ</th>
                <th>金額</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((record) => (
                <tr key={record.id}>
                  <td>{record.date ?? "不明"}</td>
                  <td>{record.store ?? "-"}</td>
                  <td>{record.name}</td>
                  <td>{record.category}</td>
                  <td className="price-cell">{record.price.toLocaleString()}円</td>
                  <td>
                    <button className="delete-button" onClick={() => onDelete(record.id)}>
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

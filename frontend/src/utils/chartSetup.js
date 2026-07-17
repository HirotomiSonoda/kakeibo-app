// Chart.jsで使用する要素をまとめて登録する（アプリ起動時に一度だけ読み込む）
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

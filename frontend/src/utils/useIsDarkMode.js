import { useEffect, useState } from "react";

// OSのダーク/ライト設定を検知し、グラフの配色を切り替えるためのフック
export function useIsDarkMode() {
  const query = "(prefers-color-scheme: dark)";
  const [isDark, setIsDark] = useState(
    () => window.matchMedia && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setIsDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDark;
}

// 家計簿の記録をブラウザのlocalStorageに保存・読み込みするユーティリティ
const STORAGE_KEY = "kakeibo_records";

export function loadRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("記録の読み込みに失敗しました:", error);
    return [];
  }
}

export function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

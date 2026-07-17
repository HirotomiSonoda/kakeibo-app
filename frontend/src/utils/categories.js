// レシート品目のカテゴリ一覧と表示色
// backend/categories.js と同じカテゴリ名を保つこと（Claude APIの分類結果と対応させるため）
// 色はdataviz配色ガイドの検証済みカテゴリカルパレット（8色・固定順）を使用
export const CATEGORIES = [
  "食費",
  "日用品",
  "外食",
  "交通費",
  "娯楽",
  "医療",
  "衣服・美容",
  "その他",
];

export const CATEGORY_COLORS = {
  食費: { light: "#2a78d6", dark: "#3987e5" },
  日用品: { light: "#008300", dark: "#008300" },
  外食: { light: "#e87ba4", dark: "#d55181" },
  交通費: { light: "#eda100", dark: "#c98500" },
  娯楽: { light: "#1baf7a", dark: "#199e70" },
  医療: { light: "#eb6834", dark: "#d95926" },
  "衣服・美容": { light: "#4a3aa7", dark: "#9085e9" },
  その他: { light: "#e34948", dark: "#e66767" },
};

export function getCategoryColor(category, isDarkMode) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS["その他"];
  return isDarkMode ? colors.dark : colors.light;
}

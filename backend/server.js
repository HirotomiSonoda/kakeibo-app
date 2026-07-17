import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { CATEGORIES } from "./categories.js";

const app = express();
const PORT = process.env.PORT || 3001;

// レシート画像はBase64で送られてくるためボディサイズの上限を広げておく
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 使用モデル：Claude Haikuの最新バージョン
const MODEL = "claude-haiku-4-5-20251001";

// data URL（"data:image/jpeg;base64,xxxx"）からメディアタイプとBase64本体を取り出す
function parseDataUrl(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("画像データの形式が不正です");
  }
  return { mediaType: match[1], base64Data: match[2] };
}

// Claudeの応答からJSON部分だけを取り出す（```json ... ``` で囲まれる場合に対応）
function extractJson(text) {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  const jsonText = fenced ? fenced[1] : text;
  return JSON.parse(jsonText.trim());
}

app.post("/api/analyze-receipt", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "画像データが送信されていません" });
    }

    const { mediaType, base64Data } = parseDataUrl(image);

    const prompt = `あなたはレシート画像を読み取る家計簿アプリのアシスタントです。
添付されたレシート画像を読み取り、以下のJSON形式のみで回答してください。前置きや説明文は不要です。

{
  "date": "購入日（YYYY-MM-DD形式。読み取れない場合はnull）",
  "store": "店舗名（読み取れない場合はnull）",
  "items": [
    { "name": "商品名", "price": 金額（数値、税込み）, "category": "カテゴリ名" }
  ]
}

カテゴリ名は必ず次の一覧から最も適切なものを1つ選んでください：
${CATEGORIES.join("、")}

品目が判別できない場合は、レシート全体の合計金額を1件の品目（例:"合計"）として計上してください。`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const responseText = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");

    const parsed = extractJson(responseText);

    // カテゴリが一覧外の場合は「その他」に補正する
    const items = (parsed.items || []).map((item) => ({
      name: item.name ?? "不明な商品",
      price: Number(item.price) || 0,
      category: CATEGORIES.includes(item.category) ? item.category : "その他",
    }));

    res.json({
      date: parsed.date ?? null,
      store: parsed.store ?? null,
      items,
    });
  } catch (error) {
    console.error("レシート解析エラー:", error);
    res.status(500).json({ error: "レシートの解析に失敗しました。画像を確認して再度お試しください。" });
  }
});

app.listen(PORT, () => {
  console.log(`バックエンドサーバーが起動しました: http://localhost:${PORT}`);
});

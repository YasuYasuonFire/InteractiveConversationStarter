import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { situation, position, ageGroup, proximity, date } = req.body;

      // 距離感を言葉で表現
      const proximityText = proximity < 33 ? "フォーマル" : proximity > 66 ? "カジュアル" : "普通";
      
      // シチュエーションを日本語に変換
      const situationMap = {
        meeting: "会議前",
        elevator: "エレベーター内",
        break_room: "休憩室・給湯室",
        party: "飲み会・懇親会",
        encounter: "偶然の遭遇"
      };
      const situationText = situationMap[situation] || "一般的な場面";

      const prompt = `
あなたは自然な会話の専門家です。実際の職場でそのまま使える、自然で気軽な一言を生成してください。

状況:
- 場面: ${situationText}
- 相手: ${position}の${ageGroup}
- 関係性: ${proximityText}
- 日付: ${new Date(date).toLocaleDateString('ja-JP')}

要求:
実際にその場で言えるような、自然な一言を3つ生成してください。

制約:
- 簡潔で自然な口調（1文か2文程度）
- その場の空気を和らげる内容
- 相手との関係性に応じた適切な敬語レベル
- 仕事の話は避け、気軽な雑談として
- 番号や説明文は不要、会話文のみ
- 各候補は改行で区切る

例:
お疲れ様です！今日は暖かいですね。
エレベーター混んでますね。お先にどうぞ。
コーヒー美味しそうですね、どちらのお店のですか？
      `;

      const completion = await openai.chat.completions.create({
        // model: "gpt-3.5-turbo",
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const conversationStarter = completion.choices[0].message.content.trim();
      res.status(200).json({ conversationStarter });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ error: 'Failed to generate conversation starter' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
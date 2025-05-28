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
        あなたは、気まずい状況で使える会話スターターを生成する専門家です。
        以下の条件に基づいて、適切な会話スターターを生成してください：

        - シチュエーション: ${situationText}
        - 相手の立場: ${position}（目上の方、同僚、後輩 のいずれか）
        - 相手の年代: ${ageGroup}
        - 相手との親しさ: ${proximityText}

        #制約条件
        会話スターターは以下の構成にしてください：
        1. シチュエーションに応じた適切な挨拶
        2. 相手の年代に合わせた話題の導入
        3. 会話を促す質問

        回答は、それぞれのパートを改行で区切ってください。
        必ず、冒頭にリスト番号を付与してください。
        フレンドリーで自然な口調を心がけ、場の雰囲気を和らげるような内容にしてください。
        
        2. の回答については、箇条書きで候補を5個は列挙してください。
        - シチュエーションの特性を活かした自然な会話を心がけてください（エレベーターなら短時間、会議前なら緊張緩和など）
        - 相手との親しさが高いほど、カジュアルな口語体で敬語は使わないでください。
        - 相手の年代の情報は、文中には直接的に言及しないでください。
        - 仕事の話は極力避けて、雑談としてください。
        - 今日は${new Date(date).toLocaleDateString('ja-JP')}です。
        - 最近のニュースや時候の話題も時々、織り交ぜてください。
        - 春夏秋冬の季節の話題は、ランダムに5%の確率でのみ入れてください。
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
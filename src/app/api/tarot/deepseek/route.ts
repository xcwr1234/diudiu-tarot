import { respData, respErr } from "@/lib/resp";
import { generateInterpretation } from "@/services/tarot";

export async function POST(req: Request) {
  try {
    const { question, cards, deck_type, spread_type, language } = await req.json();
    
    if (!question || !cards || !deck_type || !spread_type) {
      return respErr("Missing required parameters");
    }

    // Use provided language or default to 'zh'
    const userLanguage = language || 'zh';

    // Use the generateInterpretation function from tarot service
    const interpretation = await generateInterpretation(deck_type, spread_type, cards, question, userLanguage);
    
    if (!interpretation) {
      return respErr("Failed to generate interpretation");
    }

    return respData({ interpretation });
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return respErr("Failed to generate interpretation");
  }
}

 
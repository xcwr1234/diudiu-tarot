import { respData, respErr } from "@/lib/resp";
import { performTarotReading, generateInterpretation } from "@/services/tarot";
import { DeckType, SpreadType } from "@/types/tarot";
import OpenAI from "openai";

// Initialize DeepSeek client
function getDeepSeekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn("DEEPSEEK_API_KEY not found");
    return null;
  }
  
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
}

// 分析用户问题并推荐牌阵
async function analyzeQuestionAndRecommendSpread(question: string, language: string = 'zh'): Promise<{deckType: string, spreadType: string, recommendation: string}> {
  const deepseekClient = getDeepSeekClient();
  const isZh = language === 'zh';
  
  if (!deepseekClient) {
    // 降级模式：使用默认推荐
    return {
      deckType: "waite",
      spreadType: "celtic_cross",
      recommendation: isZh ? "根据你的问题，我推荐使用维特塔罗的凯尔特十字阵，它能全面分析你的情况。" : "Based on your question, I recommend using the Celtic Cross spread with Rider-Waite Tarot for a comprehensive analysis."
    };
  }

  try {
    const systemPrompt = isZh
      ? `你是丢丢，一只智慧可爱的小狗塔罗师。你需要根据用户的问题推荐最合适的塔罗牌组和占卜方式。

可选牌组：
- waite: 维特塔罗（经典图像和象征主义）
- marseille: 马赛塔罗（传统法国符号系统）
- thoth: 透特塔罗（克劳利的密教智慧）
- golden_dawn: 黄金黎明（赫尔墨斯卡巴拉对应关系）

可选占卜方式：
- celtic_cross: 凯尔特十字（全能牌阵，适合复杂问题）
- three_card_time: 三牌时间流（过去、现在、未来）
- love_relationship: 关系深度阵（分析感情或合作关系）
- career_path: 职业路径阵（探索职业方向）
- healing: 心灵疗愈阵（心理创伤或情绪疏导）
- yes_no: 是/否问题阵（简单二元问题）
- decision_cross: 十字决策阵（二选一决策）

请根据用户问题的性质、复杂度和主题，推荐最合适的牌组和占卜方式。回复格式为JSON：
{
  "deckType": "牌组类型",
  "spreadType": "占卜方式",
  "reason": "推荐理由"
}`
      : `You are Diudiu, a wise and cute puppy tarot reader. You need to recommend the most suitable tarot deck and spread based on the user's question.

Available decks:
- waite: Rider-Waite Tarot (Classic imagery and symbolism)
- marseille: Marseille Tarot (Traditional French symbolic system)
- thoth: Thoth Tarot (Aleister Crowley's occult wisdom)
- golden_dawn: Golden Dawn (Hermetic Qabalah correspondences)

Available spreads:
- celtic_cross: Celtic Cross (Universal spread for complex questions)
- three_card_time: Three Card Time Flow (Past, Present, Future)
- love_relationship: Love & Relationship (Analyze emotional connections)
- career_path: Career Path (Explore professional direction)
- healing: Healing Spread (Psychological trauma healing)
- yes_no: Yes/No Question (Simple binary questions)
- decision_cross: Decision Cross (Choose between two options)

Please recommend the most suitable deck and spread based on the nature, complexity, and theme of the user's question. Respond in JSON format:
{
  "deckType": "deck_type",
  "spreadType": "spread_type", 
  "reason": "recommendation_reason"
}`;

    const response = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    
    try {
      const recommendation = JSON.parse(content || '{}');
      return {
        deckType: recommendation.deckType || "waite",
        spreadType: recommendation.spreadType || "celtic_cross",
        recommendation: recommendation.reason || (isZh ? "我为你推荐了这个组合" : "I recommend this combination for you")
      };
    } catch (parseError) {
      // 如果JSON解析失败，使用默认值
      return {
        deckType: "waite",
        spreadType: "celtic_cross",
        recommendation: isZh ? "根据你的问题，我推荐使用维特塔罗的凯尔特十字阵。" : "Based on your question, I recommend using the Celtic Cross spread with Rider-Waite Tarot."
      };
    }
  } catch (error) {
    console.error("Question analysis failed:", error);
    return {
      deckType: "waite",
      spreadType: "celtic_cross",
      recommendation: isZh ? "根据你的问题，我推荐使用维特塔罗的凯尔特十字阵。" : "Based on your question, I recommend using the Celtic Cross spread with Rider-Waite Tarot."
    };
  }
}

export async function POST(req: Request) {
  try {
    const { question, language = 'zh' } = await req.json();
    
    if (!question || !question.trim()) {
      return respErr("问题不能为空");
    }

    // 第一步：分析问题并推荐牌阵
    const recommendation = await analyzeQuestionAndRecommendSpread(question.trim(), language);
    
    return respData({
      phase: "recommendation",
      question: question.trim(),
      recommendation: recommendation.recommendation,
      suggestedDeck: recommendation.deckType,
      suggestedSpread: recommendation.spreadType,
      message: language === 'zh' 
        ? `🐕 汪汪！丢丢已经仔细分析了你的问题。${recommendation.recommendation}`
        : `🐕 Woof woof! Diudiu has carefully analyzed your question. ${recommendation.recommendation}`
    });
    
  } catch (error) {
    console.error("Smart reading failed:", error);
    return respErr("智能推荐失败");
  }
}







import { respData, respErr } from "@/lib/resp";
import { performTarotReading, generateInterpretation } from "@/services/tarot";
import { DeckType, SpreadType } from "@/models/tarot";

export async function POST(req: Request) {
  try {
    const { question, deckType, spreadType, language = 'zh' } = await req.json();
    
    if (!question || !deckType || !spreadType) {
      return respErr("缺少必要参数");
    }

    // 验证牌组类型
    const validDeckTypes = Object.values(DeckType);
    if (!validDeckTypes.includes(deckType as DeckType)) {
      return respErr("无效的牌组类型");
    }

    // 验证占卜方式
    const validSpreadTypes = Object.values(SpreadType);
    if (!validSpreadTypes.includes(spreadType as SpreadType)) {
      return respErr("无效的占卜方式");
    }

    // 根据占卜方式确定抽牌数量
    const getCardCount = (spread: SpreadType): number => {
      switch (spread) {
        case SpreadType.ThreeCardTime: return 3;
        case SpreadType.YesNo: return 1;
        case SpreadType.DecisionCross: return 5;
        case SpreadType.SevenDay: return 7;
        case SpreadType.RelationshipMirror: return 4;
        case SpreadType.ProblemSolving: return 4;
        case SpreadType.ElementalBalance: return 4;
        case SpreadType.MarseillePentacle: return 5;
        case SpreadType.CelticCross: return 10;
        case SpreadType.LoveRelationship: return 6;
        case SpreadType.CareerPath: return 5;
        case SpreadType.Healing: return 4;
        case SpreadType.SeasonalForecast: return 4;
        case SpreadType.TwoPaths: return 6;
        case SpreadType.DreamInterpretation: return 3;
        case SpreadType.MoneyFlow: return 5;
        case SpreadType.TreeOfLife: return 10;
        case SpreadType.Hexagram: return 7;
        case SpreadType.PlanetaryInfluence: return 7;
        case SpreadType.ElementalInvocation: return 4;
        case SpreadType.CrowleyTriad: return 3;
        case SpreadType.WheelOfAeon: return 8;
        case SpreadType.ThothCross: return 10;
        case SpreadType.SpiritualAwakening: return 5;
        case SpreadType.PentagramRitual: return 5;
        case SpreadType.PlanetaryDays: return 7;
        case SpreadType.HgaCommunication: return 6;
        case SpreadType.ThreePillars: return 3;
        case SpreadType.Pathworking: return 10;
        case SpreadType.ElementalEvocation: return 4;
        case SpreadType.GdCross: return 10;
        case SpreadType.LunarPhase: return 4;
        default: return 3;
      }
    };

    const cardCount = getCardCount(spreadType as SpreadType);

    // 执行塔罗占卜
    const reading = await performTarotReading(
      deckType as DeckType, 
      spreadType as SpreadType, 
      question.trim(), 
      cardCount
    );
    
    // 生成AI解读
    const interpretation = await generateInterpretation(
      deckType as DeckType, 
      spreadType as SpreadType, 
      reading.cards_drawn, 
      question.trim(), 
      language
    );
    
    // 返回完整的占卜结果
    const completeReading = {
      ...reading,
      interpretation: interpretation
    };
    
    return respData({
      phase: "completed",
      reading: completeReading,
      message: language === 'zh' 
        ? `🐕 汪汪！丢丢已经为你完成了占卜，现在让我为你解读这些神秘的牌面...`
        : `🐕 Woof woof! Diudiu has completed your reading, now let me interpret these mysterious cards for you...`
    });
    
  } catch (error) {
    console.error("Perform reading failed:", error);
    return respErr("占卜执行失败");
  }
}


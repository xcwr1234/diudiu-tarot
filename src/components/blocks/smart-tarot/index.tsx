"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RiMagicLine, RiRefreshLine, RiHeartLine } from "react-icons/ri";
import { useTranslations, useLocale } from "next-intl";
import Typewriter from "@/components/ui/typewriter";
import { SpreadType } from "@/types/tarot";

interface TarotCard {
  id: number;
  card_name: string;
  card_number: number | null;
  suit: string | null;
  arcana_type: string | null;
  upright_meaning: string | null;
  reversed_meaning: string | null;
  keywords: string | null;
  image_url: string | null;
  is_reversed: boolean;
}

interface TarotReading {
  uuid: string;
  deck_type: string;
  spread_type: string;
  question: string;
  cards_drawn: TarotCard[];
  interpretation: string;
  created_at: string;
}

interface Recommendation {
  phase: string;
  question: string;
  recommendation: string;
  suggestedDeck: string;
  suggestedSpread: string;
  message: string;
}

// 辅助函数：根据卡牌名称获取本地图片路径
function getLocalCardImage(cardName: string): string | null {
  const cleanName = cardName.trim();
  
  const majorArcanaMap: { [key: string]: string } = {
    "The Fool": "0-The Fool",
    "The Magician": "1-The Magician",
    "The High Priestess": "2-The High Priestess",
    "The Empress": "3-The Empress",
    "The Emperor": "4-The Emperor",
    "The Hierophant": "5-The Hierophant",
    "The Lovers": "6-The Lovers",
    "The Chariot": "7-The Chariot",
    "Strength": "8-Strength",
    "The Hermit": "9-The Hermit",
    "Wheel of Fortune": "10-Wheel of Fortune",
    "Justice": "11-Justice",
    "The Hanged Man": "12-The Hanged Man",
    "Death": "13-Death",
    "Temperance": "14-Temperance",
    "The Devil": "15-The Devil",
    "The Tower": "16-The Tower",
    "The Star": "17-The Star",
    "The Moon": "18-The Moon",
    "The Sun": "19-The Sun",
    "Judgement": "20-Judgement",
    "The World": "21-The World"
  };
  
  if (majorArcanaMap[cleanName]) {
    return `/imgs/rider-waite/Major Arcana/${majorArcanaMap[cleanName]}.webp`;
  }
  
  const minorArcanaPattern = /^(Ace|[2-9]|10|Page|Knight|Queen|King) of (Cups|Wands|Swords|Pentacles)$/i;
  const match = cleanName.match(minorArcanaPattern);
  
  if (match) {
    const suit = match[2];
    return `/imgs/rider-waite/Minor Arcana/${suit}/${cleanName}.webp`;
  }
  
  return null;
}

// 将字符串转换为SpreadType枚举
function getSpreadTypeEnum(spreadType: string): SpreadType {
  return spreadType as SpreadType;
}

// 获取牌阵位置的中文描述
function getCardPositionZh(spreadType: SpreadType, index: number): string {
  const positions: { [key in SpreadType]?: string[] } = {
    [SpreadType.ThreeCardTime]: ["过去", "现在", "未来"],
    [SpreadType.CelticCross]: ["现在", "挑战", "过去", "未来", "上方", "下方", "建议", "外界影响", "希望/恐惧", "结果"],
    [SpreadType.LoveRelationship]: ["你的感受", "TA的感受", "关系状态", "挑战", "潜在发展", "最终趋势"],
    [SpreadType.CareerPath]: ["当前工作状态", "你的优势", "需要改进", "潜在机会", "长期建议"],
    [SpreadType.Healing]: ["痛苦根源", "疗愈障碍", "可用资源", "疗愈状态"],
    [SpreadType.SeasonalForecast]: ["春季", "夏季", "秋季", "冬季"],
    [SpreadType.TwoPaths]: ["选项A-优势", "选项A-劣势", "选项A-结果", "选项B-优势", "选项B-劣势", "选项B-结果"],
    [SpreadType.DreamInterpretation]: ["表面含义", "隐藏信息", "个人启示"],
    [SpreadType.MoneyFlow]: ["当前财务状况", "收入来源", "支出问题", "潜在机会", "长期建议"],
  };
  
  return positions[spreadType]?.[index] || `位置 ${index + 1}`;
}

export default function SmartTarotReading() {
  const t = useTranslations("tarot");
  const locale = useLocale();
  
  const [question, setQuestion] = useState("");
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  // 第一步：分析问题并推荐牌阵
  const analyzeQuestion = async () => {
    if (!question.trim()) {
      alert("请输入你的问题");
      return;
    }

    setIsAnalyzing(true);
    setRecommendation(null);
    setReading(null);

    try {
      const response = await fetch("/api/tarot/smart-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          language: locale,
        }),
      });

      const result = await response.json();
      
      if (result.code === 0) {
        setRecommendation(result.data);
      } else {
        alert("分析失败: " + result.message);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      alert("分析失败");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 第二步：执行占卜
  const performReading = async () => {
    if (!recommendation) return;

    setIsReading(true);
    setReading(null);
    setRevealedCards([]);

    try {
      const response = await fetch("/api/tarot/perform-reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: recommendation.question,
          deckType: recommendation.suggestedDeck,
          spreadType: recommendation.suggestedSpread,
          language: locale,
        }),
      });

      const result = await response.json();
      
      if (result.code === 0) {
        setReading(result.data.reading);
      } else {
        alert("占卜失败: " + result.message);
      }
    } catch (error) {
      console.error("Reading error:", error);
      alert("占卜失败");
    } finally {
      setIsReading(false);
    }
  };

  // 翻牌动画
  const revealCard = (index: number) => {
    setRevealedCards(prev => [...prev, index]);
  };

  // 重置
  const resetReading = () => {
    setQuestion("");
    setRecommendation(null);
    setReading(null);
    setRevealedCards([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            🐕 丢丢智能塔罗占卜 🔮
          </h1>
          
          <div className="space-y-8">
            {/* 第一步：提问 */}
            {!recommendation && !reading && (
              <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <RiHeartLine className="text-purple-400" />
                    第一步：提出你的问题
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    告诉丢丢你想了解什么，丢丢会根据你的问题推荐最合适的牌阵
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="例如：我的工作发展会如何？我的感情关系有什么需要注意的？..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[100px] bg-black/20 border-gray-700 text-white placeholder-gray-400"
                  />
                  <Button 
                    onClick={analyzeQuestion}
                    disabled={isAnalyzing || !question.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isAnalyzing ? "丢丢正在分析中..." : "🐕 让丢丢分析我的问题"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* 第二步：推荐结果 */}
            {recommendation && !reading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-300">
                      <RiMagicLine className="text-purple-400" />
                      第二步：丢丢的推荐
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
                      <Typewriter 
                        text={recommendation.message}
                        speed={25}
                        delay={100}
                        className="text-gray-200"
                      />
                    </div>
                    
                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
                      <h4 className="font-semibold text-green-300 mb-2">推荐牌阵</h4>
                      <Badge className="bg-green-600 text-white">
                        {recommendation.suggestedSpread === 'celtic_cross' ? '凯尔特十字' :
                         recommendation.suggestedSpread === 'three_card_time' ? '三牌时间流' :
                         recommendation.suggestedSpread === 'love_relationship' ? '关系深度阵' :
                         recommendation.suggestedSpread === 'career_path' ? '职业路径阵' :
                         recommendation.suggestedSpread === 'healing' ? '心灵疗愈阵' : '其他牌阵'}
                      </Badge>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={performReading}
                        disabled={isReading}
                        className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                      >
                        {isReading ? "丢丢正在占卜中..." : "🐕 开始占卜"}
                      </Button>
                      <Button 
                        onClick={resetReading}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                      >
                        重新提问
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 第三步：占卜结果 */}
            {reading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-300">
                      <RiMagicLine className="text-purple-400" />
                      第三步：占卜结果
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* 问题显示 */}
                      <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
                        <h4 className="font-semibold text-purple-300 mb-2">你的问题</h4>
                        <p className="text-gray-200">{reading.question}</p>
                      </div>

                      {/* 牌面展示 */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-purple-300">抽到的牌面</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {reading.cards_drawn.map((card, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-center"
                            >
                              <div className="relative">
                                <div 
                                  className={`w-24 h-36 mx-auto rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 cursor-pointer ${card.is_reversed ? 'rotate-180' : ''}`}
                                  onClick={() => revealCard(index)}
                                >
                                  {revealedCards.includes(index) ? (
                                    (() => {
                                      const localImagePath = getLocalCardImage(card.card_name);
                                      return (
                                        <>
                                          {localImagePath ? (
                                            <img 
                                              src={localImagePath} 
                                              alt={card.card_name}
                                              className="w-full h-full object-cover rounded-lg"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center rounded-lg">
                                              <span className="text-purple-200 font-bold text-xs text-center px-2">
                                                {t(`card_names.${card.card_name}`) || card.card_name}
                                              </span>
                                            </div>
                                          )}
                                        </>
                                      );
                                    })()
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-800 to-purple-900 flex items-center justify-center rounded-lg">
                                      <span className="text-purple-200 text-lg">?</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-xs text-gray-300 font-semibold mb-1">
                                  {getCardPositionZh(getSpreadTypeEnum(reading.spread_type), index)}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {revealedCards.includes(index) ? (t(`card_names.${card.card_name}`) || card.card_name) : "点击翻牌"}
                                </p>
                                {revealedCards.includes(index) && (
                                  <Badge 
                                    variant={card.is_reversed ? "destructive" : "default"} 
                                    className={`text-xs mt-1 ${card.is_reversed ? "bg-red-900/50 text-red-200" : "bg-green-900/50 text-green-200"}`}
                                  >
                                    {card.is_reversed ? "逆位" : "正位"}
                                  </Badge>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* AI解读 */}
                      <div className="bg-black/20 rounded-lg p-6 border border-gray-700/30">
                        <h4 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
                          🐕 丢丢的解读
                        </h4>
                        <Typewriter 
                          text={reading.interpretation}
                          speed={20}
                          delay={200}
                          className="text-gray-200 whitespace-pre-wrap"
                        />
                      </div>

                      {/* 重新占卜按钮 */}
                      <div className="text-center">
                        <Button 
                          onClick={resetReading}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-purple-500 transition-colors"
                        >
                          <RiRefreshLine className="mr-2" />
                          重新占卜
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


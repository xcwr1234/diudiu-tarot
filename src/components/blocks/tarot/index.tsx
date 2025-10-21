"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RiMagicLine, RiEyeLine, RiRefreshLine, RiHeartLine } from "react-icons/ri";
import { useTranslations, useLocale } from "next-intl";
import AnimationToast from "@/components/ui/animation-toast";
import Typewriter from "@/components/ui/typewriter";

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

// 辅助函数：根据卡牌名称获取本地图片路径
function getLocalCardImage(cardName: string): string | null {
  // 清理卡牌名称
  const cleanName = cardName.trim();
  
  // 大阿尔卡纳牌映射 (基于文件名格式: "0-The Fool.webp")
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
  
  // 检查是否是大阿尔卡纳
  if (majorArcanaMap[cleanName]) {
    return `/imgs/rider-waite/Major Arcana/${majorArcanaMap[cleanName]}.webp`;
  }
  
  // 小阿尔卡纳牌映射 (基于文件名格式: "Ace of Cups.webp", "2 of Cups.webp")
  const minorArcanaPattern = /^(Ace|[2-9]|10|Page|Knight|Queen|King) of (Cups|Wands|Swords|Pentacles)$/i;
  const match = cleanName.match(minorArcanaPattern);
  
  if (match) {
    const suit = match[2];
    // 文件名格式与卡牌名称一致
    return `/imgs/rider-waite/Minor Arcana/${suit}/${cleanName}.webp`;
  }
  
  return null;
}

export default function TarotReading() {
  const t = useTranslations("tarot");
  const locale = useLocale();
  
  // 只使用 Rider-Waite 塔罗牌
  const deckTypes = [
    { value: "waite", label: t("deck_types.waite"), description: t("deck_types.waite_desc") },
  ];

  // 只使用 Rider-Waite 塔罗的占卜方式
  const getSpreadTypes = () => {
    return [
        { value: "celtic_cross", label: t("spread_types.waite.celtic_cross"), description: t("spread_types.waite.celtic_cross_desc") },
        { value: "love_relationship", label: t("spread_types.waite.love_relationship"), description: t("spread_types.waite.love_relationship_desc") },
        { value: "career_path", label: t("spread_types.waite.career_path"), description: t("spread_types.waite.career_path_desc") },
        { value: "healing", label: t("spread_types.waite.healing"), description: t("spread_types.waite.healing_desc") },
        { value: "seasonal_forecast", label: t("spread_types.waite.seasonal_forecast"), description: t("spread_types.waite.seasonal_forecast_desc") },
        { value: "two_paths", label: t("spread_types.waite.two_paths"), description: t("spread_types.waite.two_paths_desc") },
        { value: "dream_interpretation", label: t("spread_types.waite.dream_interpretation"), description: t("spread_types.waite.dream_interpretation_desc") },
        { value: "money_flow", label: t("spread_types.waite.money_flow"), description: t("spread_types.waite.money_flow_desc") },
    ];
  };

  // 固定使用 Rider-Waite 牌组
  const [selectedDeck] = useState("waite");
  const [selectedSpread, setSelectedSpread] = useState("");
  const [question, setQuestion] = useState("");

  // 根据占卜方式确定抽牌数量（仅Rider-Waite）
  const getCardCount = (spreadType: string) => {
    const cardCountMap: { [key: string]: number } = {
      "celtic_cross": 10,
      "love_relationship": 6,
      "career_path": 5,
      "healing": 4,
      "seasonal_forecast": 4,
      "two_paths": 6,
      "dream_interpretation": 3,
      "money_flow": 5,
    };
    
    return cardCountMap[spreadType] || 1;
  };

  // 根据占卜方式获取牌阵布局样式（仅Rider-Waite）
  const getSpreadLayout = (spreadType: string, index: number) => {
    const layouts: { [key: string]: (index: number) => any } = {
      // Rider-Waite 塔罗
      "celtic_cross": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 中心
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左
          { className: "col-span-1", style: { gridColumn: "3", gridRow: "2" } }, // 右
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "3" } }, // 下
          { className: "col-span-1", style: { gridColumn: "4", gridRow: "1" } }, // 右上
          { className: "col-span-1", style: { gridColumn: "4", gridRow: "2" } }, // 右中
          { className: "col-span-1", style: { gridColumn: "4", gridRow: "3" } }, // 右下
          { className: "col-span-1", style: { gridColumn: "5", gridRow: "1" } }, // 最右上
          { className: "col-span-1", style: { gridColumn: "5", gridRow: "2" } }, // 最右中
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
      "love_relationship": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "1" } }, // 左上
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 右上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 右下
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "3" } }, // 左下下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "3" } }, // 右下下
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
      "career_path": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "1" } }, // 左上
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 右上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 右下
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "3", gridColumnEnd: "3" } }, // 底部跨越
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
      "healing": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "1" } }, // 左上
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 右上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 右下
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
      "seasonal_forecast": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "1" } }, // 左上
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 右上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 右下
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
      "two_paths": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "1" } }, // 左列上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左列中
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "3" } }, // 左列下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 右列上
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 右列中
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "3" } }, // 右列下
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
      "dream_interpretation": (index: number) => ({
        className: "col-span-1",
        style: { transform: `translateX(${(index - 1) * 20}px)` }
      }),
      "money_flow": (index: number) => {
        const positions = [
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "1" } }, // 左上
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "1" } }, // 右上
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "2" } }, // 左下
          { className: "col-span-1", style: { gridColumn: "2", gridRow: "2" } }, // 右下
          { className: "col-span-1", style: { gridColumn: "1", gridRow: "3", gridColumnEnd: "3" } }, // 底部跨越
        ];
        return positions[index] || { className: "col-span-1", style: {} };
      },
    };
    
    return layouts[spreadType]?.(index) || { className: "col-span-1", style: {} };
  };

  const [isReading, setIsReading] = useState(false);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [animationToast, setAnimationToast] = useState<{
    content: string;
    isVisible: boolean;
  }>({ content: "", isVisible: false });

  const performReading = async () => {
    if (!selectedSpread || !question.trim()) {
      alert("请填写所有字段");
      return;
    }

    setIsReading(true);
    setRevealedCards([]);

    try {
      const cardCount = getCardCount(selectedSpread);
      const response = await fetch("/api/tarot/reading", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deck_type: selectedDeck,
          spread_type: selectedSpread,
          question: question.trim(),
          card_count: cardCount,
          language: locale,
        }),
      });

      const result = await response.json();
      
      if (result.code === 0) {
        setReading(result.data);
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

  const generateAIInterpretation = async () => {
    if (!reading) return;

    try {
      const response = await fetch("/api/tarot/deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deck_type: reading.deck_type,
          spread_type: reading.spread_type,
          question: reading.question,
          cards: reading.cards_drawn,
          language: locale,
        }),
      });

      const result = await response.json();
      
      if (result.code === 0) {
        // Update the reading with AI interpretation
        setReading({
          ...reading,
          interpretation: result.data.interpretation,
        });
      } else {
        alert(t("ai_interpretation_failed") + ": " + result.message);
      }
    } catch (error) {
      console.error("AI interpretation error:", error);
      alert(t("ai_interpretation_failed"));
    }
  };

  const revealCard = (index: number) => {
    // 显示卡片
    setRevealedCards(prev => [...prev, index]);
  };

  const resetReading = () => {
    setReading(null);
    setRevealedCards([]);
    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-purple-200 to-gray-300 drop-shadow-2xl text-blend relative">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-300">
              {t("subtitle")}
            </p>
          </div>

          {!reading ? (
            <Card className="mb-8 bg-black/40 border-gray-800 backdrop-blur-sm card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <RiMagicLine className="text-purple-400 glow-purple" />
                  {t("start_reading")}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {t("start_reading_desc")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">{t("spread_type")}</label>
                  <Select value={selectedSpread} onValueChange={setSelectedSpread}>
                      <SelectTrigger className="bg-black/30 border-gray-700 text-gray-200 hover:border-purple-500 transition-colors">
                      <SelectValue placeholder={t("select_spread")} />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-gray-700">
                      {getSpreadTypes().map((spread: any) => (
                          <SelectItem key={spread.value} value={spread.value} className="text-gray-200 hover:bg-purple-900/50">
                            <div>
                              <div className="font-medium">{spread.label}</div>
                              <div className="text-xs text-gray-400">{spread.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">{t("your_question")}</label>
                  <Textarea
                    placeholder={t("question_placeholder")}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={4}
                    className="bg-black/30 border-gray-700 text-gray-200 placeholder-gray-500 hover:border-purple-500 transition-colors"
                  />
                </div>

                <Button 
                  onClick={performReading} 
                  disabled={isReading || !selectedSpread || !question.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 glow-purple hover:glow-pink transition-all duration-300"
                  size="lg"
                >
                  {isReading ? (
                    <>
                      <RiRefreshLine className="mr-2 animate-spin" />
                      {t("reading_cards")}
                    </>
                  ) : (
                    <>
                      <RiMagicLine className="mr-2" />
                      {t("begin_reading")}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Reading Summary */}
              <Card className="bg-black/40 border-gray-800 backdrop-blur-sm card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <RiHeartLine className="text-pink-400 glow-pink" />
                    {t("your_reading")}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {t("question")}: "{reading.question}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 border-purple-700 glow-purple">
                      {reading.deck_type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="bg-pink-900/50 text-pink-200 border-pink-700 glow-pink">
                      {reading.spread_type.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Cards Display */}
              <div className={`relative grid gap-6 ${
                reading.spread_type === "celtic_cross"
                  ? "grid-cols-5 grid-rows-3" 
                  : reading.spread_type === "two_paths"
                  ? "grid-cols-2 grid-rows-3"
                  : reading.spread_type === "love_relationship" || reading.spread_type === "career_path" || reading.spread_type === "money_flow"
                  ? "grid-cols-2 grid-rows-3"
                  : reading.spread_type === "healing" || reading.spread_type === "seasonal_forecast"
                  ? "grid-cols-2 grid-rows-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}>
                {/* 特殊背景装饰 */}
                {reading.spread_type === "celtic_cross" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-purple-500/30 rounded-full opacity-40 glow-purple"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-400/20 rounded-full opacity-30"></div>
                  </div>
                )}
                {reading.cards_drawn.map((card, index) => {
                  const layout = getSpreadLayout(reading.spread_type, index);
                  return (
                    <motion.div
                      key={index}
                      className={layout.className}
                      style={layout.style}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: index * 0.3,
                        duration: 0.6,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <Card className={`h-full bg-black/50 border-gray-700 backdrop-blur-sm card-hover ${revealedCards.includes(index) ? 'ring-2 ring-purple-500/50 glow-purple' : ''}`}>
                        <CardContent className="p-6">
                          {!revealedCards.includes(index) ? (
                            <div className="text-center space-y-4">
                              <div className="w-32 h-48 mx-auto bg-gradient-to-br from-black via-purple-900 to-black rounded-lg flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow">
                                <RiEyeLine className="text-purple-400 text-2xl" />
                              </div>
                              <Button 
                                onClick={() => revealCard(index)}
                                variant="outline"
                                size="sm"
                                className="border-purple-600 text-purple-300 hover:bg-purple-900/50 hover:border-purple-400 transition-colors"
                              >
                                {t("reveal_card")}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="text-center">
                                {/* 塔罗牌图像显示 */}
                                {(() => {
                                  const localImagePath = getLocalCardImage(card.card_name);
                                  
                                  return (
                                    <div className="relative">
                                        <div className={`w-48 h-72 mx-auto rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-shadow overflow-hidden ${card.is_reversed ? 'rotate-180' : ''}`}>
                                        {localImagePath ? (
                                          <img 
                                            src={localImagePath} 
                                            alt={card.card_name}
                                            className="w-full h-full object-cover bg-gradient-to-br from-black via-gray-900 to-black"
                                            onError={(e) => {
                                              // 如果图像加载失败，显示文字
                                              e.currentTarget.style.display = 'none';
                                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                              if (fallback) fallback.style.display = 'flex';
                                            }}
                                          />
                                        ) : null}
                                        
                                        {/* 备用显示：文字 */}
                                        <div 
                                          className={`w-full h-full bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center ${localImagePath ? 'hidden' : 'flex'}`}
                                        >
                                          <span className="text-purple-200 font-bold text-lg text-center px-4">
                                              {card.card_name}
                                            </span>
                                        </div>
                                      </div>
                                      
                                      {/* 卡牌名称标签 - 总是显示在下方 */}
                                      <div className="mt-3 text-center space-y-2">
                                        <div className="text-purple-200 font-semibold text-lg">
                                          {t(`card_names.${card.card_name}`) || card.card_name}
                                        </div>
                                      <Badge 
                                        variant={card.is_reversed ? "destructive" : "default"} 
                                          className={`${card.is_reversed ? "bg-red-900/50 text-red-200 border-red-700 glow-pink" : "bg-green-900/50 text-green-200 border-green-700 glow"}`}
                                      >
                                        {card.is_reversed ? t("reversed") : t("upright")}
                                      </Badge>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-semibold text-purple-200">{t(`card_names.${card.card_name}`) || card.card_name}</h4>
                                {card.suit && (
                                  <p className="text-sm text-gray-400">
                                    {card.arcana_type === "major" ? t("major_arcana") : `${card.suit} ${t("suit")}`}
                                  </p>
                                )}
                                <p className="text-sm text-gray-300">
                                  {card.is_reversed ? card.reversed_meaning : card.upright_meaning}
                                </p>
                                {card.keywords && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {JSON.parse(card.keywords).map((keyword: string, i: number) => (
                                      <Badge key={i} variant="outline" className="text-xs border-purple-500/50 text-purple-200 glow">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Interpretation */}
                              <Card className="bg-black/40 border-gray-800 backdrop-blur-sm card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <RiMagicLine className="text-purple-400 glow-purple" />
                    {t("interpretation")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <Typewriter 
                      text={reading.interpretation || t("no_interpretation")}
                      speed={20}
                      delay={300}
                      className="text-gray-300 whitespace-pre-wrap"
                      showCursor={true}
                      pauseOnPunctuation={true}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* New Reading Button */}
              <div className="text-center">
                              <Button onClick={resetReading} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-purple-500 transition-colors">
                {t("new_reading")}
              </Button>
              </div>
            </div>
          )}
      
      <AnimationToast
        content={animationToast.content}
        isVisible={animationToast.isVisible}
        onClose={() => setAnimationToast({ content: "", isVisible: false })}
      />
        </div>
      </div>
    </div>
  );
} 

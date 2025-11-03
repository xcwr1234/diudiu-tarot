"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiChat3Line } from "react-icons/ri";
import { useTranslations, useLocale } from "next-intl";
import TarotChat from "@/components/blocks/tarot-chat";

export default function TarotModeSelector() {
  const t = useTranslations("tarot");
  const locale = useLocale();
  const [startReading, setStartReading] = useState(false);

  if (startReading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* 返回按钮 */}
            <Button
              variant="ghost"
              onClick={() => setStartReading(false)}
              className="mb-4 text-gray-300 hover:text-purple-300"
            >
              ← {locale === "zh" ? "返回" : "Back"}
            </Button>

            {/* 渲染对话式占卜 */}
            <TarotChat />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-purple-200 to-gray-300 drop-shadow-2xl text-blend relative">
              {locale === "zh" ? "丢丢塔罗占卜" : "DiuDiu Tarot Reading"}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {locale === "zh" 
                ? "系统分析 → 智能抽牌 → 自由对话解读" 
                : "System Analysis → Smart Draw → Free Chat Interpretation"
              }
            </p>
          </div>

          {/* 统一的占卜按钮 */}
          <div className="flex justify-center mb-8">
            <Card 
              className="bg-black/40 border-purple-700/50 backdrop-blur-sm cursor-pointer hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 card-hover group max-w-md w-full"
              onClick={() => setStartReading(true)}
            >
              <CardHeader>
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform glow-purple">
                  <RiChat3Line className="text-white text-4xl" />
                </div>
                <CardTitle className="text-center text-purple-300 text-3xl">
                  {locale === "zh" ? "开始占卜" : "Start Reading"}
                </CardTitle>
                <CardDescription className="text-center text-gray-400 text-lg">
                  {locale === "zh" 
                    ? "丢丢会为你分析问题、抽取塔罗牌，然后与你深度对话解读" 
                    : "Diudiu will analyze your question, draw tarot cards, and chat with you for deep interpretation"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                  >
                    {locale === "zh" ? "立即开始" : "Start Now"}
                  </Button>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {locale === "zh" 
                    ? "✨ 智能推荐最适合的牌组与牌阵" 
                    : "✨ Smart recommendation for the best deck and spread"
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 底部统计 */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-300">10,000+</div>
              <div className="text-sm text-gray-400">
                {locale === "zh" ? "灵魂指引" : "Souls Guided"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-300">78</div>
              <div className="text-sm text-gray-400">
                {locale === "zh" ? "神圣卡牌" : "Sacred Cards"}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-purple-300">4</div>
              <div className="text-sm text-gray-400">
                {locale === "zh" ? "神秘传承" : "Esoteric Traditions"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


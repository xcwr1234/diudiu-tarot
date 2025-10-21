"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiChat3Line, RiFlashlightLine, RiMagicLine } from "react-icons/ri";
import { useTranslations, useLocale } from "next-intl";
import TarotChat from "@/components/blocks/tarot-chat";
import TarotReading from "@/components/blocks/tarot";

export default function TarotModeSelector() {
  const t = useTranslations("tarot");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [selectedMode, setSelectedMode] = useState<"chat" | "quick" | null>(null);

  // 检查URL参数，自动选择模式
  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "chat") {
      setSelectedMode("chat");
    } else if (mode === "quick") {
      setSelectedMode("quick");
    }
  }, [searchParams]);

  if (selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* 返回按钮 */}
            <Button
              variant="ghost"
              onClick={() => setSelectedMode(null)}
              className="mb-4 text-gray-300 hover:text-purple-300"
            >
              ← {locale === "zh" ? "返回选择模式" : "Back to Mode Selection"}
            </Button>

            {/* 渲染选中的模式 */}
            {selectedMode === "chat" ? <TarotChat /> : <TarotReading />}
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
              {locale === "zh" ? "✨ 塔罗占卜 ✨" : "✨ Tarot Reading ✨"}
            </h1>
            <p className="text-xl text-gray-300">
              {locale === "zh" 
                ? "选择你的占卜体验方式" 
                : "Choose Your Reading Experience"
              }
            </p>
          </div>

          {/* 模式选择卡片 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* 对话式占卜 */}
            <Card 
              className="bg-black/40 border-purple-700/50 backdrop-blur-sm cursor-pointer hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 card-hover group"
              onClick={() => setSelectedMode("chat")}
            >
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform glow-purple">
                  <RiChat3Line className="text-white text-3xl" />
                </div>
                <CardTitle className="text-center text-purple-300 text-2xl">
                  {locale === "zh" ? "对话式占卜" : "Conversational Reading"}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {locale === "zh" 
                    ? "像真正的塔罗师咨询一样" 
                    : "Like a real tarot consultation"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {locale === "zh"
                    ? "与月影塔罗师进行一对一的深度对话。通过自然的交流，我会倾听你的困惑，理解你的需求，并为你提供个性化的指引。"
                    : "Have a one-on-one deep conversation with Moon Shadow. Through natural dialogue, I will listen to your concerns, understand your needs, and provide personalized guidance."
                  }
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-purple-300">
                    {locale === "zh" ? "特色：" : "Features:"}
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      {locale === "zh" ? "温暖的对话体验" : "Warm conversational experience"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      {locale === "zh" ? "深度问题挖掘" : "Deep question exploration"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      {locale === "zh" ? "智能牌阵推荐" : "Smart spread recommendations"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      {locale === "zh" ? "逐步揭示解读" : "Progressive card revelation"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">✓</span>
                      {locale === "zh" ? "个性化情感支持" : "Personalized emotional support"}
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white glow-purple"
                    size="lg"
                  >
                    {locale === "zh" ? "开始对话占卜" : "Start Conversation"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 快速占卜 */}
            <Card 
              className="bg-black/40 border-blue-700/50 backdrop-blur-sm cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 card-hover group"
              onClick={() => setSelectedMode("quick")}
            >
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform glow">
                  <RiFlashlightLine className="text-white text-3xl" />
                </div>
                <CardTitle className="text-center text-blue-300 text-2xl">
                  {locale === "zh" ? "快速占卜" : "Quick Reading"}
                </CardTitle>
                <CardDescription className="text-center text-gray-400">
                  {locale === "zh" 
                    ? "直接进入占卜流程" 
                    : "Direct reading process"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {locale === "zh"
                    ? "如果你已经明确知道自己的问题和需要的占卜方式，可以选择快速模式，直接填写信息开始占卜。"
                    : "If you already know your question and the type of reading you need, choose quick mode to start immediately."
                  }
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-blue-300">
                    {locale === "zh" ? "特色：" : "Features:"}
                  </h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      {locale === "zh" ? "节省时间" : "Time-saving"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      {locale === "zh" ? "自主选择牌组" : "Choose your own deck"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      {locale === "zh" ? "自主选择牌阵" : "Choose your own spread"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      {locale === "zh" ? "即时查看结果" : "Instant results"}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      {locale === "zh" ? "适合有经验者" : "Great for experienced users"}
                    </li>
                  </ul>
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white glow"
                    size="lg"
                  >
                    {locale === "zh" ? "快速开始" : "Quick Start"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 底部提示 */}
          <div className="text-center">
            <Card className="bg-black/30 border-gray-800 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 glow-purple">
                    <RiMagicLine className="text-white text-xl" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      {locale === "zh" ? "💡 不知道选哪个？" : "💡 Not sure which to choose?"}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {locale === "zh"
                        ? "如果你是第一次使用塔罗占卜，或者想要更深入的咨询体验，我推荐选择「对话式占卜」。它会像真正的塔罗师一样，耐心倾听你的故事，理解你的需求，并为你提供最合适的指引。"
                        : "If this is your first time with tarot or you want a more in-depth consultation, I recommend 'Conversational Reading'. It will listen to your story patiently like a real tarot reader, understand your needs, and provide the most suitable guidance."
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


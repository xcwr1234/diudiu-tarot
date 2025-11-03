"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { RiSendPlaneFill, RiMagicLine, RiUserLine, RiRefreshLine } from "react-icons/ri";
import { useTranslations, useLocale } from "next-intl";
import Typewriter from "@/components/ui/typewriter";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    phase?: string;
    cardRevealed?: TarotCard;
    suggestedDeck?: string;
    suggestedSpread?: string;
  };
}

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

interface ConversationState {
  phase: "welcome" | "exploration" | "confirmation" | "reading" | "interpretation" | "conclusion";
  userQuestion?: string;
  suggestedDeck?: string;
  suggestedSpread?: string;
  confirmedDeck?: string;
  confirmedSpread?: string;
  cardsDrawn?: TarotCard[];
  currentCardIndex?: number;
  readingUuid?: string;
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

export default function TarotChat() {
  const t = useTranslations("tarot");
  const locale = useLocale();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    phase: "welcome"
  });
  const [revealedCards, setRevealedCards] = useState<TarotCard[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome-1",
      role: "assistant",
      content: locale === "zh" 
        ? "🐕 汪汪！你好，亲爱的朋友。我是丢丢，一只温暖可爱的小狗塔罗师！\n\n欢迎来到这个神圣的空间。我能感受到你带着某种心境来到这里，也许是寻求指引，也许是面临选择，也许只是想倾听内心的声音。\n\n无论是什么，丢丢都在这里倾听。请告诉我，今天是什么带你来到我这里？你可以自由地分享你的感受、困惑或问题。"
        : "🐕 Woof woof! Hello, dear friend. I am Diudiu, a warm and cute puppy tarot reader!\n\nWelcome to this sacred space. I sense that you've come here with something on your mind—perhaps seeking guidance, facing a choice, or simply wanting to listen to your inner voice.\n\nWhatever it is, Diudiu is here to listen. Please tell me, what brings you here today? Feel free to share your feelings, confusion, or questions.",
      timestamp: new Date(),
      metadata: { phase: "welcome" }
    };
    setMessages([welcomeMessage]);
  }, [locale]);

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tarot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          conversationState,
          language: locale
        }),
      });

      const result = await response.json();

      if (result.code === 0) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: result.data.message,
          timestamp: new Date(),
          metadata: result.data.metadata
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // 更新对话状态
        if (result.data.newState) {
          setConversationState(result.data.newState);
          
          // 如果有新的牌被揭示，添加到已揭示列表
          if (result.data.metadata?.cardRevealed) {
            setRevealedCards(prev => [...prev, result.data.metadata.cardRevealed]);
          }
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: locale === "zh" 
          ? "抱歉，我遇到了一些技术问题。请稍后再试，或者刷新页面重新开始。"
          : "I apologize, I encountered a technical issue. Please try again later or refresh the page to start over.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 重新开始
  const resetConversation = () => {
    setMessages([]);
    setConversationState({ phase: "welcome" });
    setRevealedCards([]);
    // 触发欢迎消息
    window.location.reload();
  };

  // 处理回车键发送
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 获取阶段标签
  const getPhaseLabel = (phase: string) => {
    const phaseLabels: { [key: string]: { zh: string; en: string } } = {
      welcome: { zh: "欢迎", en: "Welcome" },
      exploration: { zh: "问题探索", en: "Exploration" },
      confirmation: { zh: "占卜确认", en: "Confirmation" },
      reading: { zh: "牌面揭示", en: "Reading" },
      interpretation: { zh: "综合解读", en: "Interpretation" },
      conclusion: { zh: "结束", en: "Conclusion" }
    };
    return locale === "zh" ? phaseLabels[phase]?.zh : phaseLabels[phase]?.en;
  };

  return (
    <div className="flex flex-col h-screen max-h-[800px] bg-gradient-to-br from-black via-gray-900 to-purple-950">
      {/* 顶部状态栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple">
            <RiMagicLine className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-purple-200">
              {locale === "zh" ? "丢丢" : "DiuDiu"}
            </h2>
            <p className="text-xs text-gray-400">
              {locale === "zh" ? "在线" : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className="bg-purple-900/30 text-purple-300 border-purple-700"
          >
            {getPhaseLabel(conversationState.phase)}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetConversation}
            className="text-gray-400 hover:text-purple-300"
          >
            <RiRefreshLine className="text-lg" />
          </Button>
        </div>
      </div>

      {/* 聊天区域 */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* 头像 */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-blue-600 to-cyan-600" 
                    : "bg-gradient-to-br from-yellow-400 to-orange-500"
                }`}>
                  {message.role === "user" ? (
                    <RiUserLine className="text-white text-sm" />
                  ) : (
                    <span className="text-sm">🐕</span>
                  )}
                </div>

                {/* 消息内容 */}
                <Card className={`${
                  message.role === "user"
                    ? "bg-blue-900/40 border-blue-700"
                    : "bg-black/40 border-gray-800"
                } backdrop-blur-sm`}>
                  <CardContent className="p-3">
                    {message.role === "assistant" ? (
                      <Typewriter 
                        text={message.content}
                        speed={25}
                        delay={150}
                        className="text-sm text-gray-200 whitespace-pre-wrap"
                        showCursor={true}
                        pauseOnPunctuation={true}
                      />
                    ) : (
                      <p className="text-sm text-gray-200 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    )}
                    
                    {/* 如果消息包含牌面信息，显示牌面 */}
                    {message.metadata?.cardRevealed && (
                      <div className="mt-3 p-3 bg-purple-900/20 rounded-lg border border-purple-700/30">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-24 bg-gradient-to-br from-black via-purple-900 to-black rounded flex items-center justify-center border border-purple-500/30 text-xs text-purple-200 text-center px-1 overflow-hidden">
                            {(() => {
                              const cardName = message.metadata.cardRevealed.card_name;
                              const localImagePath = getLocalCardImage(cardName);
                              return localImagePath ? (
                                <img 
                                  src={localImagePath} 
                                  alt={cardName}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                cardName
                              );
                            })()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-purple-200 text-sm">
                                {t(`card_names.${message.metadata.cardRevealed.card_name}`) || message.metadata.cardRevealed.card_name}
                              </h4>
                              <Badge 
                                variant={message.metadata.cardRevealed.is_reversed ? "destructive" : "default"}
                                className={`text-xs ${
                                  message.metadata.cardRevealed.is_reversed
                                    ? "bg-red-900/50 text-red-200"
                                    : "bg-green-900/50 text-green-200"
                                }`}
                              >
                                {message.metadata.cardRevealed.is_reversed 
                                  ? t("reversed")
                                  : t("upright")
                                }
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400">
                              {message.metadata.cardRevealed.is_reversed 
                                ? message.metadata.cardRevealed.reversed_meaning
                                : message.metadata.cardRevealed.upright_meaning
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* 加载中指示器 */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple">
                <RiMagicLine className="text-white text-sm" />
              </div>
              <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
                <CardContent className="p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 侧边栏：已揭示的牌 */}
      {revealedCards.length > 0 && (
        <div className="absolute right-4 top-20 w-48 p-3 bg-black/60 backdrop-blur-sm rounded-lg border border-gray-800">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">
            {locale === "zh" ? "已揭示的牌" : "Revealed Cards"}
          </h3>
          <div className="space-y-2">
            {revealedCards.map((card, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 p-2 bg-purple-900/20 rounded border border-purple-700/30"
              >
                <div className="w-8 h-12 bg-gradient-to-br from-black via-purple-900 to-black rounded flex items-center justify-center text-[8px] text-purple-200 text-center px-1">
                  {t(`card_names.${card.card_name}`) || card.card_name}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-purple-200 truncate">{t(`card_names.${card.card_name}`) || card.card_name}</p>
                  <p className="text-[10px] text-gray-400">
                    {card.is_reversed 
                      ? (locale === "zh" ? "逆位" : "Reversed")
                      : (locale === "zh" ? "正位" : "Upright")
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 输入区域 */}
      <div className="p-4 border-t border-gray-800 bg-black/40 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={locale === "zh" ? "分享你的想法..." : "Share your thoughts..."}
            disabled={isLoading}
            className="flex-1 bg-black/30 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-purple-500"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white glow-purple"
          >
            <RiSendPlaneFill className="text-lg" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {locale === "zh" 
            ? "按 Enter 发送，Shift + Enter 换行" 
            : "Press Enter to send, Shift + Enter for new line"
          }
        </p>
      </div>
    </div>
  );
}



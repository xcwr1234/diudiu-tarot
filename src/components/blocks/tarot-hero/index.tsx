"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { RiMagicLine, RiEyeLine, RiHeartLine, RiStackLine, RiKey2Line } from "react-icons/ri";
import { useTranslations } from "next-intl";

import { Hero } from "@/types/blocks/hero";

interface TarotHeroProps {
  hero: Hero;
}

export default function TarotHero({ hero }: TarotHeroProps) {
  const t = useTranslations("landing");

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      RiMagicLine,
      RiEyeLine,
      RiHeartLine,
      RiStackLine,
      RiKey2Line,
    };
    return icons[iconName] || RiMagicLine;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* 塔罗牌装饰元素 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-16 h-24 bg-gradient-to-b from-gold-400 to-gold-600 rounded-lg transform rotate-12 shadow-2xl"></div>
        <div className="absolute top-20 right-20 w-16 h-24 bg-gradient-to-b from-purple-400 to-purple-600 rounded-lg transform -rotate-12 shadow-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-24 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-lg transform rotate-6 shadow-2xl"></div>
        <div className="absolute bottom-10 right-1/4 w-16 h-24 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-lg transform -rotate-6 shadow-2xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        {/* 公告横幅 */}
        {hero.announcement && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              {hero.announcement.label}
            </Badge>
            <div className="text-lg font-medium text-purple-200">
              {hero.announcement.title}
            </div>
          </motion.div>
        )}

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-300 via-purple-200 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl text-blend relative"
        >
          {hero.title || "Tarot Wisdom"}
          {hero.highlight_text && (
            <span className="text-gold-400"> {hero.highlight_text}</span>
          )}
        </motion.h1>

        {/* 描述 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: hero.description || "" }}
        />

        {/* 提示信息 */}
        {hero.tip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Badge variant="outline" className="text-gold-400 border-gold-400">
              {hero.tip}
            </Badge>
          </motion.div>
        )}

        {/* 主占卜按钮 - 智能推荐 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.2
          }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              size="lg"
              className="relative group px-12 py-8 text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white border-0 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-colors duration-200"
              asChild
            >
              <a href="/smart-tarot">
                <span className="relative z-10 flex items-center gap-3">
                  <RiMagicLine className="h-8 w-8" />
                  智能占卜
                  <RiEyeLine className="h-8 w-8" />
                </span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-400/20 to-purple-400/20 blur-xl group-hover:blur-2xl transition-all duration-200"></div>
              </a>
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-sm text-purple-300"
          >
            🐕 丢丢为你推荐最适合的牌阵 ✨
          </motion.p>
        </motion.div>

        {/* 传统占卜按钮 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.4, 
            delay: 0.4
          }}
          className="mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="relative group px-8 py-4 text-lg font-medium border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black transition-colors duration-200"
              asChild
            >
              <a href="/tarot?mode=chat">
                <span className="relative z-10 flex items-center gap-2">
                  <RiHeartLine className="h-5 w-5" />
                  对话式占卜
                </span>
              </a>
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-xs text-gray-400"
          >
            与丢丢一对一深度交流
          </motion.p>
        </motion.div>

        {/* 按钮组 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          {hero.buttons?.map((button, index) => {
            const IconComponent = getIcon(button.icon || "RiMagicLine");
            return (
              <Button
                key={index}
                variant={button.variant as any}
                size="lg"
                className={`${
                  button.variant === "default"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                    : "border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black"
                } px-8 py-3 text-lg font-medium transition-all duration-300 transform hover:scale-105`}
                asChild
              >
                <a href={button.url || "#"} target={button.target || "_self"}>
                  <IconComponent className="mr-2 h-5 w-5" />
                  {button.title || "Button"}
                </a>
              </Button>
            );
          })}
        </motion.div>

        {/* 用户统计 */}
        {hero.show_happy_users && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400"
          >
            <div className="flex items-center gap-2">
              <RiHeartLine className="h-5 w-5 text-red-400" />
              <span className="text-lg">10,000+ Souls Guided</span>
            </div>
            <div className="flex items-center gap-2">
              <RiEyeLine className="h-5 w-5 text-blue-400" />
              <span className="text-lg">78 Sacred Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <RiMagicLine className="h-5 w-5 text-purple-400" />
              <span className="text-lg">4 Esoteric Traditions</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* 浮动塔罗牌 */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 right-10 w-20 h-28 bg-gradient-to-b from-gold-400 to-gold-600 rounded-lg shadow-2xl opacity-60"
      >
        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
          🜁
        </div>
      </motion.div>
    </section>
  );
} 
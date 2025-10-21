"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { RiMagicLine, RiEyeLine, RiHeartLine, RiStackLine, RiKey2Line } from "react-icons/ri";

import { Section } from "@/types/blocks/section";

interface TarotCTAProps {
  section: Section;
}

export default function TarotCTA({ section }: TarotCTAProps) {
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
    <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-black relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/imgs/masks/line.svg')] bg-no-repeat bg-cover opacity-5"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* 装饰性徽章 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 p-3 bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-full border border-gold-400/30">
              <RiMagicLine className="h-5 w-5 text-gold-400" />
              <Badge variant="outline" className="text-gold-400 border-gold-400">
                Begin Your Journey
              </Badge>
              <RiEyeLine className="h-5 w-5 text-gold-400" />
            </div>
          </motion.div>

          {/* 主标题 */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-300 via-purple-200 to-gray-300 bg-clip-text text-transparent drop-shadow-2xl text-blend relative"
          >
            {section.title}
          </motion.h2>

          {/* 描述 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-12 leading-relaxed"
          >
            {section.description}
          </motion.p>

          {/* 主占卜按钮 - 超大显眼 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: 0.2
            }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                size="lg"
                className="relative group px-16 py-8 text-3xl md:text-4xl font-bold bg-gradient-to-r from-gold-500 via-orange-500 to-gold-600 hover:from-gold-600 hover:via-orange-600 hover:to-gold-700 text-black border-0 rounded-2xl shadow-2xl hover:shadow-gold-500/50 transition-colors duration-200"
                asChild
              >
                <a href="/tarot?mode=chat">
                  <span className="relative z-10 flex items-center gap-4">
                    <RiMagicLine className="h-10 w-10" />
                    开始占卜
                    <RiEyeLine className="h-10 w-10" />
                  </span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-gold-200/20 blur-xl group-hover:blur-2xl transition-all duration-200"></div>
                </a>
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-6 text-base text-gold-300 font-medium"
            >
              🌟 立即体验神秘的塔罗智慧 🌟
            </motion.p>
          </motion.div>

          {/* 按钮组 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            {section.buttons?.map((button, index) => {
              const IconComponent = getIcon(button.icon || "RiMagicLine");
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={button.variant as any}
                    size="lg"
                    className={`${
                      button.variant === "default"
                        ? "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-bold"
                        : "border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-black"
                    } px-8 py-4 text-lg font-medium transition-all duration-300 shadow-2xl`}
                    asChild
                  >
                    <a href={button.url || "#"} target={button.target || "_self"}>
                      <IconComponent className="mr-2 h-5 w-5" />
                      {button.title || "Button"}
                    </a>
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* 神秘装饰卡片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <Card className="bg-gradient-to-br from-purple-800/30 to-indigo-800/30 border-purple-600/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiHeartLine className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sacred Connection</h3>
                <p className="text-gray-300 text-sm">Connect with your inner wisdom through ancient divination</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 border-indigo-600/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiEyeLine className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Mystic Vision</h3>
                <p className="text-gray-300 text-sm">See beyond the veil with four esoteric traditions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold-800/30 to-orange-800/30 border-gold-600/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RiKey2Line className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Hermetic Keys</h3>
                <p className="text-gray-300 text-sm">Unlock the secrets of the Tree of Life</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 底部装饰 */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-12 flex justify-center"
          >
            <div className="w-16 h-24 bg-gradient-to-b from-gold-400 to-gold-600 rounded-lg shadow-2xl opacity-60">
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                🜁
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 
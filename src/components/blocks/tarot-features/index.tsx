"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { RiMagicLine, RiEyeLine, RiHeartLine, RiStackLine, RiKey2Line, RiPaletteLine, RiBook2Line, RiNodeTree, RiTimeLine, RiExchangeLine, RiCharacterRecognitionLine } from "react-icons/ri";

import { Section } from "@/types/blocks/section";

interface TarotFeaturesProps {
  section: Section;
}

export default function TarotFeatures({ section }: TarotFeaturesProps) {
  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      RiMagicLine,
      RiEyeLine,
      RiHeartLine,
      RiStackLine,
      RiKey2Line,
      RiPaletteLine,
      RiBook2Line,
      RiNodeTree,
      RiTimeLine,
      RiExchangeLine,
      RiCharacterRecognitionLine,
    };
    return icons[iconName] || RiMagicLine;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-purple-900 via-indigo-900 to-black relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/imgs/masks/circle.svg')] bg-no-repeat bg-cover opacity-5"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          {section.name && (
            <Badge variant="outline" className="mb-4 text-gold-400 border-gold-400">
              {section.name}
            </Badge>
          )}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
            {section.title || "Arcanum Core Features"}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {section.description || "Professional tools for serious diviners and spiritual seekers"}
          </p>
        </motion.div>

        {/* 功能卡片网格 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {section.items?.map((item, index) => {
            const IconComponent = getIcon(item.icon || "RiMagicLine");
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 border-purple-600/30 backdrop-blur-sm hover:from-purple-700/60 hover:to-indigo-700/60 transition-all duration-300 transform hover:scale-105 group">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors duration-300">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-gray-300 leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 p-4 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full border border-purple-500/30">
            <RiMagicLine className="h-6 w-6 text-gold-400" />
            <span className="text-gold-300 font-medium">Unlock the Mysteries of the Arcana</span>
            <RiEyeLine className="h-6 w-6 text-gold-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
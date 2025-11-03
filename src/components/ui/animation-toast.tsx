"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";

interface AnimationToastProps {
  content: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function AnimationToast({ 
  content, 
  isVisible, 
  onClose, 
  duration = 8000 
}: AnimationToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 backdrop-blur-lg border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden">
            {/* 装饰性顶部条带 */}
            <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>
            
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* 图标 */}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-2xl flex-shrink-0"
                >
                  ✨
                </motion.div>
                
                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-purple-200 mb-2 text-sm">
                    神秘揭示
                  </h4>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {content}
                  </p>
                </div>
                
                {/* 关闭按钮 */}
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1 rounded hover:bg-white/10"
                >
                  <RiCloseLine className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* 底部装饰 */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}













"use client";

import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
  pauseOnPunctuation?: boolean;
}

export default function Typewriter({ 
  text, 
  speed = 30, 
  delay = 0, 
  onComplete,
  className = "",
  showCursor = true,
  pauseOnPunctuation = true
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;

    // 初始延迟
    const initialDelay = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(initialDelay);
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete();
      }
      return;
    }

    // 检查是否需要暂停（在标点符号后）
    const currentChar = text[currentIndex];
    const shouldPause = pauseOnPunctuation && 
      (currentChar === '.' || currentChar === '!' || currentChar === '?' || currentChar === '。' || currentChar === '！' || currentChar === '？');
    
    const pauseDuration = shouldPause ? speed * 8 : speed; // 标点符号后暂停更长时间

    const timer = setTimeout(() => {
      setDisplayedText(prev => prev + text[currentIndex]);
      setCurrentIndex(prev => prev + 1);
    }, pauseDuration);

    return () => clearTimeout(timer);
  }, [currentIndex, isTyping, text, speed, onComplete, pauseOnPunctuation]);

  // 重置状态当text改变时
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsTyping(false);
  }, [text]);

  return (
    <div className={className}>
      <span>{displayedText}</span>
      {showCursor && isTyping && currentIndex < text.length && (
        <span className="inline-block w-2 h-4 bg-purple-400 ml-1 animate-pulse align-middle"></span>
      )}
    </div>
  );
}

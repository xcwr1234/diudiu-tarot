"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 触发彩带效果
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 p-4">
      <div className="max-w-md w-full">
        <div
          className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-purple-200 dark:border-purple-800 transition-all duration-1000 ${
            mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* 成功图标 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <CheckCircle2 className="w-24 h-24 text-green-500 opacity-20" />
              </div>
              <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10" />
              <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
              <Star className="w-6 h-6 text-purple-500 absolute -bottom-1 -left-1 animate-pulse" />
            </div>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            支付成功！
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
            感谢您的购买，您的订单已成功处理
          </p>

          {/* 信息卡片 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 mb-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">积分已充值</span>
              <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                ✨ 立即可用
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">订单状态</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                已完成
              </span>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              📧 我们已向您的邮箱发送了订单确认邮件
            </p>
          </div>

          {/* 按钮组 */}
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg"
              onClick={() => router.push("/")}
            >
              开始使用塔罗占卜
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              onClick={() => router.push("/dashboard")}
            >
              查看我的订单
            </Button>
          </div>

          {/* 底部装饰 */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-center text-xs text-gray-500 dark:text-gray-500">
              如有任何问题，请联系客服支持
            </p>
          </div>
        </div>

        {/* 浮动装饰元素 */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">
          🔮
        </div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce delay-100">
          ✨
        </div>
      </div>
    </div>
  );
} 
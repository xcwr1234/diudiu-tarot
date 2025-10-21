import { useTranslations } from "next-intl";
import { RiHeartLine, RiStarLine, RiSparklingLine, RiEyeLine, RiMoonLine, RiSunLine } from "react-icons/ri";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return {
    title: locale === "zh" ? "关于丢丢 - 丢丢塔罗" : "About DiuDiu - DiuDiu Tarot",
    description: locale === "zh" 
      ? "了解丢丢塔罗的故事，探索神秘学世界的智慧传承" 
      : "Learn about DiuDiu Tarot's story and explore the wisdom of the mystical world",
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = useTranslations("about");

  const features = [
    {
      icon: RiHeartLine,
      title: locale === "zh" ? "用心服务" : "Heartfelt Service",
      description: locale === "zh" 
        ? "每一个占卜都倾注了我们的真诚与专业，为您提供最贴心的塔罗解读服务。" 
        : "Every reading is infused with our sincerity and professionalism, providing you with the most caring tarot interpretation service.",
    },
    {
      icon: RiStarLine,
      title: locale === "zh" ? "专业传承" : "Professional Heritage",
      description: locale === "zh" 
        ? "融合马赛、维特、透特、黄金黎明四大塔罗传统，为您呈现最权威的塔罗智慧。" 
        : "Blending the four major tarot traditions of Marseille, Waite, Thoth, and Golden Dawn to present you with the most authoritative tarot wisdom.",
    },
    {
      icon: RiSparklingLine,
      title: locale === "zh" ? "创新体验" : "Innovative Experience",
      description: locale === "zh" 
        ? "结合现代科技与传统智慧，为您打造独一无二的数字塔罗体验。" 
        : "Combining modern technology with traditional wisdom to create a unique digital tarot experience for you.",
    },
    {
      icon: RiEyeLine,
      title: locale === "zh" ? "深度洞察" : "Deep Insight",
      description: locale === "zh" 
        ? "不只是简单的牌面解读，更是对您内心世界的深度探索与指引。" 
        : "Not just simple card interpretation, but deep exploration and guidance into your inner world.",
    },
  ];

  const values = [
    {
      icon: RiMoonLine,
      title: locale === "zh" ? "神秘与智慧" : "Mystery & Wisdom",
      description: locale === "zh" 
        ? "我们相信塔罗牌是连接宇宙智慧的桥梁，每一张牌都蕴含着深刻的宇宙真理。" 
        : "We believe that tarot cards are a bridge connecting cosmic wisdom, with each card containing profound cosmic truths.",
    },
    {
      icon: RiSunLine,
      title: locale === "zh" ? "成长与启发" : "Growth & Inspiration",
      description: locale === "zh" 
        ? "塔罗占卜的目的不是预测未来，而是帮助您更好地认识自己，获得内在的成长与启发。" 
        : "The purpose of tarot divination is not to predict the future, but to help you better understand yourself and gain inner growth and inspiration.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-purple-200 to-gray-300 drop-shadow-2xl">
              {locale === "zh" ? "关于丢丢塔罗" : "About DiuDiu Tarot"}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {locale === "zh" 
                ? "探索神秘学世界的智慧传承，体验数字时代的塔罗占卜艺术" 
                : "Explore the wisdom heritage of the mystical world and experience the art of tarot divination in the digital age"
              }
            </p>
          </div>

          {/* 品牌故事 */}
          <div className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  {locale === "zh" ? "我们的故事" : "Our Story"}
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    {locale === "zh" 
                      ? "丢丢塔罗诞生于对神秘学世界的深深热爱。我们相信，每一张塔罗牌都承载着古老的智慧，每一次占卜都是与宇宙对话的机会。在这个快节奏的现代社会中，我们希望为人们提供一个宁静的心灵港湾，通过塔罗牌的指引，帮助大家找到内心的答案。" 
                      : "DiuDiu Tarot was born from a deep love for the mystical world. We believe that every tarot card carries ancient wisdom, and every divination is an opportunity to dialogue with the universe. In this fast-paced modern society, we hope to provide people with a peaceful spiritual harbor, helping everyone find inner answers through the guidance of tarot cards."
                    }
                  </p>
                  <p>
                    {locale === "zh" 
                      ? "我们致力于融合传统塔罗智慧与现代科技，为您打造最专业、最贴心的数字塔罗体验。无论您是塔罗新手还是资深爱好者，都能在这里找到属于您的神秘之旅。" 
                      : "We are committed to combining traditional tarot wisdom with modern technology to create the most professional and caring digital tarot experience for you. Whether you are a tarot beginner or a seasoned enthusiast, you can find your own mystical journey here."
                    }
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-80 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-2xl flex items-center justify-center border border-purple-500/20">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <RiSparklingLine className="text-3xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-purple-300 mb-2">
                      {locale === "zh" ? "丢丢塔罗" : "DiuDiu Tarot"}
                    </h3>
                    <p className="text-gray-400">
                      {locale === "zh" ? "数字时代的塔罗智慧" : "Tarot Wisdom in the Digital Age"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 我们的特色 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-300">
              {locale === "zh" ? "我们的特色" : "Our Features"}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center p-6 bg-black/40 border border-gray-800 rounded-xl backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <IconComponent className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 我们的理念 */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-300">
              {locale === "zh" ? "我们的理念" : "Our Philosophy"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div key={index} className="p-8 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-purple-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 联系信息 */}
          <div className="text-center bg-black/40 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-6 text-purple-300">
              {locale === "zh" ? "联系我们" : "Contact Us"}
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {locale === "zh" 
                ? "如果您有任何问题或建议，或者想要了解更多关于塔罗占卜的信息，我们随时为您服务。让我们一起探索神秘学世界的奥秘。" 
                : "If you have any questions or suggestions, or want to learn more about tarot divination, we are always here to serve you. Let's explore the mysteries of the mystical world together."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
                {locale === "zh" ? "开始占卜" : "Start Reading"}
              </button>
              <button className="px-8 py-3 border border-purple-500 text-purple-300 rounded-lg font-semibold hover:bg-purple-500/10 transition-all duration-300">
                {locale === "zh" ? "了解更多" : "Learn More"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






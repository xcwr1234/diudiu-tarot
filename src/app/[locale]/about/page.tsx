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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 关于丢丢塔罗 */}
          <div className="mb-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-purple-200 to-gray-300 drop-shadow-2xl">
                {locale === "zh" ? "关于丢丢塔罗" : "About DiuDiu Tarot"}
              </h1>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                {locale === "zh" 
                  ? "丢丢是我家的小狗。她乖得让人心疼，我一直觉得，她是世界上最好、最可爱的小狗。每当我情绪低落时，她总会静静地待在我身边，用那双亮晶晶的眼睛看着我，给我最温柔的安慰。无论心情多糟，只要看到她毛茸茸的小身影，心里就会变得暖洋洋的。她不仅是我的宠物，更像是我永远思念的小妹妹。" 
                  : "DiuDiu is my little dog at home. She's so well-behaved it breaks my heart. I've always believed she's the best and most adorable dog in the world. Whenever I'm feeling down, she always quietly stays by my side, looking at me with those bright, sparkling eyes, giving me the gentlest comfort. No matter how bad my mood, just seeing her fluffy little figure makes my heart warm. She's not just my pet, but more like my little sister whom I'll always miss."
                }
              </p>
              <p>
                {locale === "zh" 
                  ? "至于塔罗牌，我也很喜欢。偶尔帮朋友占一占，感觉自己特别有成就感。但在我看来，塔罗牌最重要的意义并不是「预知结果」，而是在抽牌与解读的过程中，让人重新感受到对生活的掌控感与方向感。" 
                  : "As for tarot cards, I also really like them. Occasionally helping friends with readings makes me feel especially accomplished. But in my view, the most important meaning of tarot cards is not 'predicting the future,' but rather, in the process of drawing and interpreting cards, allowing people to regain a sense of control and direction in their lives."
                }
              </p>
              <p>
                {locale === "zh" 
                  ? "今年我刚满20岁。时间流淌，我在成长的同时，也常被生活中的小困惑包围。做这个网站，是希望大家能进来坐坐。如果能从这里带走一点温暖或启发，那再好不过。如果什么都不带走，那就让丢丢陪你待一会儿吧——那也是一种幸福。" 
                  : "I just turned 20 this year. Time flows by, and as I grow, I'm often surrounded by small confusions in life. I created this website hoping everyone can come in and sit a while. If you can take away some warmth or inspiration from here, that would be wonderful. If you don't take away anything, then let DiuDiu spend some time with you—that's also a kind of happiness."
                }
              </p>
              <p className="text-purple-300 font-medium text-center pt-4">
                {locale === "zh" 
                  ? "愿我们都拥有继续生活的勇气。 🌿" 
                  : "May we all have the courage to continue living. 🌿"
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}












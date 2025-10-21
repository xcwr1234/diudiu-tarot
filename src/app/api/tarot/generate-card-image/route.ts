import { JSONValue, experimental_generateImage as generateImage } from "ai";
import { respData, respErr } from "@/lib/resp";
import type { ImageModelV1 } from "@ai-sdk/provider";
import { getUuid } from "@/lib/hash";
import { replicate } from "@ai-sdk/replicate";
import { openai } from "@ai-sdk/openai";
import { newStorage } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const { cardName, isReversed, deckType, language = 'zh' } = await req.json();
    
    if (!cardName) {
      return respErr("Card name is required");
    }

    console.log('生成塔罗牌图像请求:', { cardName, isReversed, deckType, language });

    // 检查是否有图像生成API密钥
    const replicateApiKey = process.env.REPLICATE_API_TOKEN;
    const klingAccessKey = process.env.KLING_ACCESS_KEY;
    const klingSecretKey = process.env.KLING_SECRET_KEY;
    
    if (!replicateApiKey && (!klingAccessKey || !klingSecretKey)) {
      console.log('没有图像生成API密钥，返回占位符图像');
      // 如果没有API密钥，返回一个占位符图像的base64
      return respData({
        imageBase64: generatePlaceholderImage(cardName, isReversed, deckType),
        filename: `placeholder_${cardName.replace(/\s+/g, '_')}_${isReversed ? 'reversed' : 'upright'}.png`,
        cardName,
        isReversed,
        deckType,
        prompt: "Placeholder image - No image generation API configured",
        isPlaceholder: true
      });
    }

    // 根据牌名和牌组类型生成详细的提示词
    const prompt = generateTarotCardPrompt(cardName, isReversed, deckType, language);
    
    console.log('生成塔罗牌图像提示词:', prompt);

    // 使用Replicate的Stable Diffusion模型
    const imageModel = replicate.image("stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf");
    
    const { images, warnings } = await generateImage({
      model: imageModel,
      prompt: prompt,
      n: 1,
      providerOptions: {
        replicate: {
          width: 512,
          height: 896, // 塔罗牌比例 (2:3.5)
          num_inference_steps: 50,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000),
        },
      },
    });

    if (warnings.length > 0) {
      console.log("生成图像警告:", warnings);
    }

    if (!images || images.length === 0) {
      return respErr("Failed to generate image");
    }

    // 保存图像到存储
    const storage = newStorage();
    const batch = getUuid();
    const filename = `tarot_${deckType}_${cardName.replace(/\s+/g, '_')}_${isReversed ? 'reversed' : 'upright'}_${batch}.png`;
    const key = `tarot-cards/${filename}`;
    
    const image = images[0];
    const body = Buffer.from(image.base64, "base64");

    try {
      const uploadResult = await storage.uploadFile({
        body,
        key,
        contentType: "image/png",
        disposition: "inline",
      });

      return respData({
        imageUrl: uploadResult.url,
        filename,
        cardName,
        isReversed,
        deckType,
        prompt
      });
    } catch (uploadErr) {
      console.log("上传图像失败:", uploadErr);
      // 如果上传失败，返回base64数据
      return respData({
        imageBase64: image.base64,
        filename,
        cardName,
        isReversed,
        deckType,
        prompt
      });
    }

  } catch (err) {
    console.log("生成塔罗牌图像失败:", err);
    // 如果生成失败，返回占位符
    const { cardName, isReversed, deckType } = await req.json().catch(() => ({ cardName: "Unknown", isReversed: false, deckType: "waite" }));
    return respData({
      imageBase64: generatePlaceholderImage(cardName, isReversed, deckType),
      filename: `placeholder_${cardName.replace(/\s+/g, '_')}_${isReversed ? 'reversed' : 'upright'}.png`,
      cardName,
      isReversed,
      deckType,
      prompt: "Placeholder image - Generation failed",
      isPlaceholder: true
    });
  }
}

// 生成占位符图像（精美的SVG转base64）
function generatePlaceholderImage(cardName: string, isReversed: boolean, deckType: string): string {
  // 根据卡片名称获取对应的符号
  const cardSymbol = getCardSymbol(cardName);
  
  const svg = `
    <svg width="512" height="896" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4c1d95;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#2d1b69;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e1b4b;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#f59e0b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0" />
        </radialGradient>
        <filter id="glow-effect">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="512" height="896" fill="url(#bg)" rx="20"/>
      
      <!-- 装饰性背景图案 -->
      <circle cx="100" cy="150" r="60" fill="url(#glow)" opacity="0.2"/>
      <circle cx="412" cy="200" r="80" fill="url(#glow)" opacity="0.15"/>
      <circle cx="80" cy="700" r="100" fill="url(#glow)" opacity="0.1"/>
      <circle cx="432" cy="750" r="70" fill="url(#glow)" opacity="0.2"/>
      
      <!-- 金色边框 -->
      <rect x="20" y="20" width="472" height="856" fill="none" stroke="url(#frame)" stroke-width="8" rx="15"/>
      <rect x="30" y="30" width="452" height="836" fill="none" stroke="url(#frame)" stroke-width="2" rx="10" opacity="0.5"/>
      
      <!-- 顶部装饰 -->
      <text x="256" y="80" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="20" font-weight="bold" filter="url(#glow-effect)">
        ${deckType.toUpperCase()}
      </text>
      
      <!-- 卡片标题 -->
      <text x="256" y="180" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="28" font-weight="bold" filter="url(#glow-effect)">
        ${cardName}
      </text>
      
      <!-- 主要符号 -->
      <text x="256" y="320" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="120" filter="url(#glow-effect)">
        ${cardSymbol}
      </text>
      
      <!-- 装饰性圆圈 -->
      <circle cx="256" cy="320" r="140" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.3"/>
      <circle cx="256" cy="320" r="100" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.2"/>
      <circle cx="256" cy="320" r="60" fill="none" stroke="#fbbf24" stroke-width="1" opacity="0.1"/>
      
      <!-- 正逆位指示 -->
      <rect x="156" y="420" width="200" height="40" rx="20" fill="${isReversed ? '#ef4444' : '#10b981'}" opacity="0.8"/>
      <text x="256" y="445" text-anchor="middle" fill="white" font-family="serif" font-size="16" font-weight="bold">
        ${isReversed ? 'REVERSED' : 'UPRIGHT'}
      </text>
      
      <!-- 底部装饰线条 -->
      <line x1="100" y1="550" x2="412" y2="550" stroke="url(#frame)" stroke-width="2" opacity="0.6"/>
      
      <!-- 底部装饰 -->
      <text x="256" y="600" text-anchor="middle" fill="#fbbf24" font-family="serif" font-size="18" font-weight="bold">
        🔮 DiuDiu Tarot 🔮
      </text>
      
      <!-- 角落装饰 -->
      <text x="60" y="60" fill="#fbbf24" font-family="serif" font-size="24" opacity="0.5">✦</text>
      <text x="452" y="60" fill="#fbbf24" font-family="serif" font-size="24" opacity="0.5">✦</text>
      <text x="60" y="836" fill="#fbbf24" font-family="serif" font-size="24" opacity="0.5">✦</text>
      <text x="452" y="836" fill="#fbbf24" font-family="serif" font-size="24" opacity="0.5">✦</text>
    </svg>
  `;
  
  // 将SVG转换为base64
  const base64 = Buffer.from(svg).toString('base64');
  return base64;
}

// 获取卡片对应的符号
function getCardSymbol(cardName: string): string {
  const symbols: { [key: string]: string } = {
    "The Fool": "🃏",
    "The Magician": "🎩",
    "The High Priestess": "🌙",
    "The Empress": "👑",
    "The Emperor": "⚔️",
    "The Hierophant": "⛪",
    "The Lovers": "💕",
    "The Chariot": "🏛️",
    "Strength": "🦁",
    "The Hermit": "🔮",
    "Wheel of Fortune": "🎡",
    "Justice": "⚖️",
    "The Hanged Man": "🪝",
    "Death": "💀",
    "Temperance": "🍶",
    "The Devil": "😈",
    "The Tower": "🗼",
    "The Star": "⭐",
    "The Moon": "🌕",
    "The Sun": "☀️",
    "Judgement": "📯",
    "The World": "🌍"
  };
  
  return symbols[cardName] || "🔮";
}

// 生成塔罗牌图像的提示词
function generateTarotCardPrompt(
  cardName: string, 
  isReversed: boolean, 
  deckType: string, 
  language: string
): string {
  const isEnglish = language === 'en';
  
  // 基础塔罗牌风格描述
  const baseStyle = isEnglish 
    ? "mystical tarot card art, intricate details, golden borders, vintage mystical atmosphere, high quality, detailed illustration"
    : "神秘塔罗牌艺术，复杂细节，金色边框，复古神秘氛围，高质量，详细插图";
  
  // 牌组特定的风格描述
  const deckStyles = {
    marseille: isEnglish 
      ? "Marseille tarot style, traditional French design, simple but elegant symbols, muted colors, classical composition"
      : "马赛塔罗风格，传统法式设计，简洁优雅的符号，柔和色彩，古典构图",
    waite: isEnglish
      ? "Rider-Waite tarot style, detailed symbolic imagery, rich colors, Arthurian and mystical symbolism, Pamela Colman Smith inspired"
      : "维特塔罗风格，详细象征意象，丰富色彩，亚瑟王和神秘象征，帕梅拉·科尔曼·史密斯风格",
    thoth: isEnglish
      ? "Thoth tarot style, Aleister Crowley inspired, Egyptian and occult symbolism, vibrant colors, complex mystical imagery"
      : "透特塔罗风格，克劳利风格，埃及和神秘象征，鲜艳色彩，复杂神秘意象",
    golden_dawn: isEnglish
      ? "Golden Dawn tarot style, hermetic symbolism, alchemical imagery, esoteric design, mystical and occult themes"
      : "黄金黎明塔罗风格，赫尔墨斯象征，炼金术意象，神秘设计，神秘和玄学主题"
  };
  
  // 正逆位描述
  const positionDesc = isReversed 
    ? (isEnglish ? "reversed position, upside down, inverted energy" : "逆位，倒置，反转的能量")
    : (isEnglish ? "upright position, normal orientation" : "正位，正常方向");
  
  // 根据牌名生成具体描述
  const cardDescriptions = generateCardSpecificDescription(cardName, isEnglish);
  
  return `${cardDescriptions}, ${deckStyles[deckType as keyof typeof deckStyles] || deckStyles.waite}, ${baseStyle}, ${positionDesc}, tarot card format, vertical composition, mystical lighting, ornate frame`;
}

// 为特定塔罗牌生成描述
function generateCardSpecificDescription(cardName: string, isEnglish: boolean): string {
  const cardDescriptions: { [key: string]: { en: string; zh: string } } = {
    "The Fool": {
      en: "A young figure with a white rose in hand, walking towards a cliff edge, with a small dog at their feet, bright and optimistic atmosphere, new beginnings",
      zh: "一个年轻人物手持白玫瑰，走向悬崖边缘，脚下有小狗，明亮乐观的氛围，新的开始"
    },
    "The Magician": {
      en: "A figure in red robes standing at an altar, with tools of the four suits, pointing upward with one hand and downward with the other, surrounded by flowers and symbols",
      zh: "红色长袍人物站在祭坛前，拥有四套牌组的工具，一手向上指一手向下指，周围有花朵和符号"
    },
    "The High Priestess": {
      en: "A seated woman in blue robes between two pillars, one black one white, holding a scroll, with a crescent moon at her feet, mystical and intuitive",
      zh: "蓝袍女子坐在黑白两根柱子之间，手持卷轴，脚下有新月，神秘而直觉"
    },
    "The Empress": {
      en: "A crowned woman in flowing robes seated in a lush garden, surrounded by wheat and flowers, with a heart-shaped shield, fertility and abundance",
      zh: "戴冠女子穿着飘逸长袍坐在茂盛花园中，周围有小麦和花朵，有心形盾牌，丰盛和富饶"
    },
    "The Emperor": {
      en: "A bearded king in red robes on a stone throne, holding an ankh scepter, with rams' heads on his throne, authority and structure",
      zh: "红袍胡须国王坐在石制宝座上，手持十字架权杖，宝座上有公羊头，权威和结构"
    },
    "The Hierophant": {
      en: "A religious figure in red robes between two kneeling figures, holding a triple cross scepter, with two keys at his feet, tradition and spiritual guidance",
      zh: "红袍宗教人物在两个跪拜人物之间，手持三重十字架权杖，脚下有两把钥匙，传统和精神指引"
    },
    "The Lovers": {
      en: "A man and woman standing nude in a garden, with an angel above them, a tree with flames and a tree with fruit, choice and harmony",
      zh: "男女在花园中裸体站立，上方有天使，一棵火焰树和一棵果实树，选择和和谐"
    },
    "The Chariot": {
      en: "A crowned figure in armor in a chariot pulled by two sphinxes, one black one white, holding no reins, determination and willpower",
      zh: "戴冠人物穿着盔甲在战车中，由两个狮身人面像拉动，一黑一白，没有缰绳，决心和意志力"
    },
    "Strength": {
      en: "A woman gently closing a lion's mouth with her hands, wearing a white dress with flowers, surrounded by mountains, inner strength and courage",
      zh: "女子用手轻柔地合上狮子的嘴巴，穿着白色花朵连衣裙，周围有山脉，内在力量和勇气"
    },
    "The Hermit": {
      en: "A hooded figure holding a lantern with a six-pointed star, standing on a mountain peak, in dark robes, seeking inner wisdom and guidance",
      zh: "戴帽人物手持有六角星的灯笼，站在山峰上，穿着深色长袍，寻求内在智慧和指引"
    },
    "Wheel of Fortune": {
      en: "A large wheel with various creatures and symbols, an angel, eagle, bull, and lion, with Hebrew letters, fate and cycles",
      zh: "大轮子上有各种生物和符号，天使、鹰、公牛和狮子，有希伯来字母，命运和循环"
    },
    "Justice": {
      en: "A crowned figure in red robes holding scales in one hand and an upright sword in the other, seated on a stone throne, balance and fairness",
      zh: "戴冠红袍人物一手持天平一手持直立宝剑，坐在石制宝座上，平衡和公正"
    },
    "The Hanged Man": {
      en: "A figure hanging upside down by one foot from a tree, with a serene expression, hands behind back, sacrifice and new perspective",
      zh: "人物倒挂在树上，表情安详，双手背后，牺牲和新视角"
    },
    "Death": {
      en: "A skeletal figure in black armor on a white horse, holding a black banner with a white rose, transformation and endings",
      zh: "黑甲骷髅人物骑在白马上，手持有白玫瑰的黑旗，转变和结束"
    },
    "Temperance": {
      en: "An angelic figure in robes pouring water between two cups, one foot on land one in water, with a crown of fire, balance and moderation",
      zh: "天使人物在长袍中在两个杯子间倒水，一脚在陆地一脚在水中，头戴火焰王冠，平衡和节制"
    },
    "The Devil": {
      en: "A horned figure with bat wings standing on a pedestal, two chained figures below, holding torches, temptation and bondage",
      zh: "有角有蝙蝠翅膀的人物站在基座上，下方有两个被链锁的人物，手持火炬，诱惑和束缚"
    },
    "The Tower": {
      en: "A tall tower being struck by lightning, with figures falling from it, flames and destruction, sudden change and revelation",
      zh: "高塔被闪电击中，有人物从中坠落，火焰和毁灭，突然的变化和启示"
    },
    "The Star": {
      en: "A nude woman kneeling by a pool, pouring water from two pitchers, with one large star and seven small stars above, hope and inspiration",
      zh: "裸体女子跪在池边，从两个罐子中倒水，上方有一颗大星和七颗小星，希望和灵感"
    },
    "The Moon": {
      en: "A full moon with a face, a crayfish emerging from water, a wolf and dog howling, a path leading to mountains, illusion and intuition",
      zh: "有脸孔的满月，小龙虾从水中出现，狼和狗嚎叫，通向山脉的小径，幻觉和直觉"
    },
    "The Sun": {
      en: "A large sun with a human face, a child on a white horse holding a red banner, sunflowers, joy and success",
      zh: "有人脸的太阳，孩子骑在白马上手持红旗，向日葵，快乐和成功"
    },
    "Judgement": {
      en: "An angel blowing a trumpet, figures rising from coffins with arms raised, mountains in background, resurrection and renewal",
      zh: "天使吹号角，人物从棺材中升起举臂，背景有山脉，复活和更新"
    },
    "The World": {
      en: "A nude woman dancing inside a laurel wreath, holding two wands, surrounded by the four living creatures, completion and success",
      zh: "裸体女子在月桂花环中舞蹈，手持两根权杖，周围有四个生物，完成和成功"
    }
  };

  const description = cardDescriptions[cardName];
  if (description) {
    return description[isEnglish ? 'en' : 'zh'];
  }
  
  // 如果没有找到具体描述，返回通用描述
  return isEnglish 
    ? `Mystical tarot card featuring ${cardName}, intricate symbolic imagery, rich colors and details`
    : `神秘塔罗牌，以${cardName}为主题，复杂的象征意象，丰富的色彩和细节`;
}
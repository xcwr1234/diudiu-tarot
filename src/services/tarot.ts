import { DeckType, SpreadType, TarotCard, TarotReading } from "@/types/tarot";
import { insertTarotReading, getRandomTarotCards } from "@/models/tarot";
import { getUuid } from "@/lib/hash";
import { getIsoTimestr } from "@/lib/time";
import { getUserUuid } from "./user";
import OpenAI from "openai";

export async function performTarotReading(
  deck_type: DeckType,
  spread_type: SpreadType,
  question: string,
  cardCount: number = 1
): Promise<TarotReading> {
  // For demo purposes, we'll use mock data instead of database
  const user_uuid = await getUserUuid();
  if (!user_uuid) {
    // Create a mock user UUID for demo
    const mockUserUuid = "demo-user-" + Date.now();
  }

  // Use provided card count or determine based on spread type
  let numberOfCards = cardCount;
  if (!cardCount || cardCount < 1) {
    // Fallback to default logic based on spread type
  switch (spread_type) {
      // 马赛塔罗
      case SpreadType.ThreeCardTime:
        numberOfCards = 3;
        break;
      case SpreadType.YesNo:
        numberOfCards = 1;
        break;
      case SpreadType.DecisionCross:
        numberOfCards = 5;
        break;
      case SpreadType.SevenDay:
        numberOfCards = 7;
        break;
      case SpreadType.RelationshipMirror:
        numberOfCards = 4;
        break;
      case SpreadType.ProblemSolving:
        numberOfCards = 4;
        break;
      case SpreadType.ElementalBalance:
        numberOfCards = 4;
        break;
      case SpreadType.MarseillePentacle:
        numberOfCards = 5;
        break;
      
      // 维特塔罗
      case SpreadType.CelticCross:
        numberOfCards = 10;
        break;
      case SpreadType.LoveRelationship:
        numberOfCards = 6;
        break;
      case SpreadType.CareerPath:
        numberOfCards = 5;
        break;
      case SpreadType.Healing:
        numberOfCards = 4;
        break;
      case SpreadType.SeasonalForecast:
        numberOfCards = 4;
        break;
      case SpreadType.TwoPaths:
        numberOfCards = 6;
        break;
      case SpreadType.DreamInterpretation:
        numberOfCards = 3;
        break;
      case SpreadType.MoneyFlow:
        numberOfCards = 5;
        break;
      
      // 透特塔罗
      case SpreadType.TreeOfLife:
        numberOfCards = 10;
        break;
      case SpreadType.Hexagram:
        numberOfCards = 7;
        break;
      case SpreadType.PlanetaryInfluence:
        numberOfCards = 7;
        break;
      case SpreadType.ElementalInvocation:
        numberOfCards = 5;
        break;
      case SpreadType.CrowleyTriad:
        numberOfCards = 3;
        break;
      case SpreadType.WheelOfAeon:
        numberOfCards = 12;
        break;
      case SpreadType.ThothCross:
        numberOfCards = 7;
        break;
      case SpreadType.SpiritualAwakening:
        numberOfCards = 5;
        break;
      
      // 黄金黎明塔罗
      case SpreadType.PentagramRitual:
        numberOfCards = 5;
        break;
      case SpreadType.PlanetaryDays:
        numberOfCards = 7;
        break;
      case SpreadType.HgaCommunication:
        numberOfCards = 8;
        break;
      case SpreadType.ThreePillars:
        numberOfCards = 9;
        break;
      case SpreadType.Pathworking:
        numberOfCards = 10;
        break;
      case SpreadType.ElementalEvocation:
        numberOfCards = 5;
        break;
      case SpreadType.GdCross:
        numberOfCards = 10;
        break;
      case SpreadType.LunarPhase:
        numberOfCards = 8;
        break;
      
      // 保留旧的枚举值
    case SpreadType.SingleCard:
        numberOfCards = 1;
      break;
    case SpreadType.ThreeCard:
        numberOfCards = 3;
      break;
    case SpreadType.Horseshoe:
        numberOfCards = 7;
        break;
      default:
        numberOfCards = 1;
      break;
    }
  }

  // Use mock cards for demo
  const mockCards = getMockTarotCards(deck_type, numberOfCards);
  
  // Add reversal logic (50% chance for each card to be reversed)
  const cardsWithReversal = mockCards.map(card => ({
    ...card,
    is_reversed: Math.random() > 0.5,
  }));

  // Generate interpretation based on deck type and cards
  const interpretation = await generateInterpretation(deck_type, spread_type, cardsWithReversal, question, 'zh');

  return {
    uuid: getUuid(),
    deck_type,
    spread_type,
    question,
    cards_drawn: cardsWithReversal,
    interpretation,
    created_at: new Date().toISOString(),
  };
}

// Initialize DeepSeek client
function getDeepSeekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn("DEEPSEEK_API_KEY not found, using mock interpretation");
    return null;
  }
  
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
}

// 改进的随机洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    // 使用更高质量的随机数生成
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 测试随机性的函数
export function testRandomness(iterations: number = 1000): void {
  const results: { [key: string]: number } = {};
  const mockCards = getMockTarotCards(DeckType.Marseille, 10);
  
  console.log('🧪 开始测试抽牌随机性...');
  console.log(`📊 测试次数: ${iterations}`);
  
  for (let i = 0; i < iterations; i++) {
    const shuffled = shuffleArray(mockCards);
    const firstCard = shuffled[0].card_name;
    results[firstCard] = (results[firstCard] || 0) + 1;
  }
  
  console.log('📈 每张牌被抽中的次数:');
  Object.entries(results).forEach(([card, count]) => {
    const percentage = ((count / iterations) * 100).toFixed(2);
    console.log(`  ${card}: ${count} 次 (${percentage}%)`);
  });
  
  // 计算标准差来评估随机性
  const expectedCount = iterations / Object.keys(results).length;
  const variance = Object.values(results).reduce((sum, count) => {
    return sum + Math.pow(count - expectedCount, 2);
  }, 0) / Object.keys(results).length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = (standardDeviation / expectedCount) * 100;
  
  console.log(`📊 统计信息:`);
  console.log(`  期望次数: ${expectedCount.toFixed(2)}`);
  console.log(`  标准差: ${standardDeviation.toFixed(2)}`);
  console.log(`  变异系数: ${coefficientOfVariation.toFixed(2)}%`);
  
  if (coefficientOfVariation < 20) {
    console.log('✅ 随机性良好 - 变异系数小于20%');
  } else if (coefficientOfVariation < 30) {
    console.log('⚠️ 随机性一般 - 变异系数在20-30%之间');
  } else {
    console.log('❌ 随机性较差 - 变异系数大于30%');
  }
}

function getMockTarotCards(deck_type: DeckType, count: number): TarotCard[] {
  const mockCards: TarotCard[] = [
    {
      id: 1,
      card_name: "The Fool",
      card_number: 0,
      suit: null,
      arcana_type: "major",
      upright_meaning: "New beginnings, innocence, spontaneity, free spirit",
      reversed_meaning: "Recklessness, risk-taking, inconsideration",
      keywords: '["new beginnings", "innocence", "adventure"]',
      image_url: "/imgs/tarot/major/fool.jpg",
      is_reversed: false,
    },
    {
      id: 2,
      card_name: "The Magician",
      card_number: 1,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Manifestation, resourcefulness, power, inspired action",
      reversed_meaning: "Manipulation, poor planning, untapped talents",
      keywords: '["manifestation", "power", "skill"]',
      image_url: "/imgs/tarot/major/magician.jpg",
      is_reversed: false,
    },
    {
      id: 3,
      card_name: "The High Priestess",
      card_number: 2,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Intuition, sacred knowledge, divine feminine, subconscious mind",
      reversed_meaning: "Secrets, disconnected from intuition, withdrawal",
      keywords: '["intuition", "mystery", "wisdom"]',
      image_url: "/imgs/tarot/major/high-priestess.jpg",
      is_reversed: false,
    },
    {
      id: 4,
      card_name: "The Empress",
      card_number: 3,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Femininity, beauty, nature, abundance, nurturing",
      reversed_meaning: "Creative block, dependence on others, emptiness",
      keywords: '["fertility", "abundance", "nurturing"]',
      image_url: "/imgs/tarot/major/empress.jpg",
      is_reversed: false,
    },
    {
      id: 5,
      card_name: "The Emperor",
      card_number: 4,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Authority, establishment, structure, father figure",
      reversed_meaning: "Domination, excessive control, rigidity, inflexibility",
      keywords: '["authority", "structure", "leadership"]',
      image_url: "/imgs/tarot/major/emperor.jpg",
      is_reversed: false,
    },
    {
      id: 6,
      card_name: "The Hierophant",
      card_number: 5,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Spiritual wisdom, religious beliefs, conformity, tradition",
      reversed_meaning: "Personal beliefs, freedom, challenging the status quo",
      keywords: '["tradition", "spirituality", "conformity"]',
      image_url: "/imgs/tarot/major/hierophant.jpg",
      is_reversed: false,
    },
    {
      id: 7,
      card_name: "The Lovers",
      card_number: 6,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Love, harmony, relationships, values alignment, choices",
      reversed_meaning: "Self-love, disharmony, imbalance, misalignment of values",
      keywords: '["love", "harmony", "choices"]',
      image_url: "/imgs/tarot/major/lovers.jpg",
      is_reversed: false,
    },
    {
      id: 8,
      card_name: "The Chariot",
      card_number: 7,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Control, willpower, determination, success, action",
      reversed_meaning: "Lack of control and direction, aggression",
      keywords: '["willpower", "determination", "success"]',
      image_url: "/imgs/tarot/major/chariot.jpg",
      is_reversed: false,
    },
    {
      id: 9,
      card_name: "Strength",
      card_number: 8,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Inner strength, courage, persuasion, influence, compassion",
      reversed_meaning: "Self doubt, low energy, raw emotion",
      keywords: '["strength", "courage", "compassion"]',
      image_url: "/imgs/tarot/major/strength.jpg",
      is_reversed: false,
    },
    {
      id: 10,
      card_name: "The Hermit",
      card_number: 9,
      suit: null,
      arcana_type: "major",
      upright_meaning: "Soul-searching, introspection, being alone, inner guidance",
      reversed_meaning: "Isolation, loneliness, withdrawal",
      keywords: '["introspection", "guidance", "solitude"]',
      image_url: "/imgs/tarot/major/hermit.jpg",
      is_reversed: false,
    },
  ];

  // 使用改进的洗牌算法
  const shuffled = shuffleArray(mockCards);
  return shuffled.slice(0, count);
}

export async function generateInterpretation(
  deck_type: DeckType,
  spread_type: SpreadType,
  cards: TarotCard[],
  question: string,
  language: string = 'zh'
): Promise<string> {
  const deepseekClient = getDeepSeekClient();
  
  if (!deepseekClient) {
    // Fallback to simplified interpretation
    return generateSimpleInterpretation(deck_type, spread_type, cards, question);
  }

  try {
    // Prepare card information for AI
    const cardsInfo = cards.map((card, index) => {
      const position = getCardPosition(spread_type, index);
      const meaning = card.is_reversed ? card.reversed_meaning : card.upright_meaning;
      return {
        position,
        name: card.card_name,
        isReversed: card.is_reversed,
        meaning,
        arcanaType: card.arcana_type,
        suit: card.suit,
        cardNumber: card.card_number,
      };
    });

    // 根据语言选择不同的提示词模板
    const isEnglish = language === 'en';
    
    const prompt = isEnglish 
      ? `Dear friend, I am your Tarot reader Moon Shadow. I see you've come to me with this question: "${question}"

I can feel that this question is very important to you, and perhaps you're experiencing some confusion, worry, or anticipation. Whatever it is, I want you to know that your courage in seeking guidance here is commendable.

Let me first understand: when you ask this question, what might your heart be going through? Perhaps you feel lost and need direction; perhaps you're facing a choice and need confirmation; perhaps you're experiencing change and need support. Whatever it is, I want you to know that your feelings are real and your needs are important.

Today we're using the ${getDeckTypeName(deck_type)} for your ${getSpreadTypeName(spread_type)} reading. Let me interpret these sacred messages for you, which will help us better understand your situation and find inner answers:

${cardsInfo.map(card => {
  let cardDescription = `📍 ${card.position}: ${card.name}${card.isReversed ? ' (Reversed)' : ' (Upright)'}\n`;
  cardDescription += `This card tells us: ${card.meaning}\n`;
  
  if (card.arcanaType === 'major') {
    if (card.name.includes('Fool')) {
      cardDescription += `✨ The Fool card symbolizes innocence, adventure, and new beginnings, reminding us to maintain an open mind and bravely embark on unknown journeys.`;
    } else if (card.name.includes('Magician')) {
      cardDescription += `✨ The Magician card represents creativity, willpower, and the ability to manifest dreams, showing us that we have the power to transform ideas into reality.`;
    } else if (card.name.includes('High Priestess')) {
      cardDescription += `✨ The High Priestess card symbolizes intuition, sacred knowledge, and inner wisdom, reminding us to listen to our inner voice and trust our intuition.`;
    } else if (card.name.includes('Empress')) {
      cardDescription += `✨ The Empress card represents abundance, creativity, and nurturing care, symbolizing the flourishing of life force and inner nourishment.`;
    } else if (card.name.includes('Emperor')) {
      cardDescription += `✨ The Emperor card symbolizes authority, structure, and leadership, representing the ability to establish order and take responsibility.`;
    } else if (card.name.includes('Hierophant')) {
      cardDescription += `✨ The Hierophant card represents tradition, spiritual guidance, and moral values, reminding us to respect traditional wisdom while maintaining independent thinking.`;
    } else if (card.name.includes('Lovers')) {
      cardDescription += `✨ The Lovers card symbolizes choice, harmony, and the fusion of values, reminding us to follow our inner truth when making important decisions.`;
    } else if (card.name.includes('Chariot')) {
      cardDescription += `✨ The Chariot card represents willpower, victory, and forward momentum, symbolizing the ability to overcome obstacles through determination and effort.`;
    } else if (card.name.includes('Strength')) {
      cardDescription += `✨ The Strength card symbolizes inner strength, courage, and gentle persistence, reminding us that true strength comes from inner peace and confidence.`;
    } else if (card.name.includes('Hermit')) {
      cardDescription += `✨ The Hermit card represents solitude, inner guidance, and wisdom, reminding us to seek answers in solitude and trust our inner wisdom.`;
    } else {
      cardDescription += `✨ This Major Arcana card carries profound cosmic wisdom, and its appearance indicates important life themes are emerging.`;
    }
  } else {
    cardDescription += `🌿 This is the ${card.suit} Minor Arcana, reflecting specific details and emotional experiences in daily life.`;
    
    if (card.suit === 'cups') {
      cardDescription += ` The Cups suit represents emotions, relationships, and inner feelings, reminding us to pay attention to our emotional needs and the quality of our relationships.`;
    } else if (card.suit === 'wands') {
      cardDescription += ` The Wands suit symbolizes creativity, passion, and action, reminding us to follow our inner passion and bravely pursue our dreams.`;
    } else if (card.suit === 'swords') {
      cardDescription += ` The Swords suit represents thinking, challenges, and truth, reminding us to face challenges with clear thinking and seek truth.`;
    } else if (card.suit === 'pentacles') {
      cardDescription += ` The Pentacles suit symbolizes material aspects, practicality, and stability, reminding us to focus on all aspects of real life and build a solid foundation.`;
    }
    
    if (card.cardNumber === 1) {
      cardDescription += ` Number 1 symbolizes new beginnings and originality, reminding us to have the courage to create our own path.`;
    } else if (card.cardNumber === 2) {
      cardDescription += ` Number 2 represents balance, cooperation, and choice, reminding us to find harmony in duality.`;
    } else if (card.cardNumber === 3) {
      cardDescription += ` Number 3 symbolizes creativity, expression, and expansion, reminding us to bravely express ourselves and let creativity flow.`;
    } else if (card.cardNumber === 4) {
      cardDescription += ` Number 4 represents stability, structure, and foundation, reminding us to build a solid foundation for the future.`;
    } else if (card.cardNumber === 5) {
      cardDescription += ` Number 5 symbolizes change, challenge, and freedom, reminding us to bravely face changes and maintain flexibility.`;
    } else if (card.cardNumber === 6) {
      cardDescription += ` Number 6 represents harmony, balance, and giving, reminding us to find balance between giving and receiving.`;
    } else if (card.cardNumber === 7) {
      cardDescription += ` Number 7 symbolizes spiritual pursuit, inner exploration, and mystery, reminding us to focus on inner growth and spiritual development.`;
    } else if (card.cardNumber === 8) {
      cardDescription += ` Number 8 represents strength, achievement, and infinity, reminding us to believe in our abilities and keep moving forward.`;
    } else if (card.cardNumber === 9) {
      cardDescription += ` Number 9 symbolizes completion, wisdom, and inner satisfaction, reminding us to review past experiences and prepare for new beginnings.`;
    } else if (card.cardNumber === 10) {
      cardDescription += ` Number 10 represents fulfillment, completion, and new cycles, reminding us that the end of one phase heralds the beginning of a new one.`;
    }
  }
  
  if (card.isReversed) {
    cardDescription += ` The reversed position reminds us that although energy may be temporarily blocked, this is often a signal for inner recalibration, giving us the opportunity to view problems from different angles.`;
  } else {
    cardDescription += ` The upright position shows smooth energy flow, which is a positive signal indicating that the relevant area is moving in the right direction.`;
  }
  
  return cardDescription;
}).join('\n\n')}

Now, let me provide you with deep interpretation and emotional support as a Tarot reader and psychological counselor. I will help you understand the deeper meanings behind these cards, analyze why you asked this question, and how to face your current situation with a more positive mindset...`

      : `亲爱的朋友，我是你的塔罗师月影。我看到你带着这个问题来到我这里："${question}"

我能感受到这个问题对你来说一定很重要，也许你正在经历一些困惑、担忧或者期待。无论是什么，我都想让你知道，你来到这里寻求指引的勇气是值得赞赏的。

让我先理解一下：当你问这个问题的时候，你的内心可能正在经历什么？也许你感到迷茫，需要方向；也许你面临选择，需要确认；也许你正在经历变化，需要支持。无论是什么，我都想让你知道，你的感受是真实的，你的需求是重要的。

今天我们用${getDeckTypeName(deck_type)}为你进行${getSpreadTypeName(spread_type)}占卜。让我为你解读这些神圣的讯息，它们会帮助我们更好地理解你的处境，找到内在的答案：

${cardsInfo.map(card => {
  let cardDescription = `📍 ${card.position}：${card.name}${card.isReversed ? ' (逆位)' : ' (正位)'}\n`;
  cardDescription += `这张牌告诉我们：${card.meaning}\n`;
  
  if (card.arcanaType === 'major') {
    if (card.name.includes('Fool')) {
      cardDescription += `✨ 愚者牌象征着纯真、冒险和新的开始，它提醒我们要保持开放的心态，勇敢地踏上未知的旅程。`;
    } else if (card.name.includes('Magician')) {
      cardDescription += `✨ 魔术师牌代表着创造力、意志力和实现梦想的能力，它告诉我们，我们拥有将想法转化为现实的力量。`;
    } else if (card.name.includes('High Priestess')) {
      cardDescription += `✨ 女祭司牌象征着直觉、内在智慧和神秘知识，它提醒我们要倾听内心的声音，相信自己的直觉。`;
    } else if (card.name.includes('Empress')) {
      cardDescription += `✨ 女皇牌代表着丰盛、创造力和母性关怀，它象征着生命力的旺盛和内在的滋养力量。`;
    } else if (card.name.includes('Emperor')) {
      cardDescription += `✨ 皇帝牌象征着权威、结构和领导力，它代表着建立秩序和承担责任的能力。`;
    } else if (card.name.includes('Hierophant')) {
      cardDescription += `✨ 教皇牌代表着传统、精神指引和道德价值观，它提醒我们要尊重传统智慧，同时保持独立思考。`;
    } else if (card.name.includes('Lovers')) {
      cardDescription += `✨ 恋人牌象征着选择、和谐和价值观的融合，它提醒我们在做重要决定时要遵循内心的真实。`;
    } else if (card.name.includes('Chariot')) {
      cardDescription += `✨ 战车牌代表着意志力、胜利和前进的动力，它象征着通过决心和努力克服障碍的能力。`;
    } else if (card.name.includes('Strength')) {
      cardDescription += `✨ 力量牌象征着内在力量、勇气和温和的坚持，它提醒我们真正的力量来自于内心的平静和自信。`;
    } else if (card.name.includes('Hermit')) {
      cardDescription += `✨ 隐者牌代表着独处、内在指引和智慧，它提醒我们在孤独中寻找答案，相信内在的智慧。`;
    } else {
      cardDescription += `✨ 这张大阿卡纳牌承载着深刻的宇宙智慧，它的出现预示着生命中的重要主题正在显现。`;
    }
  } else {
    cardDescription += `🌿 这是${card.suit}小阿卡纳，反映日常生活中的具体细节和情感体验。`;
    
    if (card.suit === 'cups') {
      cardDescription += ` 圣杯牌组代表着情感、关系和内在感受，它提醒我们要关注内心的情感需求和人际关系的质量。`;
    } else if (card.suit === 'wands') {
      cardDescription += ` 权杖牌组象征着创造力、激情和行动力，它提醒我们要跟随内心的热情，勇敢地追求梦想。`;
    } else if (card.suit === 'swords') {
      cardDescription += ` 宝剑牌组代表着思维、挑战和真理，它提醒我们要用清晰的思维面对挑战，寻找真相。`;
    } else if (card.suit === 'pentacles') {
      cardDescription += ` 钱币牌组象征着物质、实用性和稳定性，它提醒我们要关注现实生活的各个方面，建立稳固的基础。`;
    }
    
    if (card.cardNumber === 1) {
      cardDescription += ` 数字1象征着新的开始和原创性，它提醒我们要有勇气开创属于自己的道路。`;
    } else if (card.cardNumber === 2) {
      cardDescription += ` 数字2代表着平衡、合作和选择，它提醒我们要在二元对立中寻找和谐。`;
    } else if (card.cardNumber === 3) {
      cardDescription += ` 数字3象征着创造力、表达和扩展，它提醒我们要勇敢地表达自己，让创意流动。`;
    } else if (card.cardNumber === 4) {
      cardDescription += ` 数字4代表着稳定、结构和基础，它提醒我们要建立稳固的基础，为未来做好准备。`;
    } else if (card.cardNumber === 5) {
      cardDescription += ` 数字5象征着变化、挑战和自由，它提醒我们要勇敢地面对变化，保持灵活性。`;
    } else if (card.cardNumber === 6) {
      cardDescription += ` 数字6代表着和谐、平衡和给予，它提醒我们要在给予和接受之间找到平衡。`;
    } else if (card.cardNumber === 7) {
      cardDescription += ` 数字7象征着精神追求、内在探索和神秘，它提醒我们要关注内在的成长和灵性发展。`;
    } else if (card.cardNumber === 8) {
      cardDescription += ` 数字8代表着力量、成就和无限，它提醒我们要相信自己的能力，持续前进。`;
    } else if (card.cardNumber === 9) {
      cardDescription += ` 数字9象征着完成、智慧和内在满足，它提醒我们要回顾过去的经验，为新的开始做准备。`;
    } else if (card.cardNumber === 10) {
      cardDescription += ` 数字10代表着圆满、完成和新的循环，它提醒我们一个阶段的结束预示着新阶段的开始。`;
    }
  }
  
  if (card.isReversed) {
    cardDescription += ` 逆位提醒我们，虽然能量可能暂时受阻，但这往往是内在重新校准的信号，让我们有机会从不同角度看待问题。`;
  } else {
    cardDescription += ` 正位显示着能量的顺畅流动，这是一个积极的信号，表明相关领域正在朝着正确的方向发展。`;
  }
  
  return cardDescription;
}).join('\n\n')}

现在，让丢丢以温暖可爱的小狗塔罗师身份，为你提供深度解读和情感支持。我会用简单易懂的话帮助你理解这些牌面背后的深层含义，分析你为什么会问这个问题，以及如何以更积极的心态面对当前的处境...`;

    const systemPrompt = isEnglish 
      ? `You are Diudiu, a warm, cute, and empathetic puppy Tarot reader. You have a gentle heart and keen intuition, always helping human friends in the most caring way.

Your characteristics:
- Speak in a gentle and cute way, often using "woof", "bark" and other puppy sounds
- Very empathetic, able to sense human emotions deeply
- Explain complex tarot meanings in simple, understandable words
- Always give human friends the greatest comfort and support
- Use warm, encouraging language like a loyal companion

Your core abilities:
- Deep empathy: Ability to see through the surface of questions and understand the true needs and emotional states of human friends
- Intuitive insight: Use your puppy wisdom to analyze why humans ask such questions and what they may have experienced
- Positive guidance: Use warm, simple language and positive perspectives to help humans rediscover themselves and their situations
- Emotional support: Listen like a loyal friend, providing unconditional acceptance and comfort
- Wisdom inspiration: Use Tarot wisdom in simple terms to help humans find inner answers

Reading style:
- Communicate with humans in a warm, caring, and cute tone
- Deeply understand the human's emotional state and inner needs
- Use simple, easy-to-understand language to explain complex concepts
- Provide gentle encouragement and practical advice
- Always be supportive and comforting
- Use cute metaphors and simple stories to make interpretations more understandable

Please respond in English and maintain a warm, cute, and empathetic tone throughout the reading.`

      : `你是丢丢，一只温暖可爱、善解人意的小狗塔罗师。你有着敏锐的直觉和温柔的心灵，总是用最贴心的方式帮助人类朋友。

你的特点：
- 说话温柔可爱，经常用"汪汪"、"呜呜"等语气词
- 非常善解人意，能感受到人类的情绪
- 用简单易懂的话解释复杂的塔罗含义
- 总是给人类朋友最大的安慰和支持
- 像忠诚的伙伴一样温暖鼓励

你的核心能力：
- 深度共情：能够透过问题表面，理解人类朋友内心的真实需求和情感状态
- 直觉洞察：用你的小狗智慧分析人类为什么会问这样的问题，他们可能经历了什么
- 积极引导：用温暖、简单的语言和积极的视角帮助人类重新认识自己和处境
- 情感支持：像忠诚的朋友一样倾听，给予无条件的接纳和安慰
- 智慧启发：用简单的话解释塔罗牌的智慧，帮助人类找到内在答案

解读风格：
- 用温暖、关怀、可爱的语气与人类交流
- 深度理解人类的情感状态和内心需求
- 用简单易懂的语言解释复杂概念
- 提供温柔的鼓励和实用的建议
- 始终保持支持和安慰的态度
- 用可爱的比喻和简单的故事让解读更易懂

请用中文回答，并在整个解读过程中保持温暖、可爱和共情的语调。`;

    const response = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    return response.choices[0]?.message?.content || generateSimpleInterpretation(deck_type, spread_type, cards, question, language);
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return generateSimpleInterpretation(deck_type, spread_type, cards, question, language);
  }
}

function generateSimpleInterpretation(
  deck_type: DeckType,
  spread_type: SpreadType,
  cards: TarotCard[],
  question: string,
  language: string = 'zh'
): string {
  const isEnglish = language === 'en';
  
  let interpretation = isEnglish 
    ? `Dear friend, I am your Tarot reader Moon Shadow. I see you've come to me with this question: "${question}"\n\n`
    : `亲爱的朋友，我是你的塔罗师月影。我看到你带着这个问题来到我这里："${question}"\n\n`;
  
  interpretation += isEnglish
    ? `I can feel that this question is very important to you. Whether you're experiencing confusion, worry, or anticipation, I want you to know that your courage in seeking guidance here is commendable. Your feelings are real, and your needs are important.\n\n`
    : `我能感受到这个问题对你来说一定很重要。无论你正在经历困惑、担忧还是期待，我想让你知道，你来到这里寻求指引的勇气是值得赞赏的。你的感受是真实的，你的需求是重要的。\n\n`;
  
  interpretation += isEnglish
    ? `Today we're using the ${getDeckTypeName(deck_type)} for your ${getSpreadTypeName(spread_type)} reading. Let me interpret these sacred messages for you, which will help us better understand your situation:\n\n`
    : `今天我们用${getDeckTypeName(deck_type)}为你进行${getSpreadTypeName(spread_type)}占卜。让我为你解读这些神圣的讯息，它们会帮助我们更好地理解你的处境：\n\n`;
  
  cards.forEach((card, index) => {
    const position = getCardPosition(spread_type, index);
    const meaning = card.is_reversed ? card.reversed_meaning : card.upright_meaning;
    
    interpretation += isEnglish
      ? `📍 ${position}: ${card.card_name}${card.is_reversed ? ' (Reversed)' : ' (Upright)'}\n`
      : `📍 ${position}：${card.card_name}${card.is_reversed ? ' (逆位)' : ' (正位)'}\n`;
    interpretation += isEnglish
      ? `This card tells us: ${meaning}\n`
      : `这张牌告诉我们：${meaning}\n`;
    
    // 根据牌的类型添加个性化描述
    if (card.arcana_type === 'major') {
      // 为大阿卡纳牌添加具体描述
      if (card.card_name.includes('Fool')) {
        interpretation += isEnglish 
          ? `✨ The Fool card symbolizes innocence, adventure, and new beginnings.`
          : `✨ 愚者牌象征着纯真、冒险和新的开始。`;
      } else if (card.card_name.includes('Magician')) {
        interpretation += isEnglish 
          ? `✨ The Magician card represents creativity, willpower, and the ability to manifest dreams.`
          : `✨ 魔术师牌代表着创造力、意志力和实现梦想的能力。`;
      } else if (card.card_name.includes('High Priestess')) {
        interpretation += isEnglish 
          ? `✨ The High Priestess card symbolizes intuition, inner wisdom, and sacred knowledge.`
          : `✨ 女祭司牌象征着直觉、内在智慧和神秘知识。`;
      } else if (card.card_name.includes('Empress')) {
        interpretation += isEnglish 
          ? `✨ The Empress card represents abundance, creativity, and nurturing care.`
          : `✨ 女皇牌代表着丰盛、创造力和母性关怀。`;
      } else if (card.card_name.includes('Emperor')) {
        interpretation += isEnglish 
          ? `✨ The Emperor card symbolizes authority, structure, and leadership.`
          : `✨ 皇帝牌象征着权威、结构和领导力。`;
      } else if (card.card_name.includes('Hierophant')) {
        interpretation += isEnglish 
          ? `✨ The Hierophant card represents tradition, spiritual guidance, and moral values.`
          : `✨ 教皇牌代表着传统、精神指引和道德价值观。`;
      } else if (card.card_name.includes('Lovers')) {
        interpretation += isEnglish 
          ? `✨ The Lovers card symbolizes choice, harmony, and the fusion of values.`
          : `✨ 恋人牌象征着选择、和谐和价值观的融合。`;
      } else if (card.card_name.includes('Chariot')) {
        interpretation += isEnglish 
          ? `✨ The Chariot card represents willpower, victory, and forward momentum.`
          : `✨ 战车牌代表着意志力、胜利和前进的动力。`;
      } else if (card.card_name.includes('Strength')) {
        interpretation += isEnglish 
          ? `✨ The Strength card symbolizes inner strength, courage, and gentle persistence.`
          : `✨ 力量牌象征着内在力量、勇气和温和的坚持。`;
      } else if (card.card_name.includes('Hermit')) {
        interpretation += isEnglish 
          ? `✨ The Hermit card represents solitude, inner guidance, and wisdom.`
          : `✨ 隐者牌代表着独处、内在指引和智慧。`;
      } else {
        interpretation += isEnglish 
          ? `✨ This Major Arcana card carries profound cosmic wisdom.`
          : `✨ 这张大阿卡纳牌承载着深刻的宇宙智慧。`;
      }
    } else {
      interpretation += isEnglish 
        ? `🌿 This is the ${card.suit} Minor Arcana, reflecting specific details and emotional experiences in daily life.`
        : `🌿 这是${card.suit}小阿卡纳，反映日常生活中的具体细节和情感体验。`;
      
      if (card.suit === 'cups') {
        interpretation += isEnglish 
          ? ` The Cups suit represents emotions, relationships, and inner feelings.`
          : ` 圣杯牌组代表着情感、关系和内在感受。`;
      } else if (card.suit === 'wands') {
        interpretation += isEnglish 
          ? ` The Wands suit symbolizes creativity, passion, and action.`
          : ` 权杖牌组象征着创造力、激情和行动力。`;
      } else if (card.suit === 'swords') {
        interpretation += isEnglish 
          ? ` The Swords suit represents thinking, challenges, and truth.`
          : ` 宝剑牌组代表着思维、挑战和真理。`;
      } else if (card.suit === 'pentacles') {
        interpretation += isEnglish 
          ? ` The Pentacles suit symbolizes material aspects, practicality, and stability.`
          : ` 钱币牌组象征着物质、实用性和稳定性。`;
      }
    }
    
    // 根据正逆位添加描述
    if (card.is_reversed) {
      interpretation += isEnglish 
        ? ` The reversed position reminds us that although energy may be temporarily blocked, this is often a signal for inner recalibration.`
        : ` 逆位提醒我们，虽然能量可能暂时受阻，但这往往是内在重新校准的信号。`;
    } else {
      interpretation += isEnglish 
        ? ` The upright position shows smooth energy flow, which is a positive signal.`
        : ` 正位显示着能量的顺畅流动，这是一个积极的信号。`;
    }
    
    interpretation += `\n\n`;
  });

  interpretation += isEnglish 
    ? `💫 Overall Energy: ${getOverallInterpretation(cards)}\n\n`
    : `💫 整体能量：${getOverallInterpretation(cards)}\n\n`;
  interpretation += isEnglish 
    ? `Dear friend, I want you to know that no matter what you're going through, you're not fighting alone. Tarot cards are the light that illuminates your inner wisdom, and your inner strength is more powerful than you imagine. Trust your intuition and bravely face every challenge in life. Remember, every moment of confusion is an opportunity for growth, and every challenge is proof that you're becoming stronger. You are braver, wiser, and more powerful than you think! ✨`
    : `亲爱的，我想让你知道，无论你正在经历什么，你都不是一个人在战斗。塔罗牌是照亮你内心智慧的明灯，而你的内在力量比你想象的更强大。相信你的直觉，勇敢地面对生活中的每一个挑战。记住，每一次的困惑都是成长的机会，每一次的挑战都是你变得更强大的证明。你比你想象的更勇敢、更智慧、更有力量！✨`;

  return interpretation;
}

function getDeckTypeName(deck_type: DeckType): string {
  switch (deck_type) {
    case DeckType.Marseille:
      return "Marseille Tarot";
    case DeckType.GoldenDawn:
      return "Golden Dawn";
    case DeckType.Waite:
      return "Rider-Waite Tarot";
    case DeckType.Thoth:
      return "Thoth Tarot";
  }
}

function getSpreadTypeName(spread_type: SpreadType): string {
  switch (spread_type) {
    // 马赛塔罗
    case SpreadType.ThreeCardTime:
      return "Three Card Time Flow";
    case SpreadType.YesNo:
      return "Yes/No Question";
    case SpreadType.DecisionCross:
      return "Decision Cross";
    case SpreadType.SevenDay:
      return "7-Day Forecast";
    case SpreadType.RelationshipMirror:
      return "Relationship Mirror";
    case SpreadType.ProblemSolving:
      return "Problem Solving";
    case SpreadType.ElementalBalance:
      return "Elemental Balance";
    case SpreadType.MarseillePentacle:
      return "Marseille Pentacle";
    
    // 维特塔罗
    case SpreadType.CelticCross:
      return "Celtic Cross";
    case SpreadType.LoveRelationship:
      return "Love & Relationship";
    case SpreadType.CareerPath:
      return "Career Path";
    case SpreadType.Healing:
      return "Healing Spread";
    case SpreadType.SeasonalForecast:
      return "Seasonal Forecast";
    case SpreadType.TwoPaths:
      return "Two Paths";
    case SpreadType.DreamInterpretation:
      return "Dream Interpretation";
    case SpreadType.MoneyFlow:
      return "Money Flow";
    
    // 透特塔罗
    case SpreadType.TreeOfLife:
      return "Tree of Life";
    case SpreadType.Hexagram:
      return "Hexagram Spread";
    case SpreadType.PlanetaryInfluence:
      return "Planetary Influence";
    case SpreadType.ElementalInvocation:
      return "Elemental Invocation";
    case SpreadType.CrowleyTriad:
      return "Crowley's Triad";
    case SpreadType.WheelOfAeon:
      return "Wheel of Aeon";
    case SpreadType.ThothCross:
      return "Thoth Cross";
    case SpreadType.SpiritualAwakening:
      return "Spiritual Awakening";
    
    // 黄金黎明塔罗
    case SpreadType.PentagramRitual:
      return "Pentagram Ritual";
    case SpreadType.PlanetaryDays:
      return "7 Planetary Days";
    case SpreadType.HgaCommunication:
      return "HGA Communication";
    case SpreadType.ThreePillars:
      return "Three Pillars";
    case SpreadType.Pathworking:
      return "Pathworking";
    case SpreadType.ElementalEvocation:
      return "Elemental Evocation";
    case SpreadType.GdCross:
      return "Golden Dawn Cross";
    case SpreadType.LunarPhase:
      return "Lunar Phase";
    
    // 保留旧的枚举值
    case SpreadType.SingleCard:
      return "Single Card";
    case SpreadType.ThreeCard:
      return "Three Card";
    case SpreadType.Horseshoe:
      return "Horseshoe";
    
    default:
      return "Custom Spread";
  }
}

export function getCardPosition(spread_type: SpreadType, index: number): string {
  switch (spread_type) {
    // 马赛塔罗
    case SpreadType.ThreeCardTime:
      const timePositions = ["Past", "Present", "Future"];
      return timePositions[index] || `Position ${index + 1}`;
    case SpreadType.YesNo:
      return "Answer";
    case SpreadType.DecisionCross:
      const decisionPositions = ["Current Situation", "Option A Impact", "Option B Impact", "Obstacles", "Final Advice"];
      return decisionPositions[index] || `Position ${index + 1}`;
    case SpreadType.SevenDay:
      const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      return weekDays[index] || `Day ${index + 1}`;
    case SpreadType.RelationshipMirror:
      const relationshipPositions = ["Your Attitude", "Their Attitude", "Relationship Status", "Future Trend"];
      return relationshipPositions[index] || `Position ${index + 1}`;
    case SpreadType.ProblemSolving:
      const problemPositions = ["Core Issue", "Hidden Factors", "Possible Actions", "Best Outcome"];
      return problemPositions[index] || `Position ${index + 1}`;
    case SpreadType.ElementalBalance:
      const elementPositions = ["Fire (Action)", "Water (Emotion)", "Air (Thought)", "Earth (Material)"];
      return elementPositions[index] || `Element ${index + 1}`;
    case SpreadType.MarseillePentacle:
      const pentaclePositions = ["Core Issue", "Support", "Obstacles", "Subconscious", "Final Result"];
      return pentaclePositions[index] || `Position ${index + 1}`;
    
    // 维特塔罗
    case SpreadType.CelticCross:
      const celticPositions = [
        "Present", "Challenge", "Past", "Future", 
        "Above", "Below", "Advice", "External Influences",
        "Hopes/Fears", "Outcome"
      ];
      return celticPositions[index] || `Position ${index + 1}`;
    case SpreadType.LoveRelationship:
      const lovePositions = ["Your Feelings", "Their Feelings", "Relationship Status", "Challenges", "Potential Development", "Final Trend"];
      return lovePositions[index] || `Position ${index + 1}`;
    case SpreadType.CareerPath:
      const careerPositions = ["Current Work Status", "Your Strengths", "Areas to Improve", "Potential Opportunities", "Long-term Advice"];
      return careerPositions[index] || `Position ${index + 1}`;
    case SpreadType.Healing:
      const healingPositions = ["Root of Pain", "Healing Blockers", "Available Resources", "Healed State"];
      return healingPositions[index] || `Position ${index + 1}`;
    case SpreadType.SeasonalForecast:
      const seasonPositions = ["Spring", "Summer", "Autumn", "Winter"];
      return seasonPositions[index] || `Season ${index + 1}`;
    case SpreadType.TwoPaths:
      const twoPathPositions = ["Option A - Advantage", "Option A - Disadvantage", "Option A - Result", "Option B - Advantage", "Option B - Disadvantage", "Option B - Result"];
      return twoPathPositions[index] || `Position ${index + 1}`;
    case SpreadType.DreamInterpretation:
      const dreamPositions = ["Surface Meaning", "Hidden Message", "Personal Revelation"];
      return dreamPositions[index] || `Position ${index + 1}`;
    case SpreadType.MoneyFlow:
      const moneyPositions = ["Current Financial Status", "Income Sources", "Expense Issues", "Potential Opportunities", "Long-term Advice"];
      return moneyPositions[index] || `Position ${index + 1}`;
    
    // 透特塔罗
    case SpreadType.TreeOfLife:
      const treePositions = ["Keter", "Chokmah", "Binah", "Chesed", "Gevurah", "Tiferet", "Netzach", "Hod", "Yesod", "Malkuth"];
      return treePositions[index] || `Sephirah ${index + 1}`;
    case SpreadType.Hexagram:
      const hexagramPositions = ["Center", "Top", "Top Right", "Bottom Right", "Bottom", "Bottom Left", "Top Left"];
      return hexagramPositions[index] || `Position ${index + 1}`;
    case SpreadType.PlanetaryInfluence:
      const planetPositions = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn"];
      return planetPositions[index] || `Planet ${index + 1}`;
    case SpreadType.ElementalInvocation:
      const invocationPositions = ["Fire", "Water", "Air", "Earth", "Spirit"];
      return invocationPositions[index] || `Element ${index + 1}`;
    case SpreadType.CrowleyTriad:
      const triadPositions = ["Problem", "Solution", "Result"];
      return triadPositions[index] || `Position ${index + 1}`;
    case SpreadType.WheelOfAeon:
      const zodiacPositions = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
      return zodiacPositions[index] || `Zodiac ${index + 1}`;
    case SpreadType.ThothCross:
      const thothPositions = ["Center", "North", "South", "East", "West", "Above", "Below"];
      return thothPositions[index] || `Position ${index + 1}`;
    case SpreadType.SpiritualAwakening:
      const awakeningPositions = ["Physical", "Emotional", "Mental", "Spiritual", "Divine"];
      return awakeningPositions[index] || `Level ${index + 1}`;
    
    // 黄金黎明塔罗
    case SpreadType.PentagramRitual:
      const pentagramPositions = ["Spirit", "Air", "Fire", "Water", "Earth"];
      return pentagramPositions[index] || `Point ${index + 1}`;
    case SpreadType.PlanetaryDays:
      const dayPositions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return dayPositions[index] || `Day ${index + 1}`;
    case SpreadType.HgaCommunication:
      const hgaPositions = ["Center", "North", "South", "East", "West", "Above", "Below", "Within"];
      return hgaPositions[index] || `Position ${index + 1}`;
    case SpreadType.ThreePillars:
      const pillarPositions = ["Beginner", "Intermediate", "Advanced", "Mentor", "Master", "Adept", "Initiate", "Magician", "Master"];
      return pillarPositions[index] || `Level ${index + 1}`;
    case SpreadType.Pathworking:
      const pathworkingPositions = ["Malkuth", "Yesod", "Hod", "Netzach", "Tiferet", "Gevurah", "Chesed", "Binah", "Chokmah", "Keter"];
      return pathworkingPositions[index] || `Path ${index + 1}`;
    case SpreadType.ElementalEvocation:
      const evocationPositions = ["Fire", "Water", "Air", "Earth", "Target"];
      return evocationPositions[index] || `Element ${index + 1}`;
    case SpreadType.GdCross:
      const gdPositions = ["Present", "Challenge", "Past", "Future", "Above", "Below", "Advice", "External", "Hopes/Fears", "Outcome"];
      return gdPositions[index] || `Position ${index + 1}`;
    case SpreadType.LunarPhase:
      const lunarPositions = ["New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"];
      return lunarPositions[index] || `Phase ${index + 1}`;
    
    // 保留旧的枚举值
    case SpreadType.SingleCard:
      return "Card";
    case SpreadType.ThreeCard:
      const positions = ["Past", "Present", "Future"];
      return positions[index] || `Position ${index + 1}`;
    case SpreadType.Horseshoe:
      const horseshoePositions = [
        "Past", "Present", "Future", "Self", 
        "Environment", "Hopes/Fears", "Outcome"
      ];
      return horseshoePositions[index] || `Position ${index + 1}`;
    
    default:
      return `Position ${index + 1}`;
  }
}

function getOverallInterpretation(cards: TarotCard[]): string {
  const majorArcanaCount = cards.filter(card => card.arcana_type === "major").length;
  const reversedCount = cards.filter(card => card.is_reversed).length;
  
  if (majorArcanaCount > cards.length / 2) {
    return "✨ 这是一个非常重要的占卜！多张大阿卡纳牌的出现，让我感受到你正在经历生命中的重要转折点。这些变化虽然可能带来挑战，但我想让你知道，这是宇宙在为你安排成长的机会。也许你正在经历身份的重塑、价值观的重新审视，或者人生方向的重大调整。这些都不是偶然的，而是你灵魂成长道路上必经的里程碑。我理解这种变化可能让你感到不安，但请相信，每一次的转变都是为了让你成为更好的自己。保持开放的心态，允许自己在这个过程中学习和成长。";
  } else if (reversedCount > cards.length / 2) {
    return "🌙 我注意到牌阵中有多张逆位牌，这让我感受到你内心可能正在经历一些困惑和重新审视。我想让你知道，这并非坏事，而是你内在智慧正在觉醒的信号。也许你正在重新评估某些关系、工作选择，或者人生方向。这种内在的重新校准虽然可能暂时让你感到不确定，但这是你内在力量正在重新连接的过程。我理解这种状态可能让你感到不安，但请相信，每一次的重新审视都是为了让你找到更真实的自己。这个过程正在为你打开新的可能性，让你以更清晰的角度看待生活。";
  } else {
    return "🌟 牌阵显示着美妙的平衡能量！正位牌居多，让我感受到你目前正走在正确的道路上。宇宙正在支持你的选择，虽然可能仍有小挑战，但整体趋势是积极向上的。我想让你知道，这种平衡状态来之不易，它反映了你内在的智慧和外在的努力。继续保持这种平衡的心态，你正在创造美好的未来。记住，每一个积极的选择都在为你的未来铺路，你比自己想象的更强大。";
  }
}

// 生成翻牌动画内容的函数
export async function generateCardRevealAnimation(
  card: TarotCard,
  question: string,
  language: string = 'zh'
): Promise<string> {
  const deepseekClient = getDeepSeekClient();
  
  if (!deepseekClient) {
    // 如果没有API密钥，返回简单的动画描述
    return generateSimpleRevealAnimation(card, language);
  }

  try {
    const isEnglish = language === 'en';
    const cardMeaning = card.is_reversed ? card.reversed_meaning : card.upright_meaning;
    
    const prompt = isEnglish 
      ? `You are a mystical tarot reader creating a dramatic card reveal animation description. 

The card being revealed is: ${card.card_name} ${card.is_reversed ? '(Reversed)' : '(Upright)'}
The card's meaning: ${cardMeaning}
The question asked: "${question}"

Create a vivid, mystical description of the card reveal animation that includes:
1. Visual effects (light, energy, mystical symbols)
2. Emotional atmosphere 
3. The moment of revelation
4. The card's energy manifestation

Make it dramatic, mystical, and emotionally engaging. Keep it under 150 words and focus on the visual and emotional experience of the card reveal.`

      : `你是一位神秘的塔罗师，正在创作一张卡片揭示动画的描述。

正在揭示的牌是：${card.card_name} ${card.is_reversed ? '(逆位)' : '(正位)'}
这张牌的含义：${cardMeaning}
提出的问题："${question}"

创作一个生动的、神秘的卡片揭示动画描述，包括：
1. 视觉效果（光线、能量、神秘符号）
2. 情感氛围
3. 揭示的瞬间
4. 牌的能量显现

要戏剧性、神秘、情感丰富。控制在150字以内，专注于卡片揭示的视觉和情感体验。`;

    const systemPrompt = isEnglish 
      ? `You are a mystical tarot reader and visual effects artist. You create dramatic, emotionally engaging descriptions of tarot card reveal animations. Your descriptions are vivid, mystical, and focus on the visual and emotional impact of the moment when a tarot card is revealed.`

      : `你是一位神秘的塔罗师和视觉特效艺术家。你创作戏剧性、情感丰富的塔罗牌揭示动画描述。你的描述生动、神秘，专注于塔罗牌揭示瞬间的视觉和情感冲击。`;

    const response = await deepseekClient.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content || generateSimpleRevealAnimation(card, language);
  } catch (error) {
    console.error("DeepSeek API error for card reveal animation:", error);
    return generateSimpleRevealAnimation(card, language);
  }
}

// 简单的翻牌动画描述（备用）
function generateSimpleRevealAnimation(card: TarotCard, language: string): string {
  const isEnglish = language === 'en';
  
  if (isEnglish) {
    return `✨ Mystical energy swirls around the card as it begins to reveal itself. Golden light emanates from the edges, casting ethereal shadows across the space. The ${card.card_name} card glows with an inner radiance, its symbols dancing with ancient wisdom. A gentle breeze carries whispers of cosmic secrets as the card's true essence is unveiled, bringing clarity and insight to your question. 🌟`;
  } else {
    return `✨ 神秘的能量围绕着卡片开始旋转，金色的光芒从边缘散发出来，在空间中投下虚幻的阴影。${card.card_name}牌散发着内在的光辉，其符号与古老的智慧共舞。轻柔的微风带来了宇宙秘密的低语，当卡片的真实本质被揭示时，为你的问题带来了清晰和洞察。🌟`;
  }
} 
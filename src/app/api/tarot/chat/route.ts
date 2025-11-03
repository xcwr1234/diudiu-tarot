import { NextRequest } from "next/server";
import { respData, respErr } from "@/lib/resp";
import OpenAI from "openai";
import { DeckType, SpreadType } from "@/types/tarot";
import { performTarotReading } from "@/services/tarot";
import { TarotCard } from "@/types/tarot";
import { analyzeQuestion } from "@/services/tarot-analysis";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationState {
  phase: "welcome" | "exploration" | "confirmation" | "reading" | "interpretation" | "conclusion";
  userQuestion?: string;
  suggestedDeck?: string;
  suggestedSpread?: string;
  confirmedDeck?: string;
  confirmedSpread?: string;
  cardsDrawn?: TarotCard[];
  currentCardIndex?: number;
  readingUuid?: string;
  questionAnalysis?: any;
}

interface ChatRequest {
  message: string;
  conversationHistory: Message[];
  conversationState: ConversationState;
  language: string;
}

// Initialize DeepSeek client
function getDeepSeekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.warn("DEEPSEEK_API_KEY not found");
    return null;
  }
  
  return new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.deepseek.com/v1",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversationHistory, conversationState, language } = body;

    const deepseekClient = getDeepSeekClient();
    const isZh = language === "zh";
    
    // 如果没有 API Key，使用降级模式（模拟对话）
    const useFallbackMode = !deepseekClient;

    // 根据当前阶段处理对话
    let response: { message: string; newState: ConversationState; metadata?: any };

    // 降级模式或API调用失败时使用预设回复
    if (useFallbackMode) {
      response = handleFallbackMode(message, conversationState, conversationHistory, isZh);
    } else {
      try {
        switch (conversationState.phase) {
          case "welcome":
            response = await handleWelcomePhase(message, conversationState, deepseekClient!, isZh);
            break;
      
      case "exploration":
        response = await handleExplorationPhase(message, conversationState, conversationHistory, deepseekClient, isZh);
        break;
      
      case "confirmation":
        response = await handleConfirmationPhase(message, conversationState, deepseekClient, isZh);
        break;
      
      case "reading":
        response = await handleReadingPhase(message, conversationState, deepseekClient, isZh);
        break;
      
      case "interpretation":
        response = await handleInterpretationPhase(message, conversationState, conversationHistory, deepseekClient, isZh);
        break;
      
      case "conclusion":
        response = await handleConclusionPhase(message, conversationState, deepseekClient, isZh);
        break;
      
        default:
          response = {
            message: isZh ? "抱歉，我遇到了一些问题。让我们重新开始吧。" : "I apologize, I encountered an issue. Let's start over.",
            newState: { phase: "welcome" }
          };
        }
      } catch (apiError: any) {
        // API调用失败，降级到预设模式
        console.error("AI API Error, falling back to preset responses:", apiError);
        response = handleFallbackMode(message, conversationState, conversationHistory, isZh);
      }
    }

    return respData(response);
  } catch (error: any) {
    console.error("Tarot chat error:", error);
    return respErr(error.message || "Failed to process chat message");
  }
}

// 欢迎阶段 -> 探索阶段
async function handleWelcomePhase(
  message: string,
  state: ConversationState,
  client: OpenAI,
  isZh: boolean
): Promise<{ message: string; newState: ConversationState; metadata?: any }> {
  
  try {
    // 1) 系统分析用户问题，推荐牌组与牌阵
    const analysis = analyzeQuestion(message);
    const deckType = recommendDeck(analysis.questionType);
    const spreadType = analysis.suggestedSpread;

    // 2) 立即执行抽牌（合并“分析 + 抽牌”）
    const reading = await performTarotReading(
      deckType,
      spreadType,
      message,
      getCardCountForSpread(spreadType)
    );

    // 3) 生成首次综合解读，并邀请进入自由对话
    const cardsInfo = reading.cards_drawn.map((c, i) => (
      isZh
        ? `${i + 1}. ${getCardPosition(spreadType, i, true)}：${c.card_name}${c.is_reversed ? "（逆位）" : "（正位）"}`
        : `${i + 1}. ${getCardPosition(spreadType, i, false)}: ${c.card_name}${c.is_reversed ? " (Reversed)" : " (Upright)"}`
    )).join("\n");

    const systemPrompt = isZh
      ? `你是丢丢，一只温暖可爱的小狗塔罗师。用户刚提出了问题，你已经：1）完成系统分析；2）完成抽牌。现在请：
1. 用温柔口吻简短安抚与共情；
2. 给出这次牌阵的总体脉络与核心答案（不逐张冗长解释）；
3. 邀请用户继续用自由对话追问细节；
4. 语气可爱但专业，控制在220字以内。

问题：${message}
牌阵：${getSpreadTypeName(spreadType, true)}（${reading.cards_drawn.length}张）
牌面：\n${cardsInfo}`
      : `You are Diudiu, a warm and cute puppy tarot reader. The user just asked a question and you already: (1) analyzed it; (2) drew the cards. Now please:
1) Offer brief empathy; 2) Provide a concise overall throughline and core answer (not verbose card-by-card); 3) Invite free-form follow-up chat; 4) Keep it professional yet cute, under 180 words.

Question: ${message}
Spread: ${getSpreadTypeName(spreadType, false)} (${reading.cards_drawn.length} cards)
Cards:\n${cardsInfo}`;

    const ai = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
      ],
      temperature: 0.85,
      max_tokens: 700,
    });

    const firstInterpretation = ai.choices[0]?.message?.content || (
      isZh ? "我已为你完成抽牌与初步判断，我们可以开始自由对话细化你的问题啦。" : "I've completed the draw and a first pass. Let's chat freely to refine your question."
    );

    return {
      message: firstInterpretation,
      newState: {
        ...state,
        phase: "interpretation", // 直接进入解读与自由对话阶段
        userQuestion: message,
        suggestedDeck: deckType,
        suggestedSpread: spreadType,
        confirmedDeck: deckType,
        confirmedSpread: spreadType,
        cardsDrawn: reading.cards_drawn,
        currentCardIndex: reading.cards_drawn.length, // 标记已抽完
        readingUuid: reading.uuid,
        questionAnalysis: analysis
      },
      metadata: {
        autoFlow: true,
        suggestedDeck: deckType,
        suggestedSpread: spreadType
      }
    };
  } catch (error) {
    console.error("AI Error in welcome phase:", error);
    // 降级到预设回复
    return {
      message: isZh
        ? `谢谢你的分享。我能感受到这对你很重要。\n\n能告诉我更多关于你的问题吗？是关于感情、事业、还是人生选择？`
        : `Thank you for sharing. I can sense this is important to you.\n\nCan you tell me more about your question? Is it about relationships, career, or life choices?`,
      newState: { ...state, phase: "exploration" }
    };
  }
}

// 探索阶段 -> 继续探索或进入确认阶段
async function handleExplorationPhase(
  message: string,
  state: ConversationState,
  history: Message[],
  client: OpenAI,
  isZh: boolean
): Promise<{ message: string; newState: ConversationState; metadata?: any }> {
  
  try {
    // 分析用户的问题
    const analysis = analyzeQuestion(message);
    
    // 判断是否有足够信息推荐牌阵
  const conversationDepth = history.filter(m => m.role === "user").length;
  const shouldRecommend = true; // 直接推荐，合并流程

    if (shouldRecommend) {
    // 推荐牌组和牌阵
    const deckType = recommendDeck(analysis.questionType);
    const spreadType = analysis.suggestedSpread;

    const systemPrompt = isZh
      ? `你是丢丢，一只聪明可爱的小狗塔罗师。你已经用心理解了人类朋友的问题。

用户问题类型：${analysis.questionType}
关键主题：${analysis.keyThemes.join("、")}
情感背景：${analysis.emotionalContext}

你的任务：
1. 用可爱的语气总结你对问题的理解
2. 推荐合适的塔罗牌组："${getDeckTypeName(deckType, isZh)}"
3. 推荐合适的占卜方式："${getSpreadTypeName(spreadType, isZh)}"
4. 用简单的话解释为什么这个组合适合
5. 温柔地询问人类朋友是否同意

保持可爱、温暖、善解人意。回复控制在200字以内。`
      : `You are Diudiu, a smart and cute puppy tarot reader. You have carefully understood your human friend's question.

Question type: ${analysis.questionType}
Key themes: ${analysis.keyThemes.join(", ")}
Emotional context: ${analysis.emotionalContext}

Your task:
1. Summarize your understanding with a cute tone
2. Recommend an appropriate tarot deck: "${getDeckTypeName(deckType, isZh)}"
3. Recommend an appropriate spread: "${getSpreadTypeName(spreadType, isZh)}"
4. Explain why this combination suits in simple words
5. Gently ask if your human friend agrees

Stay cute, warm, and empathetic. Keep your response under 200 words.`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: "user", content: message }
      ],
      temperature: 0.8,
      max_tokens: 600,
    });

    const assistantMessage = response.choices[0]?.message?.content || (
      isZh ? "让我为你推荐合适的占卜方式。" : "Let me recommend a suitable reading for you."
    );

    return {
      message: assistantMessage,
      newState: {
        ...state,
        phase: "confirmation",
        userQuestion: message,
        suggestedDeck: deckType,
        suggestedSpread: spreadType,
        questionAnalysis: analysis
      },
      metadata: {
        suggestedDeck: deckType,
        suggestedSpread: spreadType
      }
    };
  } else {
    // 继续探索
    const systemPrompt = isZh
      ? `你是月影，资深塔罗师。用户正在分享更多关于他们问题的信息。

你的任务：
1. 表达深度理解和共情
2. 回应用户新分享的信息
3. 继续通过开放性问题引导用户探索
4. 帮助用户更清晰地认识自己的需求

保持温暖、耐心。回复控制在150字以内。`
      : `You are Moon Shadow, a senior tarot reader. The user is sharing more about their question.

Your task:
1. Express deep understanding and empathy
2. Respond to the new information shared
3. Continue guiding with open-ended questions
4. Help the user recognize their needs more clearly

Stay warm and patient. Keep your response under 150 words.`;

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: "user", content: message }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

      const assistantMessage = response.choices[0]?.message?.content || (
        isZh ? "我理解你的感受。能再告诉我一些吗？" : "I understand how you feel. Can you tell me more?"
      );

      return {
        message: assistantMessage,
        newState: state
      };
    }
  } catch (error) {
    console.error("AI Error in exploration phase:", error);
    // 降级到智能分析模式
    const analysis = analyzeQuestion(message);
    const conversationDepth = history.filter(m => m.role === "user").length;
    
    if (conversationDepth >= 2) {
      // 推荐牌组和牌阵
      const deckType = recommendDeck(analysis.questionType);
      const spreadType = analysis.suggestedSpread;

      return {
        message: isZh
          ? `我理解了你的问题。基于你分享的内容，我推荐使用"${getDeckTypeName(deckType, isZh)}"配合"${getSpreadTypeName(spreadType, isZh)}"来为你占卜。\n\n这个组合特别适合你的情况。你同意开始吗？`
          : `I understand your question. Based on what you've shared, I recommend using "${getDeckTypeName(deckType, isZh)}" with "${getSpreadTypeName(spreadType, isZh)}" for your reading.\n\nThis combination is particularly suitable for your situation. Shall we begin?`,
        newState: {
          ...state,
          phase: "confirmation",
          userQuestion: message,
          suggestedDeck: deckType,
          suggestedSpread: spreadType,
          questionAnalysis: analysis
        },
        metadata: {
          suggestedDeck: deckType,
          suggestedSpread: spreadType
        }
      };
    } else {
      return {
        message: isZh
          ? `我听到了你的关切。能再详细说说吗？比如这个问题让你最困扰的是什么方面？`
          : `I hear your concern. Can you elaborate? What aspect troubles you the most?`,
        newState: state
      };
    }
  }
}

// 确认阶段 -> 占卜阶段
async function handleConfirmationPhase(
  message: string,
  state: ConversationState,
  client: OpenAI,
  isZh: boolean
): Promise<{ message: string; newState: ConversationState; metadata?: any }> {
  
  const lowerMessage = message.toLowerCase();
  const isConfirmed = 
    lowerMessage.includes("好") || 
    lowerMessage.includes("可以") || 
    lowerMessage.includes("同意") ||
    lowerMessage.includes("yes") || 
    lowerMessage.includes("ok") || 
    lowerMessage.includes("agree") ||
    lowerMessage.includes("sure");

  if (isConfirmed) {
    // 执行占卜
    const deckType = state.suggestedDeck as DeckType;
    const spreadType = state.suggestedSpread as SpreadType;
    
    try {
      const reading = await performTarotReading(
        deckType,
        spreadType,
        state.userQuestion || message,
        getCardCountForSpread(spreadType)
      );

      const introMessage = isZh
        ? `✨ 很好。现在，让我们开始这次神圣的占卜之旅。\n\n我将为你抽取${reading.cards_drawn.length}张牌。每张牌都承载着宇宙的讯息，我会逐一为你揭示它们的含义。\n\n深呼吸，放松你的心灵。让我们一起看看第一张牌...`
        : `✨ Wonderful. Now, let's begin this sacred journey of divination.\n\nI will draw ${reading.cards_drawn.length} cards for you. Each card carries a message from the universe, and I will reveal their meanings one by one.\n\nTake a deep breath and relax your mind. Let's see the first card together...`;

      return {
        message: introMessage,
        newState: {
          ...state,
          phase: "reading",
          confirmedDeck: deckType,
          confirmedSpread: spreadType,
          cardsDrawn: reading.cards_drawn,
          currentCardIndex: 0,
          readingUuid: reading.uuid
        }
      };
    } catch (error) {
      console.error("Failed to perform reading:", error);
      return {
        message: isZh 
          ? "抱歉，占卜过程中出现了问题。让我们重新开始吧。" 
          : "I apologize, there was an issue during the reading. Let's start over.",
        newState: { phase: "welcome" }
      };
    }
  } else {
    // 用户想要调整
    try {
      const systemPrompt = isZh
        ? `你是月影，资深塔罗师。用户对你推荐的占卜方式有不同想法。

你的任务：
1. 理解用户的偏好或顾虑
2. 询问用户想要什么样的调整
3. 准备根据用户反馈调整推荐

保持开放、灵活。回复控制在100字以内。`
        : `You are Moon Shadow, a senior tarot reader. The user has different thoughts about your recommended reading.

Your task:
1. Understand the user's preferences or concerns
2. Ask what adjustments they'd like
3. Be ready to adjust recommendations based on feedback

Stay open and flexible. Keep your response under 100 words.`;

      const response = await client.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 400,
      });

      const assistantMessage = response.choices[0]?.message?.content || (
        isZh ? "当然，告诉我你的想法，我们可以调整。" : "Of course, tell me your thoughts and we can adjust."
      );

      return {
        message: assistantMessage,
        newState: state // 保持在确认阶段
      };
    } catch (error) {
      console.error("AI Error in confirmation adjustment:", error);
      return {
        message: isZh
          ? `当然，你想调整什么？告诉我你的想法。`
          : `Of course, what would you like to adjust? Tell me your thoughts.`,
        newState: state
      };
    }
  }
}

// 占卜阶段 -> 逐步揭示牌面
async function handleReadingPhase(
  message: string,
  state: ConversationState,
  client: OpenAI,
  isZh: boolean
): Promise<{ message: string; newState: ConversationState; metadata?: any }> {
  
  if (!state.cardsDrawn || state.currentCardIndex === undefined) {
    return {
      message: isZh ? "抱歉，出现了错误。" : "Sorry, an error occurred.",
      newState: { phase: "welcome" }
    };
  }

  const currentCard = state.cardsDrawn[state.currentCardIndex];
  const position = getCardPosition(state.confirmedSpread as SpreadType, state.currentCardIndex, isZh);
  const isLastCard = state.currentCardIndex === state.cardsDrawn.length - 1;

  // 生成这张牌的解读
  const systemPrompt = isZh
    ? `你是丢丢，一只充满智慧的小狗塔罗师。你正在为人类朋友揭示一张塔罗牌。

用户问题：${state.userQuestion}
牌位：${position}
牌名：${currentCard.card_name}
状态：${currentCard.is_reversed ? "逆位" : "正位"}
基本含义：${currentCard.is_reversed ? currentCard.reversed_meaning : currentCard.upright_meaning}

你的任务：
1. 用可爱而神秘的语气揭示这张牌
2. 用简单易懂的话解释这张牌的含义
3. 将牌意与人类朋友的问题温柔地结合
4. 提供温暖的支持和贴心的建议
5. ${isLastCard ? "告诉人类朋友所有牌都揭示完了，准备综合解读" : "告诉人类朋友可以继续看下一张牌"}

保持可爱、温暖、善解人意。回复控制在250字以内。`
    : `You are Diudiu, a wise and adorable puppy tarot reader. You are revealing a tarot card for your human friend.

User's question: ${state.userQuestion}
Position: ${position}
Card name: ${currentCard.card_name}
Orientation: ${currentCard.is_reversed ? "Reversed" : "Upright"}
Basic meaning: ${currentCard.is_reversed ? currentCard.reversed_meaning : currentCard.upright_meaning}

Your task:
1. Reveal this card with a cute and mysterious tone
2. Explain the card's meaning in simple, understandable words
3. Gently connect the card's meaning to your human friend's question
4. Provide warm support and caring advice
5. ${isLastCard ? "Tell your human friend all cards have been revealed and prepare for comprehensive interpretation" : "Tell your human friend they can continue to the next card when ready"}

Stay cute, warm, and empathetic. Keep your response under 250 words.`;

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.85,
    max_tokens: 800,
  });

  const assistantMessage = response.choices[0]?.message?.content || (
    isZh 
      ? `这张牌是${currentCard.card_name}（${currentCard.is_reversed ? "逆位" : "正位"}）。` 
      : `This card is ${currentCard.card_name} (${currentCard.is_reversed ? "Reversed" : "Upright"}).`
  );

  const nextIndex = state.currentCardIndex + 1;
  const newPhase = isLastCard ? "interpretation" : "reading";

  return {
    message: assistantMessage,
    newState: {
      ...state,
      phase: newPhase,
      currentCardIndex: nextIndex
    },
    metadata: {
      cardRevealed: currentCard,
      position: position
    }
  };
}

// 解读阶段 -> 综合解读和回答问题
async function handleInterpretationPhase(
  message: string,
  state: ConversationState,
  history: Message[],
  client: OpenAI,
  isZh: boolean
): Promise<{ message: string; newState: ConversationState; metadata?: any }> {
  
  if (!state.cardsDrawn) {
    return {
      message: isZh ? "抱歉，出现了错误。" : "Sorry, an error occurred.",
      newState: { phase: "welcome" }
    };
  }

  // 判断用户是否想要结束
  const lowerMessage = message.toLowerCase();
  const wantsToEnd = 
    lowerMessage.includes("谢谢") || 
    lowerMessage.includes("够了") ||
    lowerMessage.includes("明白了") ||
    lowerMessage.includes("thank") || 
    lowerMessage.includes("enough") ||
    lowerMessage.includes("understand");

  if (wantsToEnd) {
    const closingMessage = isZh
      ? `✨ 很高兴能为你提供指引，亲爱的。\n\n记住，塔罗牌只是照亮你内心智慧的明灯。真正的答案一直在你心中，你比自己想象的更有力量。\n\n愿这次占卜带给你启发和力量。如果你还有问题，我随时在这里。\n\n祝福你，愿你的旅程充满光明。🌙✨`
      : `✨ I'm glad I could provide guidance, dear friend.\n\nRemember, tarot cards are just a lamp that illuminates your inner wisdom. The true answers have always been within you, and you are more powerful than you imagine.\n\nMay this reading bring you inspiration and strength. If you have more questions, I'm always here.\n\nBlessings to you. May your journey be filled with light. 🌙✨`;

    return {
      message: closingMessage,
      newState: {
        ...state,
        phase: "conclusion"
      }
    };
  }

  // 继续解读或回答问题
  const cardsInfo = state.cardsDrawn.map((card, index) => ({
    position: getCardPosition(state.confirmedSpread as SpreadType, index, isZh),
    name: card.card_name,
    isReversed: card.is_reversed,
    meaning: card.is_reversed ? card.reversed_meaning : card.upright_meaning
  }));

  const systemPrompt = isZh
    ? `你是丢丢，一只智慧可爱的小狗塔罗师。所有牌面已经揭示完毕，现在人类朋友在询问或寻求更深入的理解。

用户问题：${state.userQuestion}
牌面信息：
${cardsInfo.map((c, i) => `${i + 1}. ${c.position}：${c.name}（${c.isReversed ? "逆位" : "正位"}）- ${c.meaning}`).join('\n')}

人类朋友现在说：${message}

你的任务：
1. 用温暖可爱的语气深度回应用户的提问或感受
2. 提供综合性的解读和洞察，用简单易懂的话
3. 将所有牌面的含义温柔地联系起来
4. 提供实用的建议和贴心的情感支持
5. 如果人类朋友还有疑问，继续解答；否则准备结束

保持可爱、温暖、善解人意。回复控制在300字以内。`
    : `You are Diudiu, a wise and cute puppy tarot reader. All cards have been revealed, and now your human friend is asking or seeking deeper understanding.

User's question: ${state.userQuestion}
Card information:
${cardsInfo.map((c, i) => `${i + 1}. ${c.position}: ${c.name} (${c.isReversed ? "Reversed" : "Upright"}) - ${c.meaning}`).join('\n')}

Human friend now says: ${message}

Your task:
1. Deeply respond to the user's question or feelings with a warm and cute tone
2. Provide comprehensive interpretation and insight in simple, understandable words
3. Gently connect the meanings of all cards
4. Provide practical advice and caring emotional support
5. Continue answering if your human friend has questions; otherwise prepare to conclude

Stay cute, warm, and empathetic. Keep your response under 300 words.`;

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      ...history.slice(-10).map(h => ({ role: h.role, content: h.content })), // 最近10条消息
      { role: "user", content: message }
    ],
    temperature: 0.85,
    max_tokens: 1000,
  });

  const assistantMessage = response.choices[0]?.message?.content || (
    isZh ? "让我为你深入解读..." : "Let me interpret this more deeply for you..."
  );

  return {
    message: assistantMessage,
    newState: state // 保持在解读阶段
  };
}

// 结束阶段
async function handleConclusionPhase(
  message: string,
  state: ConversationState,
  client: OpenAI,
  isZh: boolean
): Promise<{ message: string; newState: ConversationState; metadata?: any }> {
  
  const lowerMessage = message.toLowerCase();
  const wantsNewReading = 
    lowerMessage.includes("再") || 
    lowerMessage.includes("新") ||
    lowerMessage.includes("另") ||
    lowerMessage.includes("again") || 
    lowerMessage.includes("new") ||
    lowerMessage.includes("another");

  if (wantsNewReading) {
    return {
      message: isZh
        ? "✨ 当然！欢迎再次来到这个神圣的空间。\n\n请告诉我，这次是什么带你来到我这里？"
        : "✨ Of course! Welcome back to this sacred space.\n\nPlease tell me, what brings you here this time?",
      newState: { phase: "welcome" }
    };
  }

  return {
    message: isZh
      ? "愿你平安喜乐。如果需要新的占卜，随时告诉我。🌙✨"
      : "May you find peace and joy. If you need a new reading, just let me know. 🌙✨",
    newState: state
  };
}

// 辅助函数：根据问题类型推荐牌组
function recommendDeck(questionType: string): DeckType {
  const deckMap: { [key: string]: DeckType } = {
    yes_no: DeckType.Marseille,
    multiple_choice: DeckType.Marseille,
    relationship: DeckType.Waite,
    career: DeckType.Waite,
    spiritual: DeckType.Thoth,
    time_based: DeckType.Marseille,
    event_flow: DeckType.Waite,
    general: DeckType.Waite
  };
  
  return deckMap[questionType] || DeckType.Waite;
}

// 辅助函数：获取牌组名称
function getDeckTypeName(deckType: DeckType, isZh: boolean): string {
  const names: { [key in DeckType]: { zh: string; en: string } } = {
    [DeckType.Marseille]: { zh: "马赛塔罗", en: "Marseille Tarot" },
    [DeckType.GoldenDawn]: { zh: "黄金黎明", en: "Golden Dawn" },
    [DeckType.Waite]: { zh: "维特塔罗", en: "Rider-Waite Tarot" },
    [DeckType.Thoth]: { zh: "透特塔罗", en: "Thoth Tarot" }
  };
  
  return isZh ? names[deckType].zh : names[deckType].en;
}

// 辅助函数：获取牌阵名称
function getSpreadTypeName(spreadType: SpreadType, isZh: boolean): string {
  // 简化版本，实际应该有完整的映射
  const names: { [key: string]: { zh: string; en: string } } = {
    [SpreadType.ThreeCardTime]: { zh: "时间流三张牌", en: "Three Card Time Flow" },
    [SpreadType.YesNo]: { zh: "是否问题", en: "Yes/No Question" },
    [SpreadType.CelticCross]: { zh: "凯尔特十字", en: "Celtic Cross" },
    [SpreadType.LoveRelationship]: { zh: "爱情关系", en: "Love & Relationship" },
    [SpreadType.CareerPath]: { zh: "职业道路", en: "Career Path" },
    [SpreadType.TreeOfLife]: { zh: "生命之树", en: "Tree of Life" }
  };
  
  return names[spreadType] ? (isZh ? names[spreadType].zh : names[spreadType].en) : spreadType;
}

// 辅助函数：获取牌位描述
function getCardPosition(spreadType: SpreadType, index: number, isZh: boolean): string {
  // 简化版本
  const positions: { [key: string]: { zh: string[]; en: string[] } } = {
    [SpreadType.ThreeCardTime]: {
      zh: ["过去", "现在", "未来"],
      en: ["Past", "Present", "Future"]
    },
    [SpreadType.YesNo]: {
      zh: ["答案"],
      en: ["Answer"]
    }
  };
  
  const pos = positions[spreadType];
  if (pos) {
    return isZh ? pos.zh[index] : pos.en[index];
  }
  
  return isZh ? `位置 ${index + 1}` : `Position ${index + 1}`;
}

// 辅助函数：获取牌阵的牌数
function getCardCountForSpread(spreadType: SpreadType): number {
  const cardCountMap: { [key in SpreadType]: number } = {
    [SpreadType.ThreeCardTime]: 3,
    [SpreadType.YesNo]: 1,
    [SpreadType.DecisionCross]: 5,
    [SpreadType.SevenDay]: 7,
    [SpreadType.RelationshipMirror]: 4,
    [SpreadType.ProblemSolving]: 4,
    [SpreadType.ElementalBalance]: 4,
    [SpreadType.MarseillePentacle]: 5,
    [SpreadType.CelticCross]: 10,
    [SpreadType.LoveRelationship]: 6,
    [SpreadType.CareerPath]: 5,
    [SpreadType.Healing]: 4,
    [SpreadType.SeasonalForecast]: 4,
    [SpreadType.TwoPaths]: 6,
    [SpreadType.DreamInterpretation]: 3,
    [SpreadType.MoneyFlow]: 5,
    [SpreadType.TreeOfLife]: 10,
    [SpreadType.Hexagram]: 7,
    [SpreadType.PlanetaryInfluence]: 7,
    [SpreadType.ElementalInvocation]: 5,
    [SpreadType.CrowleyTriad]: 3,
    [SpreadType.WheelOfAeon]: 12,
    [SpreadType.ThothCross]: 7,
    [SpreadType.SpiritualAwakening]: 5,
    [SpreadType.PentagramRitual]: 5,
    [SpreadType.PlanetaryDays]: 7,
    [SpreadType.HgaCommunication]: 8,
    [SpreadType.ThreePillars]: 9,
    [SpreadType.Pathworking]: 10,
    [SpreadType.ElementalEvocation]: 5,
    [SpreadType.GdCross]: 10,
    [SpreadType.LunarPhase]: 8,
    [SpreadType.SingleCard]: 1,
    [SpreadType.ThreeCard]: 3,
    [SpreadType.Horseshoe]: 7
  };
  
  return cardCountMap[spreadType] || 1;
}

// 降级模式：不依赖 DeepSeek API 的预设回复
function handleFallbackMode(
  message: string,
  state: ConversationState,
  history: Message[],
  isZh: boolean
): { message: string; newState: ConversationState; metadata?: any } {
  
  const conversationDepth = history.filter(m => m.role === "user").length;

  switch (state.phase) {
    case "welcome":
      return {
        message: isZh
          ? `谢谢你的分享。我能感受到这对你很重要。\n\n能告诉我更多关于你的问题吗？是关于感情、事业、还是人生选择？`
          : `Thank you for sharing. I can sense this is important to you.\n\nCan you tell me more about your question? Is it about relationships, career, or life choices?`,
        newState: { ...state, phase: "exploration" }
      };

    case "exploration":
      // 分析问题并推荐
      const analysis = analyzeQuestion(message);
      const deckType = recommendDeck(analysis.questionType);
      const spreadType = analysis.suggestedSpread;

      if (conversationDepth >= 2) {
        return {
          message: isZh
            ? `我理解了你的问题。基于你分享的内容，我推荐使用"${getDeckTypeName(deckType, isZh)}"配合"${getSpreadTypeName(spreadType, isZh)}"来为你占卜。\n\n这个组合特别适合你的情况。你同意开始吗？`
            : `I understand your question. Based on what you've shared, I recommend using "${getDeckTypeName(deckType, isZh)}" with "${getSpreadTypeName(spreadType, isZh)}" for your reading.\n\nThis combination is particularly suitable for your situation. Shall we begin?`,
          newState: {
            ...state,
            phase: "confirmation",
            userQuestion: message,
            suggestedDeck: deckType,
            suggestedSpread: spreadType,
            questionAnalysis: analysis
          },
          metadata: { suggestedDeck: deckType, suggestedSpread: spreadType }
        };
      } else {
        return {
          message: isZh
            ? `我听到了你的关切。这确实是值得深思的问题。\n\n能再详细说说吗？比如这个问题让你最困扰的是什么方面？`
            : `I hear your concern. This is indeed a question worth contemplating.\n\nCan you elaborate? What aspect of this question troubles you the most?`,
          newState: state
        };
      }

    case "confirmation":
      const lowerMsg = message.toLowerCase();
      const confirmed = lowerMsg.includes("好") || lowerMsg.includes("可以") || 
                       lowerMsg.includes("同意") || lowerMsg.includes("yes") || 
                       lowerMsg.includes("ok") || lowerMsg.includes("sure");

      if (confirmed) {
        return {
          message: isZh
            ? `✨ 很好。让我们开始这次占卜。\n\n由于当前使用演示模式，我会为你提供基础的占卜体验。要获得完整的AI深度解读，请配置 DeepSeek API Key。\n\n📌 建议：\n1. 访问 https://platform.deepseek.com\n2. 注册并创建 API Key\n3. 配置到 .env.local 文件\n4. 重启服务器\n\n现在，你可以尝试使用"快速占卜"模式（点击返回选择模式），或者配置好API Key后再来体验完整的对话式占卜。`
            : `✨ Wonderful. Let's begin this reading.\n\nCurrently using demo mode with basic features. For full AI interpretation, please configure DeepSeek API Key.\n\n📌 Suggestions:\n1. Visit https://platform.deepseek.com\n2. Register and create an API Key\n3. Configure in .env.local file\n4. Restart server\n\nFor now, you can try "Quick Reading" mode (click back to select mode), or come back after configuring the API Key for full conversational experience.`,
          newState: {
            ...state,
            phase: "conclusion"
          }
        };
      } else {
        return {
          message: isZh
            ? `当然，你想调整什么？告诉我你的想法。`
            : `Of course, what would you like to adjust? Tell me your thoughts.`,
          newState: state
        };
      }

    case "reading":
    case "interpretation":
      return {
        message: isZh
          ? `继续对话中... 由于使用演示模式，功能有限。建议配置 DeepSeek API Key 获得完整体验。\n\n你可以访问 https://platform.deepseek.com 获取 API Key。`
          : `Continuing conversation... Using demo mode with limited features. Please configure DeepSeek API Key for full experience.\n\nVisit https://platform.deepseek.com to get your API Key.`,
        newState: state
      };

    default:
      return {
        message: isZh ? "让我们重新开始吧。" : "Let's start over.",
        newState: { phase: "welcome" }
      };
  }
}


import { NextRequest, NextResponse } from "next/server";
import { generateCardRevealAnimation } from "@/services/tarot";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { card, question, language } = body;

    if (!card || !question) {
      return NextResponse.json(
        { error: "Missing required fields: card, question" },
        { status: 400 }
      );
    }

    // 生成翻牌动画内容
    const animationContent = await generateCardRevealAnimation(
      card,
      question,
      language || 'zh'
    );

    return NextResponse.json({
      success: true,
      animationContent
    });

  } catch (error) {
    console.error("Error generating card reveal animation:", error);
    return NextResponse.json(
      { error: "Failed to generate animation content" },
      { status: 500 }
    );
  }
}






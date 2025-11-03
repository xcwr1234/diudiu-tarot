import { respData, respErr } from "@/lib/resp";
import { performTarotReading, generateInterpretation } from "@/services/tarot";
import { DeckType, SpreadType } from "@/types/tarot";

export async function POST(req: Request) {
  try {
    const { deck_type, spread_type, question, card_count, language } = await req.json();
    
    if (!deck_type || !spread_type || !question) {
      return respErr("Missing required parameters");
    }

    // Validate deck type - check if it's a valid string value
    const validDeckTypes = Object.values(DeckType);
    if (!validDeckTypes.includes(deck_type as DeckType)) {
      return respErr("Invalid deck type");
    }

    // Validate spread type - check if it's a valid string value
    const validSpreadTypes = Object.values(SpreadType);
    if (!validSpreadTypes.includes(spread_type as SpreadType)) {
      return respErr("Invalid spread type");
    }

    // Use provided card count or default to 1
    const numberOfCards = card_count || 1;
    
    // Use provided language or default to 'zh'
    const userLanguage = language || 'zh';

    const reading = await performTarotReading(deck_type, spread_type, question, numberOfCards);
    
    // Update the interpretation with the correct language
    const updatedReading = {
      ...reading,
      interpretation: await generateInterpretation(deck_type, spread_type, reading.cards_drawn, question, userLanguage)
    };
    
    return respData(updatedReading);
  } catch (e) {
    console.log("Tarot reading failed:", e);
    return respErr("Tarot reading failed");
  }
} 
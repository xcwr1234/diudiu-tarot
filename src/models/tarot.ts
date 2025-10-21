import { tarot_readings, tarot_cards } from "@/db/schema";
import { db } from "@/db";
import { desc, eq, and } from "drizzle-orm";
import { getUuid } from "@/lib/hash";
import { getIsoTimestr } from "@/lib/time";

export enum DeckType {
  Marseille = "marseille",
  GoldenDawn = "golden_dawn",
  Waite = "waite",
  Thoth = "thoth",
}

export enum SpreadType {
  // 马赛塔罗
  ThreeCardTime = "three_card_time",
  YesNo = "yes_no",
  DecisionCross = "decision_cross",
  SevenDay = "seven_day",
  RelationshipMirror = "relationship_mirror",
  ProblemSolving = "problem_solving",
  ElementalBalance = "elemental_balance",
  MarseillePentacle = "marseille_pentacle",
  
  // 维特塔罗
  CelticCross = "celtic_cross",
  LoveRelationship = "love_relationship",
  CareerPath = "career_path",
  Healing = "healing",
  SeasonalForecast = "seasonal_forecast",
  TwoPaths = "two_paths",
  DreamInterpretation = "dream_interpretation",
  MoneyFlow = "money_flow",
  
  // 透特塔罗
  TreeOfLife = "tree_of_life",
  Hexagram = "hexagram",
  PlanetaryInfluence = "planetary_influence",
  ElementalInvocation = "elemental_invocation",
  CrowleyTriad = "crowley_triad",
  WheelOfAeon = "wheel_of_aeon",
  ThothCross = "thoth_cross",
  SpiritualAwakening = "spiritual_awakening",
  
  // 黄金黎明塔罗
  PentagramRitual = "pentagram_ritual",
  PlanetaryDays = "planetary_days",
  HgaCommunication = "hga_communication",
  ThreePillars = "three_pillars",
  Pathworking = "pathworking",
  ElementalEvocation = "elemental_evocation",
  GdCross = "gd_cross",
  LunarPhase = "lunar_phase",
  
  // 保留旧的枚举值以保持向后兼容
  ThreeCard = "three_card",
  SingleCard = "single_card",
  Horseshoe = "horseshoe",
}

export async function insertTarotReading(
  data: typeof tarot_readings.$inferInsert
): Promise<typeof tarot_readings.$inferSelect | undefined> {
  const [reading] = await db().insert(tarot_readings).values(data).returning();
  return reading;
}

export async function findTarotReadingByUuid(
  uuid: string
): Promise<typeof tarot_readings.$inferSelect | undefined> {
  const [reading] = await db()
    .select()
    .from(tarot_readings)
    .where(eq(tarot_readings.uuid, uuid));
  return reading;
}

export async function getTarotReadingsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 10
): Promise<typeof tarot_readings.$inferSelect[]> {
  const offset = (page - 1) * limit;
  const readings = await db()
    .select()
    .from(tarot_readings)
    .where(eq(tarot_readings.user_uuid, user_uuid))
    .orderBy(desc(tarot_readings.created_at))
    .limit(limit)
    .offset(offset);
  return readings;
}

export async function getTarotCardsByDeckType(
  deck_type: DeckType
): Promise<typeof tarot_cards.$inferSelect[]> {
  const cards = await db()
    .select()
    .from(tarot_cards)
    .where(eq(tarot_cards.deck_type, deck_type))
    .orderBy(tarot_cards.card_number);
  return cards;
}

export async function getRandomTarotCards(
  deck_type: DeckType,
  count: number
): Promise<typeof tarot_cards.$inferSelect[]> {
  // This is a simplified random selection
  // In production, you might want to use a more sophisticated random algorithm
  const allCards = await getTarotCardsByDeckType(deck_type);
  const shuffled = allCards.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
} 
export interface TarotCard {
  id: number;
  card_name: string;
  card_number: number | null;
  suit: string | null;
  arcana_type: string | null;
  upright_meaning: string | null;
  reversed_meaning: string | null;
  keywords: string | null;
  image_url: string | null;
  is_reversed: boolean;
}

export interface TarotReading {
  uuid: string;
  deck_type: string;
  spread_type: string;
  question: string;
  cards_drawn: TarotCard[];
  interpretation: string;
  created_at: string;
}

export enum DeckType {
  Marseille = "marseille",
  GoldenDawn = "golden_dawn",
  Waite = "waite",
  Thoth = "thoth",
}

export enum SpreadType {
  SingleCard = "single_card",
  ThreeCard = "three_card",
  CelticCross = "celtic_cross",
  Horseshoe = "horseshoe",
} 
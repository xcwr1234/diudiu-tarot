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


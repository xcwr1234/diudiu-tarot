import { tarot_cards } from "@/db/schema";
import { db } from "@/db";
import { DeckType } from "@/models/tarot";

// Major Arcana cards for all decks
const majorArcana = [
  {
    card_name: "The Fool",
    card_number: 0,
    suit: null,
    arcana_type: "major",
    upright_meaning: "New beginnings, innocence, spontaneity, free spirit",
    reversed_meaning: "Recklessness, risk-taking, inconsideration",
    keywords: '["new beginnings", "innocence", "adventure"]',
    image_url: "/imgs/tarot/major/fool.jpg",
  },
  {
    card_name: "The Magician",
    card_number: 1,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Manifestation, resourcefulness, power, inspired action",
    reversed_meaning: "Manipulation, poor planning, untapped talents",
    keywords: '["manifestation", "power", "skill"]',
    image_url: "/imgs/tarot/major/magician.jpg",
  },
  {
    card_name: "The High Priestess",
    card_number: 2,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Intuition, sacred knowledge, divine feminine, subconscious mind",
    reversed_meaning: "Secrets, disconnected from intuition, withdrawal",
    keywords: '["intuition", "mystery", "wisdom"]',
    image_url: "/imgs/tarot/major/high-priestess.jpg",
  },
  {
    card_name: "The Empress",
    card_number: 3,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Femininity, beauty, nature, abundance, nurturing",
    reversed_meaning: "Creative block, dependence on others, emptiness",
    keywords: '["fertility", "abundance", "nurturing"]',
    image_url: "/imgs/tarot/major/empress.jpg",
  },
  {
    card_name: "The Emperor",
    card_number: 4,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Authority, establishment, structure, father figure",
    reversed_meaning: "Domination, excessive control, rigidity, inflexibility",
    keywords: '["authority", "structure", "leadership"]',
    image_url: "/imgs/tarot/major/emperor.jpg",
  },
  {
    card_name: "The Hierophant",
    card_number: 5,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Spiritual wisdom, religious beliefs, conformity, tradition",
    reversed_meaning: "Personal beliefs, freedom, challenging the status quo",
    keywords: '["tradition", "spirituality", "conformity"]',
    image_url: "/imgs/tarot/major/hierophant.jpg",
  },
  {
    card_name: "The Lovers",
    card_number: 6,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Love, harmony, relationships, values alignment, choices",
    reversed_meaning: "Self-love, disharmony, imbalance, misalignment of values",
    keywords: '["love", "harmony", "choices"]',
    image_url: "/imgs/tarot/major/lovers.jpg",
  },
  {
    card_name: "The Chariot",
    card_number: 7,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Control, willpower, determination, success, action",
    reversed_meaning: "Lack of control and direction, aggression",
    keywords: '["willpower", "determination", "success"]',
    image_url: "/imgs/tarot/major/chariot.jpg",
  },
  {
    card_name: "Strength",
    card_number: 8,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Inner strength, courage, persuasion, influence, compassion",
    reversed_meaning: "Self doubt, low energy, raw emotion",
    keywords: '["strength", "courage", "compassion"]',
    image_url: "/imgs/tarot/major/strength.jpg",
  },
  {
    card_name: "The Hermit",
    card_number: 9,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Soul-searching, introspection, being alone, inner guidance",
    reversed_meaning: "Isolation, loneliness, withdrawal",
    keywords: '["introspection", "guidance", "solitude"]',
    image_url: "/imgs/tarot/major/hermit.jpg",
  },
  {
    card_name: "Wheel of Fortune",
    card_number: 10,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Good luck, karma, life cycles, destiny, a turning point",
    reversed_meaning: "Bad luck, resistance to change, breaking cycles",
    keywords: '["change", "cycles", "destiny"]',
    image_url: "/imgs/tarot/major/wheel-of-fortune.jpg",
  },
  {
    card_name: "Justice",
    card_number: 11,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Justice, fairness, truth, cause and effect, law",
    reversed_meaning: "Unfairness, lack of accountability, dishonesty",
    keywords: '["justice", "fairness", "truth"]',
    image_url: "/imgs/tarot/major/justice.jpg",
  },
  {
    card_name: "The Hanged Man",
    card_number: 12,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Surrender, letting go, new perspectives, enlightenment",
    reversed_meaning: "Resistance, stalling, indecision, delay",
    keywords: '["surrender", "perspective", "sacrifice"]',
    image_url: "/imgs/tarot/major/hanged-man.jpg",
  },
  {
    card_name: "Death",
    card_number: 13,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Endings, change, transformation, transition",
    reversed_meaning: "Resistance to change, inability to move on, stagnation",
    keywords: '["transformation", "endings", "change"]',
    image_url: "/imgs/tarot/major/death.jpg",
  },
  {
    card_name: "Temperance",
    card_number: 14,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Balance, moderation, patience, purpose, meaning",
    reversed_meaning: "Imbalance, excess, self-healing, re-alignment",
    keywords: '["balance", "moderation", "patience"]',
    image_url: "/imgs/tarot/major/temperance.jpg",
  },
  {
    card_name: "The Devil",
    card_number: 15,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Shadow self, attachment, addiction, restriction, sexuality",
    reversed_meaning: "Releasing limiting beliefs, exploring dark thoughts, detachment",
    keywords: '["shadow", "attachment", "temptation"]',
    image_url: "/imgs/tarot/major/devil.jpg",
  },
  {
    card_name: "The Tower",
    card_number: 16,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Sudden change, upheaval, chaos, revelation, awakening",
    reversed_meaning: "Personal transformation, fear of change, averting disaster",
    keywords: '["sudden change", "chaos", "revelation"]',
    image_url: "/imgs/tarot/major/tower.jpg",
  },
  {
    card_name: "The Star",
    card_number: 17,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Hope, faith, purpose, renewal, spirituality",
    reversed_meaning: "Lack of faith, despair, self-trust, disconnection",
    keywords: '["hope", "faith", "inspiration"]',
    image_url: "/imgs/tarot/major/star.jpg",
  },
  {
    card_name: "The Moon",
    card_number: 18,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Illusion, fear, anxiety, subconscious, intuition",
    reversed_meaning: "Release of fear, repressed emotion, inner confusion",
    keywords: '["illusion", "intuition", "fear"]',
    image_url: "/imgs/tarot/major/moon.jpg",
  },
  {
    card_name: "The Sun",
    card_number: 19,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Positivity, fun, warmth, success, vitality",
    reversed_meaning: "Inner child, feeling down, overly optimistic",
    keywords: '["joy", "success", "vitality"]',
    image_url: "/imgs/tarot/major/sun.jpg",
  },
  {
    card_name: "Judgement",
    card_number: 20,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Judgement, rebirth, inner calling, absolution",
    reversed_meaning: "Self-doubt, inner critic, ignoring the call",
    keywords: '["rebirth", "judgement", "calling"]',
    image_url: "/imgs/tarot/major/judgement.jpg",
  },
  {
    card_name: "The World",
    card_number: 21,
    suit: null,
    arcana_type: "major",
    upright_meaning: "Completion, integration, accomplishment, travel",
    reversed_meaning: "Seeking personal closure, short-cut to success",
    keywords: '["completion", "integration", "achievement"]',
    image_url: "/imgs/tarot/major/world.jpg",
  },
];

// Minor Arcana - Wands
const wands = [
  {
    card_name: "Ace of Wands",
    card_number: 1,
    suit: "Wands",
    arcana_type: "minor",
    upright_meaning: "Creation, willpower, inspiration, desire",
    reversed_meaning: "Lack of energy, lack of passion, delays",
    keywords: '["inspiration", "new opportunities", "growth"]',
    image_url: "/imgs/tarot/minor/wands-ace.jpg",
  },
  {
    card_name: "Two of Wands",
    card_number: 2,
    suit: "Wands",
    arcana_type: "minor",
    upright_meaning: "Future planning, making decisions, leaving comfort zone",
    reversed_meaning: "Personal goals, inner alignment, fear of unknown",
    keywords: '["planning", "decisions", "discovery"]',
    image_url: "/imgs/tarot/minor/wands-2.jpg",
  },
  {
    card_name: "Three of Wands",
    card_number: 3,
    suit: "Wands",
    arcana_type: "minor",
    upright_meaning: "Looking ahead, expansion, rapid growth, adventure",
    reversed_meaning: "Obstacles, delays, frustration, lack of direction",
    keywords: '["expansion", "adventure", "growth"]',
    image_url: "/imgs/tarot/minor/wands-3.jpg",
  },
];

// Minor Arcana - Cups
const cups = [
  {
    card_name: "Ace of Cups",
    card_number: 1,
    suit: "Cups",
    arcana_type: "minor",
    upright_meaning: "New feelings, intuition, spirituality, love",
    reversed_meaning: "Emotional loss, blocked creativity, emptiness",
    keywords: '["love", "intuition", "spirituality"]',
    image_url: "/imgs/tarot/minor/cups-ace.jpg",
  },
  {
    card_name: "Two of Cups",
    card_number: 2,
    suit: "Cups",
    arcana_type: "minor",
    upright_meaning: "Unity, partnership, connection, mutual attraction",
    reversed_meaning: "Broken relationships, disharmony, distrust",
    keywords: '["partnership", "unity", "connection"]',
    image_url: "/imgs/tarot/minor/cups-2.jpg",
  },
  {
    card_name: "Three of Cups",
    card_number: 3,
    suit: "Cups",
    arcana_type: "minor",
    upright_meaning: "Celebration, friendship, creativity, collaborations",
    reversed_meaning: "Independence, alone time, hardcore partying",
    keywords: '["celebration", "friendship", "creativity"]',
    image_url: "/imgs/tarot/minor/cups-3.jpg",
  },
];

// Minor Arcana - Swords
const swords = [
  {
    card_name: "Ace of Swords",
    card_number: 1,
    suit: "Swords",
    arcana_type: "minor",
    upright_meaning: "Breakthrough, clarity, sharp mind, new ideas",
    reversed_meaning: "Lack of clarity, confusion, lack of truth",
    keywords: '["clarity", "breakthrough", "truth"]',
    image_url: "/imgs/tarot/minor/swords-ace.jpg",
  },
  {
    card_name: "Two of Swords",
    card_number: 2,
    suit: "Swords",
    arcana_type: "minor",
    upright_meaning: "Difficult decisions, weighing up options, an impasse",
    reversed_meaning: "Indecision, confusion, information overload",
    keywords: '["decisions", "balance", "indecision"]',
    image_url: "/imgs/tarot/minor/swords-2.jpg",
  },
  {
    card_name: "Three of Swords",
    card_number: 3,
    suit: "Swords",
    arcana_type: "minor",
    upright_meaning: "Heartbreak, emotional pain, sorrow, grief",
    reversed_meaning: "Negative self-talk, releasing pain, optimism",
    keywords: '["heartbreak", "pain", "sorrow"]',
    image_url: "/imgs/tarot/minor/swords-3.jpg",
  },
];

// Minor Arcana - Pentacles
const pentacles = [
  {
    card_name: "Ace of Pentacles",
    card_number: 1,
    suit: "Pentacles",
    arcana_type: "minor",
    upright_meaning: "New financial opportunity, abundance, grounding",
    reversed_meaning: "Lost opportunity, scarcity mindset, disorganization",
    keywords: '["opportunity", "abundance", "grounding"]',
    image_url: "/imgs/tarot/minor/pentacles-ace.jpg",
  },
  {
    card_name: "Two of Pentacles",
    card_number: 2,
    suit: "Pentacles",
    arcana_type: "minor",
    upright_meaning: "Multiple priorities, time management, prioritization",
    reversed_meaning: "Over-commitment, disorganization, reprioritization",
    keywords: '["balance", "priorities", "adaptability"]',
    image_url: "/imgs/tarot/minor/pentacles-2.jpg",
  },
  {
    card_name: "Three of Pentacles",
    card_number: 3,
    suit: "Pentacles",
    arcana_type: "minor",
    upright_meaning: "Teamwork, collaboration, skill, learning",
    reversed_meaning: "Disharmony, misalignment, working alone",
    keywords: '["teamwork", "collaboration", "skill"]',
    image_url: "/imgs/tarot/minor/pentacles-3.jpg",
  },
];

async function initializeTarotData() {
  console.log("Initializing tarot card data...");
  
  const allCards = [
    ...majorArcana,
    ...wands,
    ...cups,
    ...swords,
    ...pentacles,
  ];

  // Insert cards for each deck type
  for (const deckType of Object.values(DeckType)) {
    console.log(`Inserting cards for ${deckType} deck...`);
    
    for (const card of allCards) {
      try {
        await db().insert(tarot_cards).values({
          ...card,
          deck_type: deckType,
          created_at: new Date(),
        });
      } catch (error) {
        // Skip if card already exists
        console.log(`Card ${card.card_name} already exists for ${deckType}`);
      }
    }
  }
  
  console.log("Tarot card data initialization complete!");
}

// Run the initialization
initializeTarotData().catch(console.error); 
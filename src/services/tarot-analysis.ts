import { DeckType, SpreadType } from "@/models/tarot";
import { TarotCard } from "./tarot";

export { DeckType, SpreadType };

// ��������ö��
export enum QuestionType {
  YES_NO = "yes_no",           // �Ƿ�������
  MULTIPLE_CHOICE = "multiple_choice", // ����ѡ����
  EVENT_FLOW = "event_flow",   // �¼�������
  TIME_BASED = "time_based",   // ʱ����
  RELATIONSHIP = "relationship", // ��ϵ��
  CAREER = "career",           // ��ҵ��
  HEALTH = "health",           // ������
  SPIRITUAL = "spiritual",     // ������
  GENERAL = "general"          // һ��������
}

// ����������
export interface QuestionAnalysis {
  originalQuestion: string;
  questionType: QuestionType;
  transformedQuestion: string;
  suggestedSpread: SpreadType;
  emotionalContext: string;
  keyThemes: string[];
  urgency: "low" | "medium" | "high";
}

// ����������
export interface CardInterpretation {
  card: TarotCard;
  position: string;
  basicMeaning: string;
  contextualMeaning: string;
  emotionalGuidance: string;
  practicalAdvice: string;
  reversedInsight?: string;
}

// ����������
export interface ComprehensiveReading {
  questionAnalysis: QuestionAnalysis;
  cardInterpretations: CardInterpretation[];
  overallGuidance: string;
  practicalSteps: string[];
  emotionalSupport: string;
  followUpQuestions: string[];
}


/**
 * �����û����Ⲣȷ����������
 */
export function analyzeQuestion(question: string): QuestionAnalysis {
  const lowerQuestion = question.toLowerCase();
  
  // �����������
  let questionType: QuestionType = QuestionType.GENERAL;
  let transformedQuestion = question;
  let emotionalContext = "";
  let keyThemes: string[] = [];
  let urgency: "low" | "medium" | "high" = "medium";
  
  // �Ƿ���������
  if (isYesNoQuestion(lowerQuestion)) {
    questionType = QuestionType.YES_NO;
    transformedQuestion = transformToYesNoQuestion(question);
    emotionalContext = "Ѱ����ȷ�𰸺�ȷ����";
    keyThemes = ["����", "ȷ��", "����"];
    urgency = "high";
  }
  // ��ϵ��������
  else if (isRelationshipQuestion(lowerQuestion)) {
    questionType = QuestionType.RELATIONSHIP;
    emotionalContext = "��ע������Ӻ��˼ʻ���";
    keyThemes = ["����", "����", "��ͥ", "��ͨ"];
    urgency = "high";
  }
  // ��ҵ��������
  else if (isCareerQuestion(lowerQuestion)) {
    questionType = QuestionType.CAREER;
    emotionalContext = "��עְҵ��չ��δ���滮";
    keyThemes = ["��ҵ", "����", "��չ", "Ŀ��"];
    urgency = "medium";
  }
  // ����ѡ����������
  else if (isMultipleChoiceQuestion(lowerQuestion)) {
    questionType = QuestionType.MULTIPLE_CHOICE;
    emotionalContext = "����ѡ�����ѣ���ҪȨ������";
    keyThemes = ["ѡ��", "����", "Ȩ��", "����"];
    urgency = "high";
  }
  // ʱ����������
  else if (isTimeBasedQuestion(lowerQuestion)) {
    questionType = QuestionType.TIME_BASED;
    emotionalContext = "��עʱ��ڵ��δ������";
    keyThemes = ["ʱ��", "δ��", "ʱ��", "��չ"];
    urgency = "medium";
  }
  // �¼�������������
  else if (isEventFlowQuestion(lowerQuestion)) {
    questionType = QuestionType.EVENT_FLOW;
    emotionalContext = "��ע�¼���չ�ͽ��";
    keyThemes = ["��չ", "���", "����", "�仯"];
    urgency = "medium";
  }
  // ������������
  else if (isSpiritualQuestion(lowerQuestion)) {
    questionType = QuestionType.SPIRITUAL;
    emotionalContext = "Ѱ����ָ�������ڳɳ�";
    keyThemes = ["����", "�ɳ�", "�ǻ�", "����"];
    urgency = "low";
  }
  
  // �������������Ƽ�����
  const suggestedSpread = recommendSpread(questionType, keyThemes);
  
  return {
    originalQuestion: question,
    questionType,
    transformedQuestion,
    suggestedSpread,
    emotionalContext,
    keyThemes,
    urgency
  };
}


/**
 * ����Ƿ�Ϊ�Ƿ�������
 */
function isYesNoQuestion(question: string): boolean {
  const yesNoPatterns = [
    /�᲻��/, /�Ƿ�/, /�ܲ���/, /�ɲ�����/, /�᲻��/, /�᲻��/,
    /����/, /����/, /������/, /����/, /����/, /����/,
    /�᲻��ɹ�/, /�᲻��ʧ��/, /�᲻�����/, /�᲻�Ḵ��/,
    /�᲻�ῼ��/, /�᲻��ͨ��/, /�᲻��¼ȡ/, /�᲻����ְ/,
    /�᲻�ᷢ��/, /�᲻�ὡ��/, /�᲻��ƽ��/
  ];
  
  return yesNoPatterns.some(pattern => pattern.test(question));
}

/**
 * ����Ƿ�Ϊ��ϵ������
 */
function isRelationshipQuestion(question: string): boolean {
  const relationshipKeywords = [
    "����", "����", "����", "��ϵ", "����", "����", "���", "���",
    "ϲ��", "��", "����", "������", "Ů����", "�Ϲ�", "����",
    "����", "����", "����", "��ĸ", "����", "ͬ��", "��˾"
  ];
  
  return relationshipKeywords.some(keyword => question.includes(keyword));
}

/**
 * ����Ƿ�Ϊ��ҵ������
 */
function isCareerQuestion(question: string): boolean {
  const careerKeywords = [
    "����", "��ҵ", "ְҵ", "��ְ", "��н", "����", "��ҵ",
    "����", "¼ȡ", "����", "ѧϰ", "����", "��չ", "Ŀ��",
    "�ϰ�", "ͬ��", "�Ŷ�", "��Ŀ", "ҵ��", "�ɹ�"
  ];
  
  return careerKeywords.some(keyword => question.includes(keyword));
}

/**
 * ����Ƿ�Ϊ����ѡ��������
 */
function isMultipleChoiceQuestion(question: string): boolean {
  const choicePatterns = [
    /ѡ��/, /ѡ�ĸ�/, /�ĸ���/, /��ô��/, /���ѡ��/,
    /A����B/, /��������Ǹ�/, /ȥ���ǲ�ȥ/, /�����ǲ���/,
    /Ӧ��/, /����/, /�Ƽ�/, /�ĸ���/
  ];
  
  return choicePatterns.some(pattern => pattern.test(question));
}

/**
 * ����Ƿ�Ϊʱ��������
 */
function isTimeBasedQuestion(question: string): boolean {
  const timeKeywords = [
    "ʲôʱ��", "��ʱ", "���", "δ��", "����", "�Ժ�",
    "����", "����", "����", "����", "����", "����",
    "ʱ��", "ʱ��", "�׶�", "ʱ��"
  ];
  
  return timeKeywords.some(keyword => question.includes(keyword));
}

/**
 * ����Ƿ�Ϊ�¼�����������
 */
function isEventFlowQuestion(question: string): boolean {
  const flowKeywords = [
    "������", "�����", "���", "���", "��չ", "����",
    "����", "�仯", "��չ", "����", "����", "����"
  ];
  
  return flowKeywords.some(keyword => question.includes(keyword));
}

/**
 * ����Ƿ�Ϊ����������
 */
function isSpiritualQuestion(question: string): boolean {
  const spiritualKeywords = [
    "����", "����", "����", "����", "�ǻ�", "����",
    "���", "����", "���", "ҵ��", "�ֻ�", "����",
    "����", "Ƶ��", "��", "ڤ��", "����"
  ];
  
  return spiritualKeywords.some(keyword => question.includes(keyword));
}

/**
 * 将问题转换为是否问题格式
 */
function transformToYesNoQuestion(question: string): string {
  return question;
}

/**
 * 根据问题类型推荐合适的牌阵
 */
function recommendSpread(questionType: QuestionType, keyThemes: string[]): SpreadType {
  const spreadMap: { [key: string]: SpreadType } = {
    yes_no: SpreadType.YesNo,
    multiple_choice: SpreadType.DecisionCross,
    event_flow: SpreadType.ThreeCardTime,
    time_based: SpreadType.SevenDay,
    relationship: SpreadType.LoveRelationship,
    career: SpreadType.CareerPath,
    health: SpreadType.Healing,
    spiritual: SpreadType.SpiritualAwakening,
    general: SpreadType.ThreeCardTime
  };
  
  return spreadMap[questionType] || SpreadType.ThreeCardTime;
}

/**
 * 根据问题类型推荐合适的牌组
 */
export function recommendDeckForQuestion(questionType: QuestionType): DeckType {
  const deckMap: { [key: string]: DeckType } = {
    yes_no: DeckType.Marseille,
    multiple_choice: DeckType.Marseille,
    event_flow: DeckType.Marseille,
    time_based: DeckType.Marseille,
    relationship: DeckType.Waite,
    career: DeckType.Waite,
    health: DeckType.Waite,
    spiritual: DeckType.Thoth,
    general: DeckType.Waite
  };
  
  return deckMap[questionType] || DeckType.Waite;
}

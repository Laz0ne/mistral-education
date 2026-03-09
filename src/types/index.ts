export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  subjects: string[];
  apiKey: string;
  darkMode: boolean;
  avatar?: string;
}

export interface Grade {
  subject: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface SubjectGrade {
  subject: string;
  grades: Grade[];
  average: number;
  level: 'needs-improvement' | 'medium' | 'good';
  color: string;
}

export type MessageRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Exercise {
  id: string;
  subject: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  status: 'todo' | 'in-progress' | 'completed';
  type: 'quiz' | 'text';
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PlannerEvent {
  id: string;
  type: 'exam' | 'homework' | 'revision';
  subject: string;
  title: string;
  date: string;
  time: string;
  description: string;
  completed: boolean;
  color: string;
}

export interface ProgressData {
  date: string;
  score: number;
}

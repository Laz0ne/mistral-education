import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '../types';
import { getMockChatMessages } from '../data/mockExercises';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  questionsCount: number;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  incrementQuestions: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: getMockChatMessages(),
      isLoading: false,
      questionsCount: 0,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearMessages: () => set({ messages: getMockChatMessages() }),
      incrementQuestions: () =>
        set((state) => ({ questionsCount: state.questionsCount + 1 })),
    }),
    {
      name: 'mistral-chat-store',
      partialize: (state) => ({
        messages: state.messages,
        questionsCount: state.questionsCount,
      }),
    }
  )
);

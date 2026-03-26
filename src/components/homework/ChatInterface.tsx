import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Trash2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { FileUpload } from './FileUpload';
import { useChatStore } from '../../stores/useChatStore';
import { useStudentStore } from '../../stores/useStudentStore';
import { sendMessage } from '../../services/mistralApi';
import { generateId } from '../../utils/helpers';
import { ChatMessage } from '../../types';

const QUICK_SUGGESTIONS = [
  'Explique-moi les fractions',
  'Comment résoudre une équation du 2nd degré ?',
  'Résume la Révolution française',
  'C\'est quoi la photosynthèse ?',
  'Explique le Present Perfect',
];

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mr-2 mt-1">
      M
    </div>
    <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-tl-sm">
      <div className="flex gap-1 items-center h-4">
        <div className="typing-dot w-2 h-2 bg-[#F7931A] rounded-full" />
        <div className="typing-dot w-2 h-2 bg-[#F7931A] rounded-full" />
        <div className="typing-dot w-2 h-2 bg-[#F7931A] rounded-full" />
      </div>
    </div>
  </div>
);

export const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, isLoading, addMessage, setLoading, clearMessages, incrementQuestions } =
    useChatStore();
  const { student } = useStudentStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    incrementQuestions();
    setInputValue('');
    setLoading(true);

    try {
      const allMessages = [...messages, userMessage];
      const response = await sendMessage(allMessages, student.apiKey);

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content:
          'Désolé, une erreur s\'est produite. Vérifiez votre clé API dans les paramètres ou réessayez dans quelques instants.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend(inputValue);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    void handleSend(suggestion);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && !isLoading && (
        <div className="px-4 pb-3">
          <p className="text-xs text-gray-400 dark:text-white/40 mb-2">Suggestions :</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <motion.button
                key={suggestion}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestion(suggestion)}
                className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:border-[#F7931A]/40 hover:bg-[#F7931A]/5 transition-all"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-end gap-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-3 py-2 focus-within:border-[#F7931A]/40 transition-colors">
          <FileUpload />
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pose ta question ici..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 resize-none focus:outline-none py-1.5 max-h-32 scrollbar-thin"
            style={{ minHeight: '36px' }}
          />
          <div className="flex items-center gap-1 pb-1">
            <button
              onClick={clearMessages}
              className="p-1.5 rounded-lg text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
              title="Effacer la conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => void handleSend(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="p-2 rounded-xl bg-gradient-to-r from-[#F7931A] to-[#FF6B00] text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        <p className="text-xs text-gray-300 dark:text-white/20 text-center mt-2">
          Entrée pour envoyer · Shift+Entrée pour nouvelle ligne
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { ChatInterface } from '../components/homework/ChatInterface';
import { useStudentStore } from '../stores/useStudentStore';
import { AlertCircle } from 'lucide-react';
import { Trans } from 'react-i18next';

export const HomeworkHelp: React.FC = () => {
  const { student } = useStudentStore();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {!student.apiKey && (
        <div className="mx-6 mt-4 p-3 rounded-xl bg-[#F7931A]/10 border border-[#F7931A]/20 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-[#F7931A] flex-shrink-0" />
          <p className="text-xs text-[#F7931A]">
            <Trans
              i18nKey="homework.demoMode"
              components={{
                settingsLink: <a href="/settings" className="underline font-medium" />,
              }}
            />
          </p>
        </div>
      )}
      <div className="flex-1 min-h-0 m-4 mt-3 backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <ChatInterface />
      </div>
    </div>
  );
};

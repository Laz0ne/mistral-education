import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useStudentStore } from '../../stores/useStudentStore';
import { getGradeLabel } from '../../utils/helpers';

const pageTitleKeys: Record<string, string> = {
  '/': 'nav.dashboard',
  '/homework': 'nav.homework',
  '/weaknesses': 'nav.weaknesses',
  '/exercises': 'nav.exercises',
  '/planner': 'nav.planner',
  '/settings': 'nav.settings',
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { student, updateStudent } = useStudentStore();
  const { t, i18n } = useTranslation();
  const title = t(pageTitleKeys[location.pathname] ?? 'app.title');
  const currentLanguage = i18n.resolvedLanguage ?? 'fr';

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#0A0A0B]/50 backdrop-blur-sm sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:block hidden">{title}</h1>
      <div className="lg:hidden w-8" /> {/* Spacer for mobile menu button */}

      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F7931A] rounded-full" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={() => updateStudent({ darkMode: !student.darkMode })}
          className="p-2 rounded-xl text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
        >
          {student.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => void i18n.changeLanguage(currentLanguage === 'fr' ? 'en' : 'fr')}
          className="flex items-center gap-1 p-2 rounded-xl text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          title={currentLanguage === 'fr' ? 'Switch to English' : 'Basculer en français'}
        >
          <Globe className="w-5 h-5" />
          <span className="text-xs font-semibold">{currentLanguage.toUpperCase()}</span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-xs text-gray-400 dark:text-white/40">{getGradeLabel(student.grade)}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
            {student.firstName[0]}{student.lastName[0]}
          </div>
        </div>
      </div>
    </header>
  );
};

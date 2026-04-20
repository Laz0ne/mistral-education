import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { PlannerEvent } from '../../types';
import { useTranslation } from 'react-i18next';
import { getSubjectLabel } from '../../utils/helpers';

interface CalendarProps {
  onEventClick?: (event: PlannerEvent) => void;
}

function getWeekDates(baseDate: Date): Date[] {
  const d = new Date(baseDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(d);
    date.setDate(d.getDate() + i);
    return date;
  });
}

export const Calendar: React.FC<CalendarProps> = ({ onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events } = usePlannerStore();
  const { t, i18n } = useTranslation();
  const days = i18n.resolvedLanguage === 'en'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const weekDates = getWeekDates(currentDate);

  const goToPrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const goToNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const getEventsForDate = (date: Date): PlannerEvent[] => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter((e) => e.date === dateStr);
  };

  const locale = i18n.resolvedLanguage === 'en' ? 'en-US' : 'fr-FR';
  const weekLabel = `${weekDates[0]?.toLocaleDateString(locale, { day: '2-digit', month: 'short' })} – ${weekDates[6]?.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}`;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{weekLabel}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrevWeek}
            className="p-1.5 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            {t('planner.todayButton')}
          </button>
          <button
            onClick={goToNextWeek}
            className="p-1.5 rounded-lg text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400 dark:text-white/40 py-2">
            {day}
          </div>
        ))}

        {weekDates.map((date, i) => {
          const dateStr = date.toISOString().split('T')[0];
          const isToday = dateStr === today;
          const dayEvents = getEventsForDate(date);

          return (
            <div
              key={i}
              className={`min-h-20 rounded-xl p-1.5 border transition-colors ${
                isToday
                  ? 'border-[#F7931A]/40 bg-[#F7931A]/5'
                  : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/3 hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              <p
                className={`text-xs font-semibold mb-1 text-center ${
                  isToday ? 'text-[#F7931A]' : 'text-gray-400 dark:text-white/50'
                }`}
              >
                {date.getDate()}
              </p>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <motion.button
                    key={event.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onEventClick?.(event)}
                    className="w-full text-left px-1.5 py-0.5 rounded text-xs truncate"
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                      border: `1px solid ${event.color}30`,
                      opacity: event.completed ? 0.5 : 1,
                      textDecoration: event.completed ? 'line-through' : 'none',
                    }}
                  >
                     {t(`planner.typeLabels.${event.type}`)} · {getSubjectLabel(event.subject)}
                   </motion.button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-gray-300 dark:text-white/30 text-center">+{dayEvents.length - 3}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

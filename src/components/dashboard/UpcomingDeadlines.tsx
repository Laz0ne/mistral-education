import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getDaysUntil, getSubjectColor } from '../../utils/helpers';

const typeLabels: Record<string, string> = {
  exam: 'Examen',
  homework: 'Devoir',
  revision: 'Révision',
};

export const UpcomingDeadlines: React.FC = () => {
  const { events } = usePlannerStore();

  const upcoming = events
    .filter((e) => !e.completed && getDaysUntil(e.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-[#F7931A]" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Prochaines échéances</h3>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-white/40 text-center py-6">
          Aucune échéance à venir 🎉
        </p>
      ) : (
        <div className="space-y-3">
          {upcoming.map((event, i) => {
            const days = getDaysUntil(event.date);
            const isUrgent = days <= 2;
            const color = getSubjectColor(event.subject);

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{event.title}</p>
                  <p className="text-xs text-gray-400 dark:text-white/40">
                    {event.subject} · {typeLabels[event.type]}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {isUrgent && (
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  <div
                    className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                      isUrgent
                        ? 'bg-red-400/10 text-red-400'
                        : days <= 5
                        ? 'bg-yellow-400/10 text-yellow-400'
                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `${days}j`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Trash2, Clock, BookOpen } from 'lucide-react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { getDaysUntil, formatDate } from '../../utils/helpers';

const typeLabels: Record<string, string> = {
  exam: '📝 Examen',
  homework: '📋 Devoir',
  revision: '📚 Révision',
};

export const StudyPlan: React.FC = () => {
  const { events, toggleComplete, deleteEvent } = usePlannerStore();

  const upcomingEvents = events
    .filter((e) => getDaysUntil(e.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter((e) => getDaysUntil(e.date) < 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const nextExam = upcomingEvents.find((e) => e.type === 'exam' && !e.completed);
  const daysToExam = nextExam ? getDaysUntil(nextExam.date) : null;

  return (
    <div className="space-y-4">
      {/* Countdown to next exam */}
      {nextExam && daysToExam !== null && (
        <div className="backdrop-blur-xl bg-gradient-to-r from-[#F7931A]/10 to-[#FF6B00]/10 border border-[#F7931A]/20 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/60">Prochain examen</p>
              <p className="text-base font-semibold text-white">{nextExam.title}</p>
              <p className="text-sm font-bold text-[#F7931A]">
                {daysToExam === 0 ? "Aujourd'hui !" : daysToExam === 1 ? 'Demain !' : `Dans ${daysToExam} jours`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming tasks */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-base font-semibold text-white mb-4">Plan d'études</h3>

        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-6">
            Aucun événement à venir. Ajoutez des échéances pour planifier vos révisions 📅
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.map((event, i) => {
              const days = getDaysUntil(event.date);
              const isUrgent = days <= 2 && !event.completed;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                    event.completed
                      ? 'border-white/5 bg-white/3 opacity-50'
                      : isUrgent
                      ? 'border-red-500/20 bg-red-500/5'
                      : 'border-white/5 bg-white/3 hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => toggleComplete(event.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {event.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#F7931A]" />
                    ) : (
                      <Square className="w-5 h-5 text-white/30" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-medium"
                        style={{ color: event.color }}
                      >
                        {typeLabels[event.type]}
                      </span>
                      <span className="text-xs text-white/40">{event.subject}</span>
                    </div>
                    <p
                      className={`text-sm font-medium ${
                        event.completed ? 'line-through text-white/40' : 'text-white'
                      }`}
                    >
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-xs text-white/40 truncate mt-0.5">{event.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-white/40">
                        <Clock className="w-3 h-3" />
                        {formatDate(event.date)} à {event.time}
                      </div>
                      {!event.completed && (
                        <span
                          className={`text-xs font-medium ${
                            days === 0
                              ? 'text-red-400'
                              : days <= 2
                              ? 'text-orange-400'
                              : days <= 5
                              ? 'text-yellow-400'
                              : 'text-white/40'
                          }`}
                        >
                          {days === 0 ? "Aujourd'hui" : days === 1 ? 'Demain' : `Dans ${days}j`}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-1 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past events */}
      {pastEvents.length > 0 && (
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white/50 mb-3">Historique récent</h3>
          <div className="space-y-2">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-2.5 rounded-xl opacity-40"
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-sm text-white flex-1">{event.title}</span>
                <span className="text-xs text-white/40">{formatDate(event.date)}</span>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-1 rounded text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

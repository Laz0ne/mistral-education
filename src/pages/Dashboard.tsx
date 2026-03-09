import React from 'react';
import { motion } from 'framer-motion';
import { useStudentStore } from '../stores/useStudentStore';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { WeaknessChart } from '../components/dashboard/WeaknessChart';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { useChatStore } from '../stores/useChatStore';
import { useExerciseStore } from '../stores/useExerciseStore';

export const Dashboard: React.FC = () => {
  const { student } = useStudentStore();
  const { messages } = useChatStore();
  const { exercises } = useExerciseStore();

  const recentMessages = messages.filter((m) => m.role === 'user').slice(-3);
  const recentExercises = exercises
    .filter((e) => e.status !== 'todo')
    .slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            Bonjour, {student.firstName} 👋
          </h2>
          <p className="text-sm text-white/50 mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-xs text-white/40">{student.school}</p>
          <p className="text-xs text-white/40">{student.grade}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <DashboardStats />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProgressChart />
        <WeaknessChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UpcomingDeadlines />

        {/* Recent activity */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-white mb-4">Activité récente</h3>
          {recentMessages.length === 0 && recentExercises.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-6">
              Pas d'activité récente. Commencez à utiliser la plateforme !
            </p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                >
                  <div className="w-7 h-7 rounded-full bg-[#F7931A]/20 flex items-center justify-center flex-shrink-0 text-xs">
                    💬
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/40 mb-0.5">Question posée</p>
                    <p className="text-sm text-white/70 truncate">{msg.content}</p>
                  </div>
                </div>
              ))}
              {recentExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5"
                >
                  <div className="w-7 h-7 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 text-xs">
                    ✅
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-white/40 mb-0.5">
                      Exercice{' '}
                      {ex.status === 'completed' ? 'terminé' : 'en cours'}
                    </p>
                    <p className="text-sm text-white/70 truncate">{ex.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, TrendingUp, Flame } from 'lucide-react';
import { useStudentStore } from '../../stores/useStudentStore';
import { useChatStore } from '../../stores/useChatStore';
import { useExerciseStore } from '../../stores/useExerciseStore';
import { calculateAverage } from '../../utils/helpers';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, color, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-white/50 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {sub && <p className="text-xs text-gray-400 dark:text-white/40 mt-1">{sub}</p>}
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}30` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
  </motion.div>
);

export const DashboardStats: React.FC = () => {
  const { subjectGrades } = useStudentStore();
  const { questionsCount } = useChatStore();
  const { completedCount, streak } = useExerciseStore();

  const avg = calculateAverage(subjectGrades.map((g) => g.average));

  const stats = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Questions posées',
      value: questionsCount,
      sub: 'à Mistral AI',
      color: '#F7931A',
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Exercices complétés',
      value: completedCount,
      sub: 'exercices réussis',
      color: '#10B981',
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Moyenne générale',
      value: `${avg}/20`,
      sub: avg >= 14 ? 'Excellent !' : avg >= 10 ? 'Bien !' : 'À améliorer',
      color: '#8B5CF6',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      label: 'Jours de streak',
      value: streak,
      sub: streak > 0 ? 'continuez comme ça !' : 'commencez aujourd\'hui !',
      color: '#EF4444',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { Exercise } from '../../types';
import { Badge } from '../ui/Badge';
import { getSubjectIcon, getSubjectColor, getSubjectLabel } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
  index?: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onStart, index = 0 }) => {
  const { t } = useTranslation();
  const difficultyConfig = {
    easy: { label: t('difficulty.easy'), variant: 'success' as const },
    medium: { label: t('difficulty.medium'), variant: 'warning' as const },
    hard: { label: t('difficulty.hard'), variant: 'danger' as const },
  };
  const statusConfig = {
    todo: { label: t('status.todo'), variant: 'default' as const },
    'in-progress': { label: t('status.in-progress'), variant: 'info' as const },
    completed: { label: t('status.completed'), variant: 'success' as const },
  };
  const diff = difficultyConfig[exercise.difficulty];
  const status = statusConfig[exercise.status];
  const color = getSubjectColor(exercise.subject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 hover:bg-gray-50 dark:hover:bg-white/[0.08] hover:border-gray-300 dark:hover:border-white/20 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            {getSubjectIcon(exercise.subject)}
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color }}>{getSubjectLabel(exercise.subject)}</p>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{exercise.title}</h3>
          </div>
        </div>
        <Badge variant={status.variant} size="sm">{status.label}</Badge>
      </div>

      <p className="text-xs text-gray-500 dark:text-white/50 mb-3 line-clamp-2">{exercise.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={diff.variant} size="sm">{diff.label}</Badge>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/40">
            <Clock className="w-3 h-3" />
            <span>{exercise.estimatedTime} {t('common.minutes')}</span>
          </div>
          <span className="text-xs text-gray-300 dark:text-white/30">· {t('common.questionCount', { count: exercise.questions.length })}</span>
        </div>
        <button
          onClick={() => onStart(exercise)}
          className="flex items-center gap-1 text-xs font-medium text-[#F7931A] hover:text-[#FF6B00] transition-colors"
        >
          {exercise.status === 'completed' ? t('exercises.redo') : t('exercises.start')}
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

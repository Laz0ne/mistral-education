import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { Exercise } from '../../types';
import { Badge } from '../ui/Badge';
import { getSubjectIcon, getSubjectColor } from '../../utils/helpers';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: (exercise: Exercise) => void;
  index?: number;
}

const difficultyConfig = {
  easy: { label: 'Facile', variant: 'success' as const },
  medium: { label: 'Moyen', variant: 'warning' as const },
  hard: { label: 'Difficile', variant: 'danger' as const },
};

const statusConfig = {
  todo: { label: 'À faire', variant: 'default' as const },
  'in-progress': { label: 'En cours', variant: 'info' as const },
  completed: { label: 'Terminé', variant: 'success' as const },
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onStart, index = 0 }) => {
  const diff = difficultyConfig[exercise.difficulty];
  const status = statusConfig[exercise.status];
  const color = getSubjectColor(exercise.subject);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.08] hover:border-white/20 transition-all group"
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
            <p className="text-xs font-medium" style={{ color }}>{exercise.subject}</p>
            <h3 className="text-sm font-semibold text-white leading-tight">{exercise.title}</h3>
          </div>
        </div>
        <Badge variant={status.variant} size="sm">{status.label}</Badge>
      </div>

      <p className="text-xs text-white/50 mb-3 line-clamp-2">{exercise.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={diff.variant} size="sm">{diff.label}</Badge>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            <span>{exercise.estimatedTime} min</span>
          </div>
          <span className="text-xs text-white/30">· {exercise.questions.length} questions</span>
        </div>
        <button
          onClick={() => onStart(exercise)}
          className="flex items-center gap-1 text-xs font-medium text-[#F7931A] hover:text-[#FF6B00] transition-colors"
        >
          {exercise.status === 'completed' ? 'Refaire' : 'Commencer'}
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

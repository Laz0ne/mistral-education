import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ExerciseList } from '../components/exercises/ExerciseList';
import { QuizMode } from '../components/exercises/QuizMode';
import { useExerciseStore } from '../stores/useExerciseStore';
import { Exercise } from '../types';
import { useTranslation } from 'react-i18next';
import { getSubjectLabel } from '../utils/helpers';

export const Exercises: React.FC = () => {
  const { currentExercise, setCurrentExercise } = useExerciseStore();
  const { t } = useTranslation();

  const handleStart = (exercise: Exercise) => {
    setCurrentExercise(exercise);
  };

  const handleClose = () => {
    setCurrentExercise(null);
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {currentExercise ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentExercise.title}</h2>
                <p className="text-sm text-gray-500 dark:text-white/50">{getSubjectLabel(currentExercise.subject)}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm dark:shadow-none">
              <QuizMode exercise={currentExercise} onClose={handleClose} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
              <div className="mb-5">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('exercises.title')}</h2>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                  {t('exercises.subtitle')}
                </p>
              </div>
            <ExerciseList onStart={handleStart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

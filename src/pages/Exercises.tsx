import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ExerciseList } from '../components/exercises/ExerciseList';
import { QuizMode } from '../components/exercises/QuizMode';
import { useExerciseStore } from '../stores/useExerciseStore';
import { Exercise } from '../types';

export const Exercises: React.FC = () => {
  const { currentExercise, setCurrentExercise } = useExerciseStore();

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
                <h2 className="text-xl font-bold text-white">{currentExercise.title}</h2>
                <p className="text-sm text-white/50">{currentExercise.subject}</p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
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
              <h2 className="text-xl font-bold text-white">Exercices</h2>
              <p className="text-sm text-white/50 mt-1">
                Entraînez-vous sur des exercices adaptés à votre niveau.
              </p>
            </div>
            <ExerciseList onStart={handleStart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

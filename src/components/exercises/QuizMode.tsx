import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Exercise } from '../../types';
import { useExerciseStore } from '../../stores/useExerciseStore';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

interface QuizModeProps {
  exercise: Exercise;
  onClose: () => void;
}

type AnswerState = 'pending' | 'correct' | 'incorrect';

export const QuizMode: React.FC<QuizModeProps> = ({ exercise, onClose }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>('pending');
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { updateExerciseStatus, incrementCompleted, updateStreak } = useExerciseStore();

  const question = exercise.questions[currentIndex];
  const total = exercise.questions.length;
  const isLast = currentIndex === total - 1;

  const handleSelect = (index: number) => {
    if (answerState !== 'pending') return;
    setSelectedOption(index);
    const correct = index === question?.correctAnswer;
    setAnswerState(correct ? 'correct' : 'incorrect');
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      updateExerciseStatus(exercise.id, 'completed');
      if (exercise.status !== 'completed') {
        incrementCompleted();
        updateStreak();
      }
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswerState('pending');
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswerState('pending');
    setScore(0);
    setFinished(false);
  };

  const percentage = Math.round((score / total) * 100);

  const getOptionStyle = (index: number): string => {
    if (answerState === 'pending') {
      return selectedOption === index
        ? 'border-[#F7931A]/60 bg-[#F7931A]/10 text-gray-900 dark:text-white'
        : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-white/80 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-100 dark:hover:bg-white/[0.08]';
    }
    if (index === question?.correctAnswer) {
      return 'border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-300';
    }
    if (index === selectedOption && answerState === 'incorrect') {
      return 'border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-300';
    }
    return 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/3 text-gray-300 dark:text-white/30';
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center mb-5"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {percentage >= 80 ? t('exercises.excellent') : percentage >= 60 ? t('exercises.wellDone') : t('exercises.keepLearning')}
        </h2>
        <p className="text-gray-500 dark:text-white/60 mb-6">
          {t('exercises.result', { score, total, percentage, title: exercise.title })}
        </p>

        <div className="w-full max-w-xs mb-6">
          <ProgressBar value={score} max={total} showValue size="lg" />
        </div>

        <p className="text-sm text-gray-500 dark:text-white/50 mb-6">
          {percentage === 100
            ? t('exercises.perfect')
            : percentage >= 80
            ? t('exercises.veryGood')
            : percentage >= 60
            ? t('exercises.good')
            : t('exercises.encourage')}
        </p>

        <div className="flex gap-3">
          <Button variant="secondary" icon={<RotateCcw className="w-4 h-4" />} onClick={handleRestart}>
            {t('exercises.restart')}
          </Button>
          <Button variant="primary" onClick={onClose}>
            {t('exercises.back')}
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!question) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500 dark:text-white/50">
            {t('exercises.question', { current: currentIndex + 1, total })}
          </span>
          <span className="text-sm font-medium text-[#F7931A]">
            {t('exercises.score', { count: score })}
          </span>
        </div>
        <ProgressBar value={currentIndex + 1} max={total} />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
            {question.text}
          </p>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={answerState === 'pending' ? { scale: 1.01 } : {}}
                whileTap={answerState === 'pending' ? { scale: 0.99 } : {}}
                onClick={() => handleSelect(index)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${getOptionStyle(index)}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    answerState === 'pending'
                      ? 'bg-gray-200 dark:bg-white/10'
                      : index === question.correctAnswer
                      ? 'bg-green-500/30 text-green-700 dark:text-green-300'
                      : index === selectedOption
                      ? 'bg-red-500/30 text-red-700 dark:text-red-300'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-white/20'
                  }`}
                >
                  {optionLetters[index]}
                </span>
                <span className="text-sm">{option}</span>
                {answerState !== 'pending' && index === question.correctAnswer && (
                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto flex-shrink-0" />
                )}
                {answerState !== 'pending' && index === selectedOption && index !== question.correctAnswer && (
                  <XCircle className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answerState !== 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border mb-5 ${
                  answerState === 'correct'
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <p
                  className={`text-sm font-semibold mb-1 ${
                    answerState === 'correct' ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {answerState === 'correct' ? t('exercises.correct') : t('exercises.incorrect')}
                </p>
                <p className="text-sm text-gray-600 dark:text-white/70">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {answerState !== 'pending' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <Button
                variant="primary"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNext}
              >
                 {isLast ? t('exercises.seeResults') : t('exercises.nextQuestion')}
               </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

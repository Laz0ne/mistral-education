import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';
import { useExerciseStore } from '../../stores/useExerciseStore';
import { Exercise } from '../../types';
import { useTranslation } from 'react-i18next';
import { getSubjectLabel } from '../../utils/helpers';

interface ExerciseListProps {
  onStart: (exercise: Exercise) => void;
}

const SUBJECTS = ['all', 'Maths', 'Français', 'Histoire', 'Physique', 'Anglais', 'SVT'];
const DIFFICULTIES = ['all', 'easy', 'medium', 'hard'];
const STATUSES = ['all', 'todo', 'in-progress', 'completed'];

export const ExerciseList: React.FC<ExerciseListProps> = ({ onStart }) => {
  const { exercises } = useExerciseStore();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const matchSearch =
        search === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase());
      const matchSubject = subject === 'all' || e.subject === subject;
      const matchDifficulty = difficulty === 'all' || e.difficulty === difficulty;
      const matchStatus = status === 'all' || e.status === status;
      return matchSearch && matchSubject && matchDifficulty && matchStatus;
    });
  }, [exercises, search, subject, difficulty, status]);

  const FilterChips = ({
    values,
    selected,
    onChange,
    labelMap,
  }: {
    values: string[];
    selected: string;
    onChange: (v: string) => void;
    labelMap?: Record<string, string>;
  }) => (
    <div className="flex flex-wrap gap-1.5">
      {values.map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`text-xs px-3 py-1.5 rounded-full transition-all ${
            selected === v
              ? 'bg-gradient-to-r from-[#F7931A] to-[#FF6B00] text-white'
              : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20'
          }`}
        >
          {labelMap ? (labelMap[v] ?? v) : v === 'all' ? t('exercises.all') : getSubjectLabel(v)}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Filters */}
      <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-4 mb-5 space-y-3 shadow-sm dark:shadow-none">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('exercises.search')}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-[#F7931A]/40"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-white/40 w-16 flex-shrink-0">{t('exercises.subject')}</span>
            <FilterChips values={SUBJECTS} selected={subject} onChange={setSubject} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-white/40 w-16 flex-shrink-0">{t('exercises.level')}</span>
            <FilterChips
              values={DIFFICULTIES}
              selected={difficulty}
              onChange={setDifficulty}
              labelMap={{ all: t('difficulty.all'), easy: t('difficulty.easy'), medium: t('difficulty.medium'), hard: t('difficulty.hard') }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 dark:text-white/40 w-16 flex-shrink-0">{t('exercises.status')}</span>
            <FilterChips
              values={STATUSES}
              selected={status}
              onChange={setStatus}
              labelMap={{ all: t('exercises.all'), todo: t('status.todo'), 'in-progress': t('status.in-progress'), completed: t('status.completed') }}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-gray-400 dark:text-white/40 mb-3">{t('exercises.results', { count: filtered.length })}</p>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-300 dark:text-white/30">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">{t('exercises.none')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((exercise, i) => (
            <ExerciseCard key={exercise.id} exercise={exercise} onStart={onStart} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

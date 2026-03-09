import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { ExerciseCard } from './ExerciseCard';
import { useExerciseStore } from '../../stores/useExerciseStore';
import { Exercise } from '../../types';

interface ExerciseListProps {
  onStart: (exercise: Exercise) => void;
}

const SUBJECTS = ['Tous', 'Maths', 'Français', 'Histoire', 'Physique', 'Anglais', 'SVT'];
const DIFFICULTIES = ['Toutes', 'easy', 'medium', 'hard'];
const STATUSES = ['Tous', 'todo', 'in-progress', 'completed'];

const difficultyLabel: Record<string, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

const statusLabel: Record<string, string> = {
  todo: 'À faire',
  'in-progress': 'En cours',
  completed: 'Terminé',
};

export const ExerciseList: React.FC<ExerciseListProps> = ({ onStart }) => {
  const { exercises } = useExerciseStore();
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('Tous');
  const [difficulty, setDifficulty] = useState('Toutes');
  const [status, setStatus] = useState('Tous');

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      const matchSearch =
        search === '' ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.subject.toLowerCase().includes(search.toLowerCase());
      const matchSubject = subject === 'Tous' || e.subject === subject;
      const matchDifficulty = difficulty === 'Toutes' || e.difficulty === difficulty;
      const matchStatus = status === 'Tous' || e.status === status;
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
              : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20'
          }`}
        >
          {labelMap ? (labelMap[v] ?? v) : v}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 mb-5 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un exercice..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F7931A]/40"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 w-16 flex-shrink-0">Matière</span>
            <FilterChips values={SUBJECTS} selected={subject} onChange={setSubject} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 w-16 flex-shrink-0">Niveau</span>
            <FilterChips values={DIFFICULTIES} selected={difficulty} onChange={setDifficulty} labelMap={difficultyLabel} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 w-16 flex-shrink-0">Statut</span>
            <FilterChips values={STATUSES} selected={status} onChange={setStatus} labelMap={statusLabel} />
          </div>
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-white/40 mb-3">{filtered.length} exercice(s) trouvé(s)</p>
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-white/30">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm">Aucun exercice ne correspond à votre recherche</p>
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

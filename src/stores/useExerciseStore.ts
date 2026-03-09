import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Exercise } from '../types';
import { mockExercises } from '../data/mockExercises';

interface ExerciseStore {
  exercises: Exercise[];
  completedCount: number;
  currentExercise: Exercise | null;
  streak: number;
  updateExerciseStatus: (id: string, status: Exercise['status']) => void;
  setCurrentExercise: (exercise: Exercise | null) => void;
  incrementCompleted: () => void;
  updateStreak: () => void;
}

export const useExerciseStore = create<ExerciseStore>()(
  persist(
    (set) => ({
      exercises: mockExercises,
      completedCount: mockExercises.filter((e) => e.status === 'completed').length,
      currentExercise: null,
      streak: 3,
      updateExerciseStatus: (id, status) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, status } : e
          ),
        })),
      setCurrentExercise: (exercise) => set({ currentExercise: exercise }),
      incrementCompleted: () =>
        set((state) => ({ completedCount: state.completedCount + 1 })),
      updateStreak: () =>
        set((state) => ({ streak: state.streak + 1 })),
    }),
    {
      name: 'mistral-exercise-store',
      partialize: (state) => ({
        exercises: state.exercises,
        completedCount: state.completedCount,
        streak: state.streak,
      }),
    }
  )
);

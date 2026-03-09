import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, SubjectGrade, ProgressData } from '../types';
import { getLevelFromScore, getSubjectColor } from '../utils/helpers';

interface StudentStore {
  student: Student;
  subjectGrades: SubjectGrade[];
  progressData: ProgressData[];
  updateStudent: (data: Partial<Student>) => void;
  updateGrades: (grades: SubjectGrade[]) => void;
  addProgressData: (data: ProgressData) => void;
}

const defaultGrades: SubjectGrade[] = [
  { subject: 'Maths', grades: [{ subject: 'Maths', score: 12, maxScore: 20, date: '2024-02-01' }], average: 12, level: getLevelFromScore(12), color: getSubjectColor('Maths') },
  { subject: 'Français', grades: [{ subject: 'Français', score: 15, maxScore: 20, date: '2024-02-01' }], average: 15, level: getLevelFromScore(15), color: getSubjectColor('Français') },
  { subject: 'Histoire', grades: [{ subject: 'Histoire', score: 11, maxScore: 20, date: '2024-02-01' }], average: 11, level: getLevelFromScore(11), color: getSubjectColor('Histoire') },
  { subject: 'Physique', grades: [{ subject: 'Physique', score: 9, maxScore: 20, date: '2024-02-01' }], average: 9, level: getLevelFromScore(9), color: getSubjectColor('Physique') },
  { subject: 'Anglais', grades: [{ subject: 'Anglais', score: 16, maxScore: 20, date: '2024-02-01' }], average: 16, level: getLevelFromScore(16), color: getSubjectColor('Anglais') },
  { subject: 'SVT', grades: [{ subject: 'SVT', score: 13, maxScore: 20, date: '2024-02-01' }], average: 13, level: getLevelFromScore(13), color: getSubjectColor('SVT') },
];

function generateProgressData(): ProgressData[] {
  const data: ProgressData[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split('T')[0] ?? '',
      score: Math.round((10 + Math.random() * 6) * 10) / 10,
    });
  }
  return data;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      student: {
        id: 'student-1',
        firstName: 'Lucas',
        lastName: 'Martin',
        grade: 'Seconde',
        school: 'Lycée Henri IV',
        subjects: ['Maths', 'Français', 'Histoire', 'Physique', 'Anglais', 'SVT'],
        apiKey: '',
        darkMode: true,
      },
      subjectGrades: defaultGrades,
      progressData: generateProgressData(),
      updateStudent: (data) =>
        set((state) => ({ student: { ...state.student, ...data } })),
      updateGrades: (grades) => set({ subjectGrades: grades }),
      addProgressData: (data) =>
        set((state) => ({ progressData: [...state.progressData, data] })),
    }),
    {
      name: 'mistral-student-store',
    }
  )
);

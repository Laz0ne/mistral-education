import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Save } from 'lucide-react';
import { useStudentStore } from '../../stores/useStudentStore';
import { SubjectGrade } from '../../types';
import { getLevelFromScore, getSubjectColor, getSubjectIcon, getSubjectLabel } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

const AVAILABLE_SUBJECTS = [
  'Maths', 'Français', 'Histoire', 'Physique', 'Anglais', 'SVT',
  'Philosophie', 'SES', 'Informatique',
];

export const GradeInput: React.FC = () => {
  const { subjectGrades, updateGrades } = useStudentStore();
  const { t } = useTranslation();
  const [localGrades, setLocalGrades] = useState<SubjectGrade[]>(subjectGrades);
  const [saved, setSaved] = useState(false);

  const handleScoreChange = (subject: string, score: number) => {
    setLocalGrades((prev) =>
      prev.map((g) =>
        g.subject === subject
          ? {
              ...g,
              average: score,
              level: getLevelFromScore(score),
              grades: [{ subject, score, maxScore: 20, date: new Date().toISOString().split('T')[0] ?? '' }],
            }
          : g
      )
    );
    setSaved(false);
  };

  const handleAddSubject = (subject: string) => {
    if (localGrades.find((g) => g.subject === subject)) return;
    const newGrade: SubjectGrade = {
      subject,
      grades: [{ subject, score: 10, maxScore: 20, date: new Date().toISOString().split('T')[0] ?? '' }],
      average: 10,
      level: getLevelFromScore(10),
      color: getSubjectColor(subject),
    };
    setLocalGrades((prev) => [...prev, newGrade]);
    setSaved(false);
  };

  const handleRemove = (subject: string) => {
    setLocalGrades((prev) => prev.filter((g) => g.subject !== subject));
    setSaved(false);
  };

  const handleSave = () => {
    updateGrades(localGrades);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addableSubjects = AVAILABLE_SUBJECTS.filter(
    (s) => !localGrades.find((g) => g.subject === s)
  );

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('weakness.gradesTitle')}</h3>
        <Button
          variant={saved ? 'secondary' : 'primary'}
          size="sm"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          {saved ? t('common.saved') : t('common.save')}
        </Button>
      </div>

      <div className="space-y-4">
        {localGrades.map((grade, i) => (
          <motion.div
            key={grade.subject}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="text-xl w-8 text-center">{getSubjectIcon(grade.subject)}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-white/80 w-24 flex-shrink-0">
              {getSubjectLabel(grade.subject)}
            </span>
            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={grade.average}
                onChange={(e) => handleScoreChange(grade.subject, Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
            <div
              className="text-sm font-bold w-14 text-center py-1 rounded-lg"
              style={{
                color: grade.color,
                backgroundColor: `${grade.color}15`,
              }}
            >
              {grade.average}/20
            </div>
            <button
              onClick={() => handleRemove(grade.subject)}
              className="p-1.5 rounded-lg text-gray-300 dark:text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      {addableSubjects.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
          <p className="text-xs text-gray-400 dark:text-white/40 mb-2">{t('weakness.addSubject')}</p>
          <div className="flex flex-wrap gap-2">
            {addableSubjects.map((subject) => (
              <button
                key={subject}
                onClick={() => handleAddSubject(subject)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-[#F7931A]/40 transition-all"
              >
                <Plus className="w-3 h-3" />
                {getSubjectLabel(subject)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

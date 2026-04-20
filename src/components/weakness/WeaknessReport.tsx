import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { useStudentStore } from '../../stores/useStudentStore';
import { calculateAverage, getSubjectLabel } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

export const WeaknessReport: React.FC = () => {
  const { subjectGrades } = useStudentStore();
  const { t } = useTranslation();

  const weakSubjects = subjectGrades.filter((g) => g.level === 'needs-improvement');
  const mediumSubjects = subjectGrades.filter((g) => g.level === 'medium');
  const goodSubjects = subjectGrades.filter((g) => g.level === 'good');
  const avg = calculateAverage(subjectGrades.map((g) => g.average));

  const getRecommendation = (subject: string, score: number): string => {
    const subjectKeyMap: Record<string, string> = {
      Maths: 'maths',
      Français: 'french',
      Histoire: 'history',
      Physique: 'physics',
      Anglais: 'english',
      SVT: 'biology',
    };
    const key = subjectKeyMap[subject];
    if (key) {
      return t(`weakness.recommendations.${key}`, { score });
    }
    return t('weakness.recommendations.generic', { subject: getSubjectLabel(subject), score });
  };

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb className="w-5 h-5 text-[#F7931A]" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('weakness.reportTitle')}</h3>
      </div>

      {/* Overall summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#F7931A]/10 to-[#FF6B00]/10 border border-[#F7931A]/20 mb-5">
        <p className="text-sm text-gray-700 dark:text-white/80">
          <span className="font-semibold text-[#F7931A]">{t('weakness.globalAverage', { avg })}</span>
          {' — '}
          {avg >= 16
            ? t('weakness.feedback.excellent')
            : avg >= 14
            ? t('weakness.feedback.veryGood')
            : avg >= 12
            ? t('weakness.feedback.good')
            : avg >= 10
            ? t('weakness.feedback.fair')
            : t('weakness.feedback.needsWork')}
        </p>
      </div>

      {/* Weak subjects */}
      {weakSubjects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h4 className="text-sm font-semibold text-red-400">{t('weakness.priority')}</h4>
          </div>
          <div className="space-y-3">
            {weakSubjects.map((g, i) => (
              <motion.div
                key={g.subject}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-xl bg-red-400/5 border border-red-400/20"
              >
                <p className="text-sm font-medium text-red-300 mb-1">
                  {getSubjectLabel(g.subject)} — {g.average}/20
                </p>
                <p className="text-xs text-gray-500 dark:text-white/60">{getRecommendation(g.subject, g.average)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Medium subjects */}
      {mediumSubjects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-yellow-400" />
            <h4 className="text-sm font-semibold text-yellow-400">{t('weakness.toConsolidate')}</h4>
          </div>
          <div className="space-y-3">
            {mediumSubjects.map((g, i) => (
              <motion.div
                key={g.subject}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/20"
              >
                <p className="text-sm font-medium text-yellow-300 mb-1">
                  {getSubjectLabel(g.subject)} — {g.average}/20
                </p>
                <p className="text-xs text-gray-500 dark:text-white/60">
                  {t('weakness.mediumRec')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Good subjects */}
      {goodSubjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <h4 className="text-sm font-semibold text-green-400">{t('weakness.strengths')}</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {goodSubjects.map((g) => (
              <div
                key={g.subject}
                className="px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-xs text-green-300 font-medium"
              >
                {getSubjectLabel(g.subject)} ({g.average}/20) ✓
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

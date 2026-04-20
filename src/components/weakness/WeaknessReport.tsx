import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { useStudentStore } from '../../stores/useStudentStore';
import { calculateAverage, getSubjectLabel } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

export const WeaknessReport: React.FC = () => {
  const { subjectGrades } = useStudentStore();
  const { t, i18n } = useTranslation();

  const weakSubjects = subjectGrades.filter((g) => g.level === 'needs-improvement');
  const mediumSubjects = subjectGrades.filter((g) => g.level === 'medium');
  const goodSubjects = subjectGrades.filter((g) => g.level === 'good');
  const avg = calculateAverage(subjectGrades.map((g) => g.average));

  const getRecommendation = (subject: string, score: number): string => {
    if (i18n.resolvedLanguage === 'en') {
      const recs: Record<string, string> = {
        Maths: `With ${score}/20 in Math, focus on foundational exercises. Review core concepts and practice daily. Use Homework Help whenever you are blocked.`,
        Français: `In French (${score}/20), practice regular reading and text analysis. Review rhetorical devices and essay structure.`,
        Histoire: `In History (${score}/20), build chronological revision sheets. Memorize key dates and event sequences.`,
        Physique: `In Physics (${score}/20), understand formulas before applying them. Draw diagrams and solve problems step by step.`,
        Anglais: `In English (${score}/20), practice daily with podcasts and videos. Review tenses and thematic vocabulary.`,
        SVT: `In Biology (${score}/20), use diagrams to memorize cycles and structures. Practical exercises will help reinforce understanding.`,
      };
      return recs[subject] ?? `For ${getSubjectLabel(subject)} (${score}/20), review basics and practice regularly to improve.`;
    }

    const recs: Record<string, string> = {
      Maths: `Avec ${score}/20 en Maths, concentre-toi sur les exercices de base. Reprends les fondamentaux et fais des exercices quotidiens. Utilise l'aide aux devoirs pour poser tes questions.`,
      Français: `En Français (${score}/20), travaille la lecture régulière et l'analyse de textes. Révise les figures de style et la structure des dissertations.`,
      Histoire: `En Histoire (${score}/20), crée des fiches de révision chronologiques. Mémorise les dates clés et les enchaînements d'événements.`,
      Physique: `En Physique (${score}/20), assure-toi de comprendre les formules avant de les appliquer. Fais des schémas et résous des problèmes pas à pas.`,
      Anglais: `En Anglais (${score}/20), pratique quotidiennement : podcasts, séries en VO. Révise les temps et le vocabulaire thématique.`,
      SVT: `En SVT (${score}/20), utilise des schémas pour mémoriser les cycles et structures. Les exercices pratiques t'aideront à comprendre.`,
    };
    return recs[subject] ?? `Pour ${getSubjectLabel(subject)} (${score}/20), revois les bases et fais des exercices réguliers pour progresser.`;
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

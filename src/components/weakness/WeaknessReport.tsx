import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, TrendingUp, Lightbulb } from 'lucide-react';
import { useStudentStore } from '../../stores/useStudentStore';
import { calculateAverage } from '../../utils/helpers';

export const WeaknessReport: React.FC = () => {
  const { subjectGrades } = useStudentStore();

  const weakSubjects = subjectGrades.filter((g) => g.level === 'needs-improvement');
  const mediumSubjects = subjectGrades.filter((g) => g.level === 'medium');
  const goodSubjects = subjectGrades.filter((g) => g.level === 'good');
  const avg = calculateAverage(subjectGrades.map((g) => g.average));

  const getRecommendation = (subject: string, score: number): string => {
    const recs: Record<string, string> = {
      Maths: `Avec ${score}/20 en Maths, concentre-toi sur les exercices de base. Reprends les fondamentaux et fais des exercices quotidiens. Utilise l'aide aux devoirs pour poser tes questions.`,
      Français: `En Français (${score}/20), travaille la lecture régulière et l'analyse de textes. Révise les figures de style et la structure des dissertations.`,
      Histoire: `En Histoire (${score}/20), crée des fiches de révision chronologiques. Mémorise les dates clés et les enchaînements d'événements.`,
      Physique: `En Physique (${score}/20), assure-toi de comprendre les formules avant de les appliquer. Fais des schémas et résous des problèmes pas à pas.`,
      Anglais: `En Anglais (${score}/20), pratique quotidiennement : podcasts, séries en VO. Révise les temps et le vocabulaire thématique.`,
      SVT: `En SVT (${score}/20), utilise des schémas pour mémoriser les cycles et structures. Les exercices pratiques t'aideront à comprendre.`,
    };
    return recs[subject] ?? `Pour ${subject} (${score}/20), revois les bases et fais des exercices réguliers pour progresser.`;
  };

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb className="w-5 h-5 text-[#F7931A]" />
        <h3 className="text-base font-semibold text-white">Rapport et recommandations</h3>
      </div>

      {/* Overall summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#F7931A]/10 to-[#FF6B00]/10 border border-[#F7931A]/20 mb-5">
        <p className="text-sm text-white/80">
          <span className="font-semibold text-[#F7931A]">Moyenne générale : {avg}/20</span>
          {' — '}
          {avg >= 16
            ? 'Excellent travail ! Tu es sur la bonne voie pour d\'excellents résultats.'
            : avg >= 14
            ? 'Très bon niveau ! Continue sur cette lancée et consolide tes acquis.'
            : avg >= 12
            ? 'Bon niveau global. Il reste quelques domaines à améliorer.'
            : avg >= 10
            ? 'Niveau passable. Un effort régulier te permettra de progresser significativement.'
            : 'Des efforts importants sont nécessaires. Sois courageux, chaque progrès compte !'}
        </p>
      </div>

      {/* Weak subjects */}
      {weakSubjects.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h4 className="text-sm font-semibold text-red-400">À améliorer en priorité</h4>
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
                  {g.subject} — {g.average}/20
                </p>
                <p className="text-xs text-white/60">{getRecommendation(g.subject, g.average)}</p>
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
            <h4 className="text-sm font-semibold text-yellow-400">À consolider</h4>
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
                  {g.subject} — {g.average}/20
                </p>
                <p className="text-xs text-white/60">
                  Tu es sur la bonne voie ! Pour passer au niveau supérieur, fais des exercices réguliers et utilise l'aide aux devoirs pour les points bloquants.
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
            <h4 className="text-sm font-semibold text-green-400">Points forts</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {goodSubjects.map((g) => (
              <div
                key={g.subject}
                className="px-3 py-1.5 rounded-full bg-green-400/10 border border-green-400/20 text-xs text-green-300 font-medium"
              >
                {g.subject} ({g.average}/20) ✓
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

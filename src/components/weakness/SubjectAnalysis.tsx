import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts';
import { useStudentStore } from '../../stores/useStudentStore';
import { Badge } from '../ui/Badge';
import { getLevelLabel } from '../../utils/helpers';

export const SubjectAnalysis: React.FC = () => {
  const { subjectGrades } = useStudentStore();

  const radarData = subjectGrades.map((g) => ({
    subject: g.subject,
    score: g.average,
    fullMark: 20,
  }));

  const barData = subjectGrades
    .slice()
    .sort((a, b) => a.average - b.average)
    .map((g) => ({ name: g.subject, score: g.average, color: g.color }));

  const getLevelVariant = (level: string) => {
    if (level === 'good') return 'success';
    if (level === 'medium') return 'warning';
    return 'danger';
  };

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-5">Analyse des performances</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div>
          <p className="text-sm text-gray-500 dark:text-white/50 mb-3">Profil de compétences</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#F7931A"
                fill="#F7931A"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1D',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value}/20`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <p className="text-sm text-gray-500 dark:text-white/50 mb-3">Comparatif des moyennes</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 20]}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1D',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '12px',
                }}
                formatter={(value: number) => [`${value}/20`, 'Moyenne']}
              />
              <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject level badges */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5">
        <p className="text-sm text-gray-500 dark:text-white/50 mb-3">Niveaux par matière</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {subjectGrades.map((g) => (
            <div
              key={g.subject}
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5"
            >
              <span className="text-sm text-gray-600 dark:text-white/70">{g.subject}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold" style={{ color: g.color }}>
                  {g.average}
                </span>
                <Badge variant={getLevelVariant(g.level) as 'success' | 'warning' | 'danger'} size="sm">
                  {getLevelLabel(g.level)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

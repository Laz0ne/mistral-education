import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useStudentStore } from '../../stores/useStudentStore';
import { useTranslation } from 'react-i18next';
import { getSubjectLabel } from '../../utils/helpers';

export const WeaknessChart: React.FC = () => {
  const { subjectGrades } = useStudentStore();
  const { t } = useTranslation();

  const data = subjectGrades.map((g) => ({
    subject: getSubjectLabel(g.subject),
    score: g.average,
    fullMark: 20,
  }));

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 h-full shadow-sm dark:shadow-none">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.skillsProfile')}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
          />
          <Radar
            name={t('common.score')}
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
            formatter={(value: number) => [`${value}/20`, t('common.score')]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

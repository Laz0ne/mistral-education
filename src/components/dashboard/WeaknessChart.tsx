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

export const WeaknessChart: React.FC = () => {
  const { subjectGrades } = useStudentStore();

  const data = subjectGrades.map((g) => ({
    subject: g.subject,
    score: g.average,
    fullMark: 20,
  }));

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 h-full">
      <h3 className="text-base font-semibold text-white mb-4">Profil de compétences</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data}>
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
  );
};

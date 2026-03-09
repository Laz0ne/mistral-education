import React from 'react';
import { GradeInput } from '../components/weakness/GradeInput';
import { SubjectAnalysis } from '../components/weakness/SubjectAnalysis';
import { WeaknessReport } from '../components/weakness/WeaknessReport';

export const WeaknessDetection: React.FC = () => {
  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Détection des points faibles</h2>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
          Renseignez vos notes pour obtenir une analyse personnalisée et des recommandations.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-1">
          <GradeInput />
        </div>
        <div className="xl:col-span-2 space-y-5">
          <SubjectAnalysis />
          <WeaknessReport />
        </div>
      </div>
    </div>
  );
};

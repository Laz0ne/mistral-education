import React from 'react';
import { useTranslation } from 'react-i18next';
import { GradeInput } from '../components/weakness/GradeInput';
import { SubjectAnalysis } from '../components/weakness/SubjectAnalysis';
import { WeaknessReport } from '../components/weakness/WeaknessReport';

export const WeaknessDetection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('weakness.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
          {t('weakness.subtitle')}
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

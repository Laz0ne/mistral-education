import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePlannerStore } from '../../stores/usePlannerStore';
import { PlannerEvent } from '../../types';
import { generateId, getSubjectColor, getSubjectLabel } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTranslation } from 'react-i18next';

const EVENT_TYPES = [
  { value: 'exam' },
  { value: 'homework' },
  { value: 'revision' },
];

const SUBJECTS = ['Maths', 'Français', 'Histoire', 'Physique', 'Anglais', 'SVT', 'Philosophie', 'SES', 'Autre'];

export const DeadlineForm: React.FC = () => {
  const { addEvent } = usePlannerStore();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: 'exam' as PlannerEvent['type'],
    subject: 'Maths',
    title: '',
    date: '',
    time: '09:00',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return;

    const event: PlannerEvent = {
      id: generateId(),
      ...form,
      type: form.type,
      completed: false,
      color: getSubjectColor(form.subject),
    };

    addEvent(event);
    setSubmitted(true);
    setForm({
      type: 'exam',
      subject: 'Maths',
      title: '',
      date: '',
      time: '09:00',
      description: '',
    });
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{t('planner.addEvent')}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-white/70 mb-1.5">{t('planner.type')}</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#F7931A]/40"
            >
              {EVENT_TYPES.map((eventType) => (
                <option key={eventType.value} value={eventType.value} className="bg-white dark:bg-[#1A1A1D]">
                  {t(`planner.typeLabels.${eventType.value}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-white/70 mb-1.5">{t('planner.subject')}</label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#F7931A]/40"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-white dark:bg-[#1A1A1D]">
                  {getSubjectLabel(s)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          name="title"
          label={t('planner.titleLabel')}
          value={form.title}
          onChange={handleChange}
          placeholder={t('planner.titlePlaceholder')}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            name="date"
            label={t('planner.date')}
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
          <Input
            name="time"
            label={t('planner.time')}
            type="time"
            value={form.time}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-white/70 mb-1.5">{t('planner.description')}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder={t('planner.descriptionPlaceholder')}
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-[#F7931A]/40 resize-none"
          />
        </div>

        <Button
          type="submit"
          variant={submitted ? 'secondary' : 'primary'}
          className="w-full justify-center"
          icon={<Plus className="w-4 h-4" />}
        >
          {submitted ? t('planner.eventAdded') : t('planner.addEventBtn')}
        </Button>
      </form>
    </div>
  );
};

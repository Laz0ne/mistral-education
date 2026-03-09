import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Download, Upload, Trash2, Eye, EyeOff } from 'lucide-react';
import { useStudentStore } from '../stores/useStudentStore';
import { useChatStore } from '../stores/useChatStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const AVAILABLE_SUBJECTS = [
  'Maths', 'Français', 'Histoire', 'Physique', 'Anglais', 'SVT',
  'Philosophie', 'SES', 'Informatique',
];

const GRADES = ['6ème', '5ème', '4ème', '3ème', 'Seconde', 'Première', 'Terminale'];

export const Settings: React.FC = () => {
  const { student, updateStudent } = useStudentStore();
  const { clearMessages } = useChatStore();
  const [form, setForm] = useState({ ...student });
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubjectToggle = (subject: string) => {
    const subjects = form.subjects.includes(subject)
      ? form.subjects.filter((s) => s !== subject)
      : [...form.subjects, subject];
    setForm((prev) => ({ ...prev, subjects }));
    setSaved(false);
  };

  const handleSave = () => {
    updateStudent(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = {
      student: localStorage.getItem('mistral-student-store'),
      chat: localStorage.getItem('mistral-chat-store'),
      exercises: localStorage.getItem('mistral-exercise-store'),
      planner: localStorage.getItem('mistral-planner-store'),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mistral-education-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as Record<string, string | null>;
        if (data.student) localStorage.setItem('mistral-student-store', data.student);
        if (data.chat) localStorage.setItem('mistral-chat-store', data.chat);
        if (data.exercises) localStorage.setItem('mistral-exercise-store', data.exercises);
        if (data.planner) localStorage.setItem('mistral-planner-store', data.planner);
        window.location.reload();
      } catch {
        alert('Fichier invalide');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos données ? Cette action est irréversible.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="backdrop-blur-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Paramètres</h2>
        <p className="text-sm text-gray-500 dark:text-white/50 mt-1">Personnalisez votre expérience Mistral Education.</p>
      </div>

      {/* Profile */}
      <Section title="Profil">
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F7931A] to-[#FF6B00] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {form.firstName[0]}{form.lastName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{form.firstName} {form.lastName}</p>
              <p className="text-xs text-gray-400 dark:text-white/40">{form.grade} · {form.school}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              name="firstName"
              label="Prénom"
              value={form.firstName}
              onChange={handleChange}
            />
            <Input
              name="lastName"
              label="Nom"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-white/70 mb-1.5">Classe</label>
            <select
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#F7931A]/40"
            >
              {GRADES.map((g) => (
                <option key={g} value={g} className="bg-white dark:bg-[#1A1A1D]">{g}</option>
              ))}
            </select>
          </div>

          <Input
            name="school"
            label="Établissement"
            value={form.school}
            onChange={handleChange}
            placeholder="Nom de votre lycée/collège"
          />
        </div>
      </Section>

      {/* Subjects */}
      <Section title="Matières suivies">
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_SUBJECTS.map((subject) => {
            const selected = form.subjects.includes(subject);
            return (
              <motion.button
                key={subject}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSubjectToggle(subject)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selected
                    ? 'bg-gradient-to-r from-[#F7931A] to-[#FF6B00] text-white'
                    : 'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {subject}
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* API Key */}
      <Section title="Clé API Mistral">
        <p className="text-xs text-gray-400 dark:text-white/40 mb-3">
          Obtenez votre clé API sur{' '}
          <a
            href="https://console.mistral.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#F7931A] underline"
          >
            console.mistral.ai
          </a>
          . Sans clé, des réponses de démonstration seront utilisées.
        </p>
        <div className="relative">
          <input
            name="apiKey"
            type={showApiKey ? 'text' : 'password'}
            value={form.apiKey}
            onChange={handleChange}
            placeholder="sk-..."
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:border-[#F7931A]/40"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Section>

      {/* Appearance */}
      <Section title="Apparence">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Mode sombre</p>
            <p className="text-xs text-gray-400 dark:text-white/40">Thème foncé par défaut</p>
          </div>
          <button
            onClick={() => {
              const newValue = !form.darkMode;
              setForm((prev) => ({ ...prev, darkMode: newValue }));
              updateStudent({ darkMode: newValue });
              setSaved(false);
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              form.darkMode ? 'bg-[#F7931A]' : 'bg-gray-300 dark:bg-white/20'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                form.darkMode ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </Section>

      {/* Save button */}
      <Button
        variant={saved ? 'secondary' : 'primary'}
        className="w-full justify-center"
        icon={<Save className="w-4 h-4" />}
        onClick={handleSave}
      >
        {saved ? 'Paramètres enregistrés !' : 'Enregistrer les paramètres'}
      </Button>

      {/* Data management */}
      <Section title="Gestion des données">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 justify-center"
              icon={<Download className="w-4 h-4" />}
              onClick={handleExport}
            >
              Exporter
            </Button>
            <label className="flex-1">
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 cursor-pointer transition-all">
                <Upload className="w-4 h-4" />
                Importer
              </div>
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
          </div>
          <Button
            variant="danger"
            className="w-full justify-center"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={handleReset}
          >
            Réinitialiser toutes les données
          </Button>
          <p className="text-xs text-gray-300 dark:text-white/30 text-center">
            La réinitialisation supprimera définitivement toutes vos données locales.
          </p>

          <div className="pt-2 border-t border-gray-100 dark:border-white/5">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-white/40 hover:text-white/60"
            >
              Effacer l'historique des conversations
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

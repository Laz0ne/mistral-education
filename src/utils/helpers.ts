import { SubjectGrade } from '../types';

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    Maths: '#F7931A',
    Mathématiques: '#F7931A',
    Français: '#8B5CF6',
    Histoire: '#3B82F6',
    'Histoire-Géo': '#3B82F6',
    Physique: '#EC4899',
    'Physique-Chimie': '#EC4899',
    Anglais: '#10B981',
    SVT: '#06B6D4',
    Philosophie: '#F59E0B',
    SES: '#EF4444',
    Informatique: '#6366F1',
  };
  return colors[subject] ?? '#9CA3AF';
}

export function getSubjectIcon(subject: string): string {
  const icons: Record<string, string> = {
    Maths: '🔢',
    Mathématiques: '🔢',
    Français: '📖',
    Histoire: '🏛️',
    'Histoire-Géo': '🌍',
    Physique: '⚗️',
    'Physique-Chimie': '⚗️',
    Anglais: '🌐',
    SVT: '🧬',
    Philosophie: '🤔',
    SES: '📊',
    Informatique: '💻',
  };
  return icons[subject] ?? '📚';
}

export function calculateAverage(grades: number[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, g) => acc + g, 0);
  return Math.round((sum / grades.length) * 10) / 10;
}

export function getLevelFromScore(score: number): SubjectGrade['level'] {
  if (score < 10) return 'needs-improvement';
  if (score < 14) return 'medium';
  return 'good';
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    'needs-improvement': 'À améliorer',
    medium: 'Moyen',
    good: 'Bon niveau',
  };
  return labels[level] ?? level;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    'needs-improvement': 'text-red-400 bg-red-400/10 border-red-400/30',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
    good: 'text-green-400 bg-green-400/10 border-green-400/30',
  };
  return colors[level] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/30';
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

export function getDaysUntil(date: string): number {
  const target = new Date(date);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

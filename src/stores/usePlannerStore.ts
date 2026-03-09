import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PlannerEvent } from '../types';

interface PlannerStore {
  events: PlannerEvent[];
  addEvent: (event: PlannerEvent) => void;
  updateEvent: (id: string, data: Partial<PlannerEvent>) => void;
  deleteEvent: (id: string) => void;
  toggleComplete: (id: string) => void;
}

function getUpcomingDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0] ?? '';
}

const defaultEvents: PlannerEvent[] = [
  {
    id: 'event-1',
    type: 'exam',
    subject: 'Maths',
    title: 'Contrôle sur les fonctions dérivées',
    date: getUpcomingDate(5),
    time: '09:00',
    description: 'Chapitres 3 et 4 : dérivées et applications',
    completed: false,
    color: '#F7931A',
  },
  {
    id: 'event-2',
    type: 'homework',
    subject: 'Français',
    title: 'Dissertation sur Molière',
    date: getUpcomingDate(2),
    time: '23:59',
    description: 'Rédiger une dissertation sur le comique dans les pièces de Molière',
    completed: false,
    color: '#8B5CF6',
  },
  {
    id: 'event-3',
    type: 'revision',
    subject: 'Histoire',
    title: 'Révisions Seconde Guerre mondiale',
    date: getUpcomingDate(3),
    time: '18:00',
    description: 'Revoir les chapitres sur la WWII et la Shoah',
    completed: false,
    color: '#3B82F6',
  },
];

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set) => ({
      events: defaultEvents,
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, data) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
      toggleComplete: (id) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, completed: !e.completed } : e
          ),
        })),
    }),
    { name: 'mistral-planner-store' }
  )
);

import React, { useState } from 'react';
import { Calendar } from '../components/planner/Calendar';
import { DeadlineForm } from '../components/planner/DeadlineForm';
import { StudyPlan } from '../components/planner/StudyPlan';
import { Modal } from '../components/ui/Modal';
import { PlannerEvent } from '../types';
import { formatDate } from '../utils/helpers';
import { usePlannerStore } from '../stores/usePlannerStore';

export const StudyPlanner: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null);
  const { toggleComplete, deleteEvent } = usePlannerStore();

  const typeLabels: Record<string, string> = {
    exam: '📝 Examen',
    homework: '📋 Devoir',
    revision: '📚 Révision',
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Planning d'études</h2>
        <p className="text-sm text-white/50 mt-1">
          Organisez vos devoirs, examens et séances de révision.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Calendar onEventClick={setSelectedEvent} />
          <StudyPlan />
        </div>
        <div>
          <DeadlineForm />
        </div>
      </div>

      {/* Event detail modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Détail de l'événement"
      >
        {selectedEvent && (
          <div className="space-y-3">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${selectedEvent.color}15`, border: `1px solid ${selectedEvent.color}30` }}
            >
              <p className="text-sm font-semibold" style={{ color: selectedEvent.color }}>
                {typeLabels[selectedEvent.type]}
              </p>
              <p className="text-base font-bold text-white mt-0.5">{selectedEvent.title}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Matière</span>
                <span className="text-white">{selectedEvent.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Date</span>
                <span className="text-white">{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Heure</span>
                <span className="text-white">{selectedEvent.time}</span>
              </div>
              {selectedEvent.description && (
                <div>
                  <span className="text-white/50 block mb-1">Description</span>
                  <p className="text-white/80 text-xs p-2 rounded-lg bg-white/5">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  toggleComplete(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors"
              >
                {selectedEvent.completed ? 'Marquer incomplet' : 'Marquer terminé'}
              </button>
              <button
                onClick={() => {
                  deleteEvent(selectedEvent.id);
                  setSelectedEvent(null);
                }}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

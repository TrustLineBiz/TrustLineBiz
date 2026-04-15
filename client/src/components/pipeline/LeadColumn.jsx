import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import LeadCard from './LeadCard';

const STAGE_ACCENT = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  application_sent: 'bg-purple-500',
  funded: 'bg-emerald-500',
  closed_lost: 'bg-red-500',
};

const STAGE_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  application_sent: 'Application Sent',
  funded: 'Funded',
  closed_lost: 'Closed / Lost',
};

const CARDS_LIMIT = 6;

export default function LeadColumn({ stage, leads, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: stage });

  const visibleLeads = showAll ? leads : leads.slice(0, CARDS_LIMIT);
  const hiddenCount = leads.length - CARDS_LIMIT;

  return (
    <div className={`rounded-xl border transition-colors ${
      isOver ? 'border-gray-500 bg-gray-800/60' : 'border-gray-800 bg-gray-900/40'
    }`}>
      {/* Stage header — always visible, always droppable target area */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${STAGE_ACCENT[stage]}`} />
        <span className="font-semibold text-gray-100 text-sm flex-1">{STAGE_LABELS[stage]}</span>
        <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5 mr-1">
          {leads.length}
        </span>
        <span className="text-gray-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {/* Droppable body */}
      {open && (
        <div
          ref={setNodeRef}
          className={`px-4 pb-4 min-h-[80px] transition-colors ${
            isOver ? 'bg-gray-700/30' : ''
          }`}
        >
          {leads.length === 0 ? (
            <div className={`border-2 border-dashed rounded-lg py-6 text-center text-xs text-gray-600 transition-colors ${
              isOver ? 'border-gray-500 text-gray-400' : 'border-gray-800'
            }`}>
              {isOver ? 'Drop here' : 'No leads'}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {visibleLeads.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} />
                ))}
              </div>
              {hiddenCount > 0 && (
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showAll ? '▲ Show less' : `▼ Show ${hiddenCount} more`}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* When collapsed: still expose a drop zone so dragging works */}
      {!open && (
        <div ref={setNodeRef} className="px-4 pb-3">
          {isOver && (
            <div className="border-2 border-dashed border-gray-500 rounded-lg py-3 text-center text-xs text-gray-400">
              Drop here
            </div>
          )}
        </div>
      )}
    </div>
  );
}

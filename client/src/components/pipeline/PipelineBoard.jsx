import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
} from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLeads, updateLeadStage } from '../../api/leads';
import LeadColumn from './LeadColumn';
import LeadCard from './LeadCard';

const STAGES = ['new', 'contacted', 'qualified', 'application_sent', 'funded', 'closed_lost'];

export default function PipelineBoard() {
  const [activeId, setActiveId] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => getLeads(),
    refetchInterval: 30000,
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }) => updateLeadStage(id, stage),
    onMutate: async ({ id, stage }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['leads'] });
      const prev = queryClient.getQueryData(['leads']);
      queryClient.setQueryData(['leads'], (old) => ({
        ...old,
        leads: old.leads.map((l) => (l.id === id ? { ...l, stage } : l)),
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(['leads'], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const leads = data?.leads || [];
  const leadMap = Object.fromEntries(leads.map((l) => [l.id, l]));
  const byStage = Object.fromEntries(STAGES.map((s) => [s, leads.filter((l) => l.stage === s)]));
  const activeLead = activeId != null ? leadMap[activeId] : null;

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;

    // over.id is always a stage string because only columns are droppable
    const newStage = over.id;
    const lead = leadMap[active.id];

    if (!lead || !STAGES.includes(newStage)) return;
    if (newStage === lead.stage) return;

    stageMutation.mutate({ id: active.id, stage: newStage });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Loading pipeline...
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 space-y-3 max-w-[1400px]">
        {STAGES.map((stage) => (
          <LeadColumn
            key={stage}
            stage={stage}
            leads={byStage[stage]}
            defaultOpen={stage !== 'closed_lost'}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeLead ? (
          <div className="w-56">
            <LeadCard lead={activeLead} overlay />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

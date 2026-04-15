import { useDraggable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';

const QUAL_STYLES = {
  qualified: 'bg-green-900/50 text-green-300 border-green-700',
  disqualified: 'bg-red-900/50 text-red-300 border-red-700',
  pending: 'bg-gray-800 text-gray-400 border-gray-600',
};

function formatRevenue(val) {
  if (!val) return null;
  const n = parseFloat(val);
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}k/mo`;
  return `$${n}/mo`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return 'today';
  if (d === 1) return '1d ago';
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

export default function LeadCard({ lead, overlay = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { stage: lead.stage },
  });
  const navigate = useNavigate();

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Only navigate if not a drag (listeners may swallow, but guard anyway)
        if (!isDragging) navigate(`/leads/${lead.id}`);
      }}
      className={`bg-gray-800 border rounded-lg p-3 cursor-grab active:cursor-grabbing select-none transition-all ${
        isDragging && !overlay
          ? 'opacity-30 border-gray-700'
          : 'border-gray-700 hover:border-gray-500'
      } ${overlay ? 'shadow-2xl rotate-1 opacity-95' : ''}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{lead.name}</p>
          {lead.business_name && (
            <p className="text-xs text-gray-400 truncate">{lead.business_name}</p>
          )}
        </div>
        <span
          className={`shrink-0 text-xs px-1.5 py-0.5 rounded border font-medium ${
            QUAL_STYLES[lead.qualification_status] || QUAL_STYLES.pending
          }`}
        >
          {lead.qualification_status === 'qualified'
            ? 'Q'
            : lead.qualification_status === 'disqualified'
            ? 'DQ'
            : '?'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
        {lead.monthly_revenue && (
          <span className="bg-gray-700 px-1.5 py-0.5 rounded">{formatRevenue(lead.monthly_revenue)}</span>
        )}
        {lead.credit_score_exact && (
          <span className="bg-gray-700 px-1.5 py-0.5 rounded">CS {lead.credit_score_exact}</span>
        )}
        {lead.utm_source && (
          <span className="bg-gray-700 px-1.5 py-0.5 rounded truncate max-w-[80px]">{lead.utm_source}</span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
        {lead.preferred_call_time && <span>Call: {lead.preferred_call_time}</span>}
        <span className="ml-auto">{timeAgo(lead.created_at)}</span>
      </div>
    </div>
  );
}

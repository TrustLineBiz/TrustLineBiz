import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLead, updateLeadStage, addNote, deleteNote, createTask, updateTask } from '../api/leads';

const STAGES = ['new', 'contacted', 'qualified', 'application_sent', 'funded', 'closed_lost'];
const STAGE_LABELS = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  application_sent: 'App Sent', funded: 'Funded', closed_lost: 'Closed/Lost',
};

function formatCurrency(val) {
  if (!val) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [noteText, setNoteText] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDue, setTaskDue] = useState('');

  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id),
  });

  const stageMutation = useMutation({
    mutationFn: (stage) => updateLeadStage(id, stage),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lead', id] }),
  });

  const addNoteMutation = useMutation({
    mutationFn: (content) => addNote(id, content),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lead', id] }); setNoteText(''); },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId) => deleteNote(noteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lead', id] }),
  });

  const addTaskMutation = useMutation({
    mutationFn: (data) => createTask(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['lead', id] }); setTaskTitle(''); setTaskDue(''); },
  });

  const completeTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }) =>
      updateTask(taskId, { completed_at: completed ? new Date().toISOString() : null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lead', id] }),
  });

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!lead) return <div className="p-8 text-gray-500">Lead not found</div>;

  const qualColor = {
    qualified: 'text-green-400',
    disqualified: 'text-red-400',
    pending: 'text-gray-400',
  }[lead.qualification_status] || 'text-gray-400';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={() => navigate('/pipeline')} className="text-gray-500 hover:text-white text-sm mb-4 flex items-center gap-1">
        ← Back to Pipeline
      </button>

      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
            {lead.business_name && <p className="text-gray-400 mt-0.5">{lead.business_name}</p>}
            <span className={`text-sm font-medium ${qualColor} mt-1 block`}>
              {lead.qualification_status.toUpperCase()}
              {lead.disqualify_reason && ` — ${lead.disqualify_reason}`}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="bg-green-700 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors">
                Call {lead.phone}
              </a>
            )}
            <select
              value={lead.stage}
              onChange={(e) => stageMutation.mutate(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-brand-500"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        {/* Lead Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Lead Info</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              ['Email', lead.email],
              ['Phone', lead.phone],
              ['Monthly Revenue', formatCurrency(lead.monthly_revenue)],
              ['Funding Needed', formatCurrency(lead.funding_amount_needed)],
              ['Credit Score', lead.credit_score_exact || lead.credit_score_range],
              ['Preferred Call Time', lead.preferred_call_time],
              ['Contact Via', lead.contact_preference],
              ['UTM Source', lead.utm_source],
              ['UTM Campaign', lead.utm_campaign],
              ['Submitted', lead.created_at ? new Date(lead.created_at).toLocaleString() : '—'],
            ].map(([label, value]) => value ? (
              <div key={label} className="flex gap-2 min-w-0">
                <dt className="text-gray-500 w-36 shrink-0">{label}</dt>
                <dd className="text-white min-w-0 break-words">{value}</dd>
              </div>
            ) : null)}
          </dl>
        </div>

        {/* Tasks */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Tasks</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!taskTitle.trim()) return;
              addTaskMutation.mutate({ lead_id: parseInt(id, 10), title: taskTitle, due_at: taskDue || null });
            }}
            className="space-y-2 mb-3"
          >
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Add task..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
            />
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={taskDue}
                onChange={(e) => setTaskDue(e.target.value)}
                className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-500"
              />
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg text-sm shrink-0">+</button>
            </div>
          </form>
          <div className="space-y-2">
            {lead.tasks?.length === 0 && <p className="text-gray-600 text-sm">No tasks</p>}
            {lead.tasks?.map((task) => (
              <div key={task.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={!!task.completed_at}
                  onChange={(e) => completeTaskMutation.mutate({ taskId: task.id, completed: e.target.checked })}
                  className="mt-0.5 accent-brand-500 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${task.completed_at ? 'line-through text-gray-600' : 'text-white'}`}>{task.title}</p>
                  {task.due_at && (
                    <p className="text-xs text-gray-500">{new Date(task.due_at).toLocaleString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Notes</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!noteText.trim()) return;
            addNoteMutation.mutate(noteText);
          }}
          className="flex gap-2 mb-4"
        >
          <input
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
        </form>
        <div className="space-y-3">
          {lead.notes?.length === 0 && <p className="text-gray-600 text-sm">No notes yet</p>}
          {lead.notes?.map((note) => (
            <div key={note.id} className="bg-gray-800 rounded-lg p-3 group">
              <p className="text-sm text-white whitespace-pre-wrap">{note.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">
                  {note.user_name} · {new Date(note.created_at).toLocaleString()}
                </span>
                <button
                  onClick={() => deleteNoteMutation.mutate(note.id)}
                  className="text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

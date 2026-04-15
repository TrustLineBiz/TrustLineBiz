import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../api/leads';

export default function Tasks() {
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [filter, setFilter] = useState('incomplete');
  const qc = useQueryClient();
  const navigate = useNavigate();

  const params = filter === 'incomplete' ? { completed: 'false' }
    : filter === 'today' ? { due_today: 'true', completed: 'false' }
    : {};

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => getTasks(params),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createTask(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); setTitle(''); setDueAt(''); },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, completed }) =>
      updateTask(id, { completed_at: completed ? new Date().toISOString() : null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTask(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold text-white mb-6">Tasks</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          createMutation.mutate({ title, due_at: dueAt || null });
        }}
        className="space-y-2 mb-6"
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-500"
        />
        <div className="flex gap-2">
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
          />
          <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium shrink-0">Add</button>
        </div>
      </form>

      <div className="flex gap-2 mb-4">
        {['incomplete', 'today', 'all'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-lg capitalize transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white bg-gray-800'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}

      <div className="space-y-2">
        {tasks.length === 0 && !isLoading && (
          <p className="text-gray-600 text-sm">No tasks</p>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-start gap-3 group">
            <input
              type="checkbox"
              checked={!!task.completed_at}
              onChange={(e) => completeMutation.mutate({ id: task.id, completed: e.target.checked })}
              className="mt-0.5 accent-brand-500"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.completed_at ? 'line-through text-gray-600' : 'text-white'}`}>{task.title}</p>
              <div className="flex gap-3 mt-0.5">
                {task.due_at && (
                  <span className="text-xs text-gray-500">{new Date(task.due_at).toLocaleString()}</span>
                )}
                {task.lead_name && (
                  <button
                    onClick={() => navigate(`/leads/${task.lead_id}`)}
                    className="text-xs text-brand-400 hover:text-brand-300"
                  >
                    {task.lead_name}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => deleteMutation.mutate(task.id)}
              className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

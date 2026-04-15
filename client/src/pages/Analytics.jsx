import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAnalyticsSummary } from '../api/leads';

const STAGE_COLORS = {
  new: '#3b82f6',
  contacted: '#eab308',
  qualified: '#22c55e',
  application_sent: '#a855f7',
  funded: '#10b981',
  closed_lost: '#ef4444',
};

const STAGE_LABELS = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  application_sent: 'App Sent', funded: 'Funded', closed_lost: 'Closed/Lost',
};

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalyticsSummary,
    refetchInterval: 60000,
  });

  if (isLoading) return <div className="p-8 text-gray-500">Loading...</div>;

  const stageData = Object.entries(data?.by_stage || {}).map(([stage, count]) => ({
    stage: STAGE_LABELS[stage] || stage,
    count,
    color: STAGE_COLORS[stage] || '#6b7280',
  }));

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-bold text-white mb-6">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today" value={data?.leads_today ?? 0} />
        <StatCard label="This Week" value={data?.leads_week ?? 0} />
        <StatCard label="This Month" value={data?.leads_month ?? 0} />
        <StatCard label="Conversion" value={`${data?.conversion_rate ?? 0}%`} sub="New → Funded" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Qualified" value={data?.qualified_count ?? 0} />
        <StatCard label="Disqualified" value={data?.disqualified_count ?? 0} />
        <StatCard label="Total Leads" value={data?.total ?? 0} />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">Pipeline Breakdown</h2>
        {stageData.length === 0 ? (
          <p className="text-gray-600 text-sm py-8 text-center">No pipeline data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stageData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }} style={{ background: 'transparent' }}>
              <XAxis dataKey="stage" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                labelStyle={{ color: '#f9fafb' }}
                itemStyle={{ color: '#d1d5db' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                {stageData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {data?.utm_breakdown?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-4">UTM Sources</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 text-left">
                <th className="pb-2 font-medium">Source</th>
                <th className="pb-2 font-medium text-right">Leads</th>
                <th className="pb-2 font-medium text-right">Qualified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {data.utm_breakdown.map((row) => (
                <tr key={row.utm_source}>
                  <td className="py-2 text-white">{row.utm_source}</td>
                  <td className="py-2 text-right text-gray-300">{row.count}</td>
                  <td className="py-2 text-right text-green-400">{row.qualified_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

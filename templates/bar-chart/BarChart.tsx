// Requires: npm install recharts
import React from 'react';
import { z } from 'zod';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { BarChartSchema } from './BarChart.schema';

export { BarChartSchema };

export type BarChartProps = z.infer<typeof BarChartSchema>;

export const BarChart: React.FC<BarChartProps> = ({
  title,
  data,
  xAxisKey,
  series,
}) => {
  return (
    <div style={{
      width: '100%',
      height: 380,
      padding: '1.25rem',
      borderRadius: '0.75rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '1rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      {title && (
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
          {title}
        </h3>
      )}
      <div style={{ width: '100%', height: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey={xAxisKey} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#e5e7eb" />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#e5e7eb" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Legend />
            {series.map((s, index) => (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.name ?? s.key}
                fill={s.color ?? ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Requires: npm install recharts
import React from 'react';
import { z } from 'zod';
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChartSchema } from './PieChart.schema';

export { PieChartSchema };

export type PieChartProps = z.infer<typeof PieChartSchema>;

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

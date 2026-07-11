import React from 'react';
import { z } from 'zod';
import { ProConTableSchema } from './ProConTable.schema';

export type ProConTableProps = z.infer<typeof ProConTableSchema>;

export const ProConTable: React.FC<ProConTableProps> = ({
  title,
  pros,
  cons,
}) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '1rem 0',
      maxWidth: '640px',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    }}>
      {title && (
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: 600,
          fontSize: '1rem',
          color: '#111827',
          backgroundColor: '#f9fafb',
        }}>
          {title}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {/* Pros Column */}
        <div style={{ padding: '1.25rem', borderRight: '1px solid #e5e7eb' }}>
          <h4 style={{
            margin: '0 0 1rem 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#10b981',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span>✓</span> Pros
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', fontSize: '0.875rem' }}>
            {pros.map((pro, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}>{pro}</li>
            ))}
          </ul>
        </div>
        {/* Cons Column */}
        <div style={{ padding: '1.25rem' }}>
          <h4 style={{
            margin: '0 0 1rem 0',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#ef4444',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            <span>✗</span> Cons
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#374151', fontSize: '0.875rem' }}>
            {cons.map((con, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}>{con}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

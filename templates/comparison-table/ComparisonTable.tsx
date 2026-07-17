import React from 'react';
import { z } from 'zod';
import { ComparisonTableSchema } from './ComparisonTable.schema';

export { ComparisonTableSchema };

export type ComparisonTableProps = z.infer<typeof ComparisonTableSchema>;

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  title,
  features,
  options,
}) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '1rem 0',
      width: '100%',
      overflowX: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
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
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: '0.875rem',
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <th style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: '#374151' }}>Feature</th>
            {options.map((opt, i) => (
              <th key={i} style={{ padding: '0.75rem 1.25rem', fontWeight: 600, color: '#374151', textAlign: 'center' }}>
                {opt.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, fIndex) => (
            <tr key={fIndex} style={{ borderBottom: fIndex === features.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem 1.25rem', fontWeight: 500, color: '#111827' }}>{feature}</td>
              {options.map((opt, oIndex) => {
                const val = opt.values[feature] !== undefined ? opt.values[feature] : opt.values[feature.toLowerCase()];
                return (
                  <td key={oIndex} style={{ padding: '0.75rem 1.25rem', textAlign: 'center', color: '#4b5563' }}>
                    {typeof val === 'boolean' ? (
                      val ? (
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.125rem' }}>✓</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.125rem' }}>✗</span>
                      )
                    ) : (
                      String(val ?? '')
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

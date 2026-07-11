import React from 'react';
import { z } from 'zod';
import { KeyValueListSchema } from './KeyValueList.schema';

export type KeyValueListProps = z.infer<typeof KeyValueListSchema>;

export const KeyValueList: React.FC<KeyValueListProps> = ({
  title,
  items,
}) => {
  return (
    <div style={{
      padding: '1.25rem',
      borderRadius: '0.75rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#1f2937',
      maxWidth: '480px',
      margin: '0.5rem 0',
    }}>
      {title && (
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
          {title}
        </h3>
      )}
      <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: index === items.length - 1 ? 'none' : '1px dashed #f3f4f6',
            paddingBottom: index === items.length - 1 ? '0' : '0.5rem',
          }}>
            <dt style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: 500 }}>{item.label}</dt>
            <dd style={{ fontSize: '0.875rem', color: '#111827', fontWeight: 600, margin: 0 }}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

import React from 'react';
import { z } from 'zod';
import { ConfirmationCardSchema } from './ConfirmationCard.schema';

export { ConfirmationCardSchema };

/**
 * Recommended registry connection pattern:
 * Since callbacks cannot be sent by the LLM, they must be supplied at render time.
 * Wrap this component in a connected component in your registry setup:
 *
 * ```tsx
 * const ConfirmationCardConnected: React.FC<any> = (props) => (
 *   <ConfirmationCard
 *     {...props}
 *     onConfirm={() => handleConfirm(props.id)}
 *     onDeny={() => handleDeny(props.id)}
 *   />
 * );
 * ```
 */
export interface ConfirmationCardProps extends z.infer<typeof ConfirmationCardSchema> {
  onConfirm?: () => void;
  onDeny?: () => void;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  id,
  title,
  message,
  onConfirm,
  onDeny,
}) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '1.25rem',
      borderRadius: '0.75rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      maxWidth: '400px',
      margin: '0.75rem 0',
      color: '#1f2937',
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
        {title}
      </h3>
      <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button
          onClick={onDeny}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: '1px solid #d1d5db',
            backgroundColor: '#ffffff',
            color: '#374151',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            outline: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            outline: 'none',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

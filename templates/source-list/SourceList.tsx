import React from 'react';
import { z } from 'zod';
import { SourceListSchema } from './SourceList.schema';

export { SourceListSchema };

export type SourceListProps = z.infer<typeof SourceListSchema>;

function isValidUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return false;
  }
  if (/:/.test(trimmed) && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  return true;
}

export const SourceList: React.FC<SourceListProps> = ({
  title,
  sources,
}) => {
  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '1rem 0',
      maxWidth: '500px',
      padding: '1rem',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    }}>
      {title && (
        <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h3>
      )}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {sources.map((src, index) => {
          const valid = isValidUrl(src.url);
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>[{index + 1}]</span>
              {valid ? (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.875rem',
                    color: '#2563eb',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.textDecoration = 'underline'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.textDecoration = 'none'; }}
                >
                  {src.title}
                </a>
              ) : (
                <span style={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'line-through' }} title="Unsafe link blocked">
                  {src.title}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

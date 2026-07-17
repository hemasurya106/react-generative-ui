import React, { useState } from 'react';
import { z } from 'zod';
import { AccordionSchema } from './Accordion.schema';

export { AccordionSchema };

export type AccordionProps = z.infer<typeof AccordionSchema>;

export const Accordion: React.FC<AccordionProps> = ({
  items,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: '1rem 0',
      maxWidth: '600px',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
    }}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} style={{
            borderBottom: index === items.length - 1 ? 'none' : '1px solid #e5e7eb',
          }}>
            <button
              onClick={() => toggle(index)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem 1.25rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#111827',
                outline: 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <span>{item.title}</span>
              <span style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                color: '#6b7280',
                fontSize: '0.75rem',
              }}>
                ▼
              </span>
            </button>
            <div style={{
              maxHeight: isOpen ? '1000px' : '0px',
              overflow: 'hidden',
              transition: 'max-height 0.3s cubic-bezier(0, 1, 0, 1)',
            }}>
              <div style={{
                padding: '0 1.25rem 1rem 1.25rem',
                fontSize: '0.875rem',
                color: '#4b5563',
                lineHeight: 1.5,
              }}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

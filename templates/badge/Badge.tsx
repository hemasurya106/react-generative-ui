import React from 'react';
import { z } from 'zod';
import { BadgeSchema } from './Badge.schema';

export { BadgeSchema };

export type BadgeProps = z.infer<typeof BadgeSchema>;

const BADGE_CONFIG = {
  default: {
    color: '#374151',
    bg: '#f3f4f6',
  },
  success: {
    color: '#065f46',
    bg: '#d1fae5',
  },
  warning: {
    color: '#92400e',
    bg: '#fef3c7',
  },
  danger: {
    color: '#991b1b',
    bg: '#fee2e2',
  },
  info: {
    color: '#1e3a8a',
    bg: '#dbeafe',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
}) => {
  const config = BADGE_CONFIG[variant] || BADGE_CONFIG.default;

  return (
    <span style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.125rem 0.625rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: config.bg,
      color: config.color,
      margin: '0.25rem',
    }}>
      {label}
    </span>
  );
};

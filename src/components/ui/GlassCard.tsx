import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import './GlassCard.css';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  width?: string;
  corner?: string;
  shadow?: string;
};

export function GlassCard({
  width = '',
  corner = '',
  shadow = '',
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <div {...rest} className={clsx('glass-card', width, corner, shadow, className)}>
      <div className="gc-border" />
      <div className="gc-overlay" />
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';

interface GridBackgroundProps {
  children?: ReactNode;
  borderTop?: boolean;
  borderBottom?: boolean;
  className?: string;
}

export function GridBackground({
  children,
  borderTop = true,
  borderBottom = true,
  className = '',
}: GridBackgroundProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        borderTop: borderTop ? '1px solid rgba(255,255,255,0.18)' : undefined,
        borderBottom: borderBottom ? '1px solid rgba(255,255,255,0.18)' : undefined,
        background: `
          linear-gradient(rgba(140,192,143,0.052) 1px, transparent 1px),
          linear-gradient(90deg, rgba(140,192,143,0.052) 1px, transparent 1px),
          linear-gradient(180deg,
            rgba(247,247,217,0.03) 0%,
            rgba(247,247,217,0) 22%,
            rgba(247,247,217,0) 78%,
            rgba(247,247,217,0.02) 100%),
          linear-gradient(180deg,
            rgba(5,6,9,1) 0%,
            rgba(7,8,12,1) 24%,
            rgba(4,5,8,1) 52%,
            rgba(7,8,12,1) 78%,
            rgba(5,6,9,1) 100%)
        `,
        backgroundSize: '56px 56px, 56px 56px, 100% 100%, 100% 100%',
        backgroundPosition: 'center',
      }}
    >
      {children && <div className="relative">{children}</div>}
    </div>
  );
}
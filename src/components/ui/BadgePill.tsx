import React from 'react';

interface BadgePillProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * High-end BadgePill inspired by Skipper UI & Vengeance UI.
 * Features an optical glowing live indicator dot and sleek gradient border.
 */
export const BadgePill: React.FC<BadgePillProps> = ({
  children,
  variant = 'indigo',
  pulse = false,
  className = '',
  icon,
}) => {
  const variantStyles = {
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 shadow-indigo-500/10',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-emerald-500/10',
    amber: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-amber-500/10',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-rose-500/10',
    slate: 'bg-slate-800/60 text-slate-300 border-slate-700/60 shadow-black/20',
  };

  const dotColors = {
    indigo: 'bg-indigo-400',
    emerald: 'bg-emerald-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    slate: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm backdrop-blur-md transition-colors ${variantStyles[variant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

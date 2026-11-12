import React from 'react';

interface BadgePillProps {
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Duolingo-styled Badge Pill with rounded-full shape and vibrant cartoon colors.
 */
export const BadgePill: React.FC<BadgePillProps> = ({
  children,
  variant = 'indigo',
  pulse = false,
  className = '',
  icon,
}) => {
  const variantStyles = {
    indigo: 'bg-[#E5F6FD] text-[#1CB0F6] border-2 border-[#84D8FF]',
    emerald: 'bg-[#D7FFB8] text-[#58A700] border-2 border-[#58CC02]/40',
    amber: 'bg-[#FFF4D0] text-[#E5A500] border-2 border-[#FFC800]/60',
    rose: 'bg-[#FFDFE0] text-[#EA2B2B] border-2 border-[#FF4B4B]/40',
    slate: 'bg-[#F7F7F7] text-[#777777] border-2 border-[#E5E5E5]',
  };

  const dotColors = {
    indigo: 'bg-[#1CB0F6]',
    emerald: 'bg-[#58CC02]',
    amber: 'bg-[#FFC800]',
    rose: 'bg-[#FF4B4B]',
    slate: 'bg-[#AFAFAF]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide border transition-all ${variantStyles[variant]} ${className}`}
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

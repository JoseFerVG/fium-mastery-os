import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  glowSize?: number;
}

/**
 * Duolingo-styled tactile card container.
 * Solid 2px outline with 4px bottom border for authentic 3D toy/game feel.
 */
export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor: _spotlightColor,
  glowSize: _glowSize,
  ...props
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-b-4 border-[#E5E5E5] bg-white p-6 transition-all duration-200 text-[#4B4B4B] hover:border-[#84D8FF] ${className}`}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

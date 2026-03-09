import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'orange';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md';
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-400/10 text-green-400 border-green-400/30',
  warning: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  danger: 'bg-red-400/10 text-red-400 border-red-400/30',
  info: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
  default: 'bg-white/5 text-white/60 border-white/10',
  orange: 'bg-[#F7931A]/10 text-[#F7931A] border-[#F7931A]/30',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  size = 'md',
}) => {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

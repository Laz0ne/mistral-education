import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
}) => {
  const base =
    'backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl';
  const hoverClass = hover
    ? 'transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-lg hover:shadow-black/20 cursor-pointer'
    : '';

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={onClick}
        className={`${base} ${hoverClass} ${paddingClasses[padding]} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-white/70 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`
            w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white
            placeholder-white/30 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#F7931A]/50 focus:border-[#F7931A]/50
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 hover:border-white/20'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-white/40">{hint}</p>}
    </div>
  );
};

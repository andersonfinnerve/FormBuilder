import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, error, helperText, description, className = '', children, ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between items-end">
          <label className="text-sm text-text-primary font-medium block">{label}</label>
          {helperText}
        </div>
      )}
      <div className="relative">
        <select 
          className={`w-full bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-text-primary text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none transition-colors truncate ${className}`}
          {...props}
        >
          {children}
        </select>
        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none text-lg">expand_more</span>
      </div>
      {description && <div className="text-[10px] text-text-secondary">{description}</div>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

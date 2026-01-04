import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, description, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex justify-between items-end">
          <label className="text-sm text-text-primary font-medium block">{label}</label>
          {helperText}
        </div>
      )}
      <input 
        className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background-dark ${className}`}
        {...props}
      />
      {description && <div className="text-[10px] text-text-secondary">{description}</div>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: React.ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="space-y-1.5">
      {(label || helperText) && (
        <div className="flex justify-between items-end">
          {label && <label className="text-sm text-text-primary font-medium block">{label}</label>}
          {helperText}
        </div>
      )}
      <textarea 
        className={`w-full bg-background border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
    
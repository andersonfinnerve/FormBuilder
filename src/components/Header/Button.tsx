import React from 'react';

interface ButtonProps {
  onClick: () => void;
  icon?: string;
  label?: string;
  variant?: 'secondary' | 'primary' | 'icon';
  title?: string;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  icon, 
  label, 
  variant = 'secondary',
  title,
  disabled = false,
  className = ''
}) => {
  // Si hay className personalizada, la usamos directamente combinada con base
  // De lo contrario, usamos las variantes predefinidas
  const getClasses = () => {
    const baseClasses = 'flex cursor-pointer items-center justify-center overflow-hidden transition-colors';
    const disabledClasses = disabled 
      ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-text-secondary' 
      : '';

    // Si hay className, permite sobrescritura completa
    if (className) {
      const variantBase = {
        secondary: 'bg-surface hover:bg-background border border-border text-text-primary text-sm font-bold',
        primary: 'bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg',
        icon: 'rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary'
      };
      return `${baseClasses} ${variantBase[variant]} ${disabledClasses} ${className}`;
    }

    // Variantes con estilos por defecto completos
    const variantClasses = {
      secondary: 'px-3 rounded-xl h-10 bg-surface hover:bg-background border border-border text-text-primary text-sm font-bold',
      primary: 'px-6 rounded-xl h-10 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-lg',
      icon: 'p-2 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${disabledClasses}`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={getClasses()}
    >
      {icon && (
        <span className={`material-symbols-outlined ${label ? 'mr-2' : ''} ${variant === 'icon' ? 'text-xl' : 'text-lg'}`}>
          {icon}
        </span>
      )}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;

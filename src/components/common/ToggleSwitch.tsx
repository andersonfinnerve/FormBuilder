import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between group">
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-sm text-text-primary font-medium">{label}</span>}
          {description && <span className="text-xs text-text-secondary">{description}</span>}
        </div>
      )}
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white dark:after:bg-gray-100 after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-md peer-checked:bg-primary peer-checked:dark:bg-primary-light"></div>
      </label>
    </div>
  );
};

export default ToggleSwitch;

import React from 'react';

interface ToolboxCategoryProps {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const ToolboxCategory: React.FC<ToolboxCategoryProps> = ({ title, icon, children }) => {
  return (
    <div>
      <h4 className="text-text-primary font-bold text-sm mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-text-secondary text-base">{icon}</span>
        {title}
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {children}
      </div>
    </div>
  );
};

export default ToolboxCategory;

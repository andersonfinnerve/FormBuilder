import React from 'react';

interface TitleProps {
  title: string;
  icon?: string;
}

const Title: React.FC<TitleProps> = ({ title, icon = undefined }) => {
  return (
    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
      {icon && <span className="material-symbols-outlined text-primary">{icon}</span>}
      {title}
    </h2>
  );
};

export default Title;

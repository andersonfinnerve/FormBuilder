 import React from 'react';

interface ToolboxHeaderProps {
  title: string;
}

const SubTitle: React.FC<ToolboxHeaderProps> = ({ title }) => {
  return (
    <h4 className="text-text-secondary text-xs font-bold uppercase tracking-wider">
      {title}
    </h4>
  );
};

export default SubTitle;

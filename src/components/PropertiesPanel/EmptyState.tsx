import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <aside className="w-80 bg-surface-dark border-l border-border-dark flex flex-col z-10 shadow-xl shrink-0 hidden md:flex items-center justify-center text-text-secondary p-8 text-center">
      <div className="bg-background-dark p-4 rounded-full mb-4">
        <span className="material-symbols-outlined text-3xl">tune</span>
      </div>
      <h3 className="text-white font-bold mb-2">Sin selección</h3>
      <p className="text-sm">Selecciona un campo en el canvas para editar sus propiedades.</p>
    </aside>
  );
};

export default EmptyState;

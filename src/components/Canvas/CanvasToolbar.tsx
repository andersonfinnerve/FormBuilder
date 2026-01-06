import React from 'react';

const CanvasToolbar: React.FC = () => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-surface-dark border border-border-dark rounded-lg p-1 flex gap-1 shadow-xl" onClick={(e) => e.stopPropagation()}>
      <button className="p-2 text-text-secondary hover:text-white hover:bg-border-dark rounded transition-colors" title="Deshacer">
        <span className="material-symbols-outlined text-lg">undo</span>
      </button>
      <button className="p-2 text-text-secondary hover:text-white hover:bg-border-dark rounded transition-colors" title="Rehacer">
        <span className="material-symbols-outlined text-lg">redo</span>
      </button>
      <div className="w-px bg-border-dark my-1"></div>
      {/* <button className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="Limpiar Canvas">
        <span className="material-symbols-outlined text-lg">delete_sweep</span>
      </button> */}
    </div>
  );
};

export default CanvasToolbar;

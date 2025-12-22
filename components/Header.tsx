import React from 'react';

interface HeaderProps {
  onPreview: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPreview }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-dark px-6 py-3 bg-surface-dark z-20 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-4 text-white">
        <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
          <span className="material-symbols-outlined text-2xl">wysiwyg</span>
        </div>
        <div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Estudio de Formularios</h2>
          <p className="text-xs text-text-secondary font-medium">v2.4.0 • Modo Edición</p>
        </div>
      </div>

      {/* Center Breadcrumb */}
      <div className="flex flex-1 justify-center max-w-xl mx-auto px-4 hidden md:flex">
        <div className="flex items-center gap-2 bg-background-dark px-3 py-1.5 rounded-full border border-border-dark">
          <span className="material-symbols-outlined text-text-secondary text-sm">folder</span>
          <span className="text-text-secondary text-sm">Proyectos /</span>
          <span className="text-white text-sm font-medium">Onboarding Clientes 2024</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button 
            onClick={onPreview}
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-surface-dark hover:bg-border-dark border border-border-dark text-white text-sm font-bold transition-colors"
          >
            <span className="material-symbols-outlined mr-2 text-lg">visibility</span>
            <span>Vista Previa</span>
          </button>
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-surface-dark hover:bg-border-dark border border-border-dark text-white text-sm font-bold transition-colors">
            <span className="material-symbols-outlined mr-2 text-lg">save</span>
            <span>Guardar</span>
          </button>
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-900/20 transition-colors">
            <span>Publicar</span>
          </button>
        </div>
        <div className="w-px h-8 bg-border-dark mx-2 hidden sm:block"></div>
        <div 
          className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-border-dark cursor-pointer hover:border-primary transition-colors" 
          style={{ backgroundImage: 'url("https://picsum.photos/seed/user_avatar/200/200")' }}
          title="User Profile"
        ></div>
      </div>
    </header>
  );
};

export default Header;
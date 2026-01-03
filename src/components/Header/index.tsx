import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

interface HeaderProps {
  onPreview: () => void;
  onThemeConfig: () => void;
  onSave: () => void;
  onHistory: () => void;
  onOpenExplorer: () => void;
  onNewForm: () => void;
  viewMode: 'form' | 'questionnaire' | 'onboarding';
  onViewModeChange: (mode: 'form' | 'questionnaire' | 'onboarding') => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onPreview, 
  onThemeConfig, 
  onSave, 
  onHistory,
  onOpenExplorer,
  onNewForm,
  viewMode, 
  onViewModeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}) => {
  const { mode, toggleMode } = useTheme();

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border px-6 py-3 bg-surface z-20 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-4 text-text-primary">
        <div className="size-8 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
          <span className="material-symbols-outlined text-2xl">wysiwyg</span>
        </div>
        <div>
          <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">Estudio de Formularios</h2>
          <p className="text-xs text-text-secondary font-medium">v2.4.0 • Modo Edición</p>
        </div>
      </div>

      {/* Center Breadcrumb */}
      <div className="flex flex-1 justify-center max-w-xl mx-auto px-4 hidden md:flex">
        <div className="flex items-center gap-1 bg-background px-1 py-1 rounded-lg border border-border">
          <button
            onClick={() => onViewModeChange('form')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'form' ? 'bg-surface shadow text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Formulario
          </button>
          <button
            onClick={() => onViewModeChange('questionnaire')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'questionnaire' ? 'bg-surface shadow text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Cuestionario
          </button>
          <button
            onClick={() => onViewModeChange('onboarding')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'onboarding' ? 'bg-surface shadow text-primary' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Onboarding
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* History & Undo/Redo */}
        {viewMode === 'form' && (
          <div className="flex items-center gap-1 mr-2 border-r border-border pr-4">
            <Button 
              onClick={onUndo!}
              disabled={!canUndo}
              variant="icon"
              icon="undo"
              title="Deshacer"
            />
            <Button 
              onClick={onRedo!}
              disabled={!canRedo}
              variant="icon"
              icon="redo"
              title="Rehacer"
            />
            <Button 
              onClick={onHistory}
              variant="icon"
              icon="history"
              title="Historial de cambios"
              className="ml-1"
            />
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={onNewForm}
            icon="add_box"
            title="Nuevo Formulario"
            className="px-3"
          >
            <span className="hidden md:inline ml-2">Nuevo</span>
          </Button>
          <Button 
            onClick={onOpenExplorer}
            icon="folder_open"
            title="Mis Formularios"
          />
          <Button 
            onClick={onPreview}
            icon="visibility"
            label="Vista Previa"
            className="px-4"
          />
          <Button 
            onClick={onSave}
            icon="save"
            label="Guardar"
            className="px-4"
          />
          <Button 
            onClick={() => {}}
            label="Publicar"
            variant="primary"
          />
        </div>
        <div className="w-px h-8 bg-border mx-2 hidden sm:block"></div>
        
        {/* Theme Controls */}
        <div className="flex gap-2">
          <Button
            onClick={toggleMode}
            variant="icon"
            icon={mode === 'dark' ? 'light_mode' : 'dark_mode'}
            title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          />
          <Button
            onClick={onThemeConfig}
            variant="icon"
            icon="palette"
            title="Configurar tema"
          />
        </div>
        
        <div className="w-px h-8 bg-border mx-2 hidden sm:block"></div>
        <div 
          className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-border cursor-pointer hover:border-primary transition-colors" 
          style={{ backgroundImage: 'url("https://picsum.photos/seed/user_avatar/200/200")' }}
          title="User Profile"
        ></div>
      </div>
    </header>
  );
};

export default Header;

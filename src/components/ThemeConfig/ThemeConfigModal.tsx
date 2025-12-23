import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { availableThemes } from '../../data/themes';

interface ThemeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeConfigModal: React.FC<ThemeConfigModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const [selectedThemeId, setSelectedThemeId] = useState(theme.id);

  if (!isOpen) return null;

  const handleApply = () => {
    const selected = availableThemes.find(t => t.id === selectedThemeId);
    if (selected) {
      setTheme(selected);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border-dark">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-dark bg-background-light dark:bg-background-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">palette</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Configuración de Tema</h2>
              <p className="text-sm text-text-secondary">Personaliza la apariencia de la aplicación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-text-secondary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Mode Toggle */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Modo de Apariencia</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={toggleMode}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  mode === 'light'
                    ? 'border-primary bg-primary/10'
                    : 'border-border-dark bg-white dark:bg-surface-dark hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">light_mode</span>
                <div className="text-left">
                  <div className="font-bold text-sm">Modo Claro</div>
                  <div className="text-xs text-text-secondary">Para ambientes bien iluminados</div>
                </div>
              </button>
              <button
                onClick={toggleMode}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  mode === 'dark'
                    ? 'border-primary bg-primary/10'
                    : 'border-border-dark bg-white dark:bg-surface-dark hover:border-primary/50'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">dark_mode</span>
                <div className="text-left">
                  <div className="font-bold text-sm">Modo Oscuro</div>
                  <div className="text-xs text-text-secondary">Reduce fatiga visual</div>
                </div>
              </button>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Esquema de Color</h3>
            <div className="grid grid-cols-1 gap-3">
              {availableThemes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedThemeId(t.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedThemeId === t.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border-dark bg-white dark:bg-surface-dark hover:border-primary/50'
                  }`}
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-8 h-8 rounded-lg border border-white/20" 
                      style={{ backgroundColor: t.colors.primary.main }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-lg border border-white/20" 
                      style={{ backgroundColor: mode === 'light' ? t.colors.background.light : t.colors.background.dark }}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-lg border border-white/20" 
                      style={{ backgroundColor: mode === 'light' ? t.colors.surface.light : t.colors.surface.dark }}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-text-secondary">
                      {t.id === 'default' && 'Tema predeterminado de la aplicación'}
                      {t.id === 'green' && 'Perfecto para empresas ecológicas'}
                      {t.id === 'purple' && 'Moderno y creativo'}
                      {t.id === 'orange' && 'Dinámico y energético'}
                    </div>
                  </div>
                  {selectedThemeId === t.id && (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Vista Previa</h3>
            <div className="border border-border-dark rounded-xl overflow-hidden">
              <div 
                className="h-2" 
                style={{ backgroundColor: availableThemes.find(t => t.id === selectedThemeId)?.colors.primary.main }}
              ></div>
              <div className="p-4 bg-white dark:bg-surface-dark space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: availableThemes.find(t => t.id === selectedThemeId)?.colors.primary.main }}
                  >
                    <span className="material-symbols-outlined text-sm">widgets</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">Componente de Ejemplo</div>
                    <div className="text-xs text-text-secondary">Así se verá tu aplicación</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="px-4 py-2 rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: availableThemes.find(t => t.id === selectedThemeId)?.colors.primary.main }}
                  >
                    Botón Principal
                  </button>
                  <button className="px-4 py-2 rounded-lg text-sm font-bold border border-border-dark bg-white dark:bg-surface-dark">
                    Botón Secundario
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border-dark bg-background-light dark:bg-background-dark flex justify-between items-center">
          <div className="text-xs text-text-secondary">
            Los cambios se aplicarán inmediatamente
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-bold border border-border-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg shadow-lg transition-colors"
            >
              Aplicar Tema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeConfigModal;

import React from 'react';
import { HistoryEntry } from '../../types/repository';

interface HistoryPanelProps {
  history: HistoryEntry[];
  currentIndex: number;
  onJumpToVersion: (index: number) => void;
  onClose: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, currentIndex, onJumpToVersion, onClose }) => {
  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-surface border-l border-border shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-bold text-text-primary">Historial de Cambios</h3>
        <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.map((entry, index) => {
          const isCurrent = index === currentIndex;
          const isFuture = index > currentIndex;
          
          return (
            <div 
              key={entry.id}
              onClick={() => onJumpToVersion(index)}
              className={`relative pl-6 cursor-pointer group ${isFuture ? 'opacity-50' : ''}`}
            >
              {/* Timeline Line */}
              {index !== history.length - 1 && (
                <div className="absolute left-[9px] top-2 bottom-[-16px] w-0.5 bg-border group-hover:bg-primary/30 transition-colors"></div>
              )}
              
              {/* Dot */}
              <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                isCurrent 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-border bg-surface group-hover:border-primary'
              }`}>
                {isCurrent && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>

              <div className={`ml-2 p-3 rounded-lg border transition-all ${
                isCurrent 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-background border-border hover:border-primary/50'
              }`}>
                <div className="text-sm font-medium text-text-primary">{entry.description}</div>
                <div className="text-xs text-text-secondary mt-1">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryPanel;

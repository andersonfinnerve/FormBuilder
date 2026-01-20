import React from 'react';
import { ScoreRange } from '@/types/questionnaire';

interface ResultConfigProps {
  results: ScoreRange[];
  onUpdate: (results: ScoreRange[]) => void;
}

const ResultConfig: React.FC<ResultConfigProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-xl">assignment_turned_in</span>
        <h3 className="text-lg font-bold text-text-primary">Configuración de Resultados</h3>
      </div>
      <p className="text-sm text-text-secondary">Rangos de puntaje definidos por la medición seleccionada (solo lectura).</p>

      {results.length > 0 ? (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[100px_100px_1fr_1fr] gap-4 px-6 py-3 bg-background border-b border-border">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Min</span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Max</span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Etiqueta</span>
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Descripción</span>
          </div>
          
          <div className="divide-y divide-border">
            {results.map((res) => (
              <div key={res.id} className="grid grid-cols-[100px_100px_1fr_1fr] gap-4 px-6 py-4 hover:bg-background/50 transition-colors">
                <div className="text-sm font-semibold text-text-primary">
                  {res.min}
                </div>
                <div className="text-sm font-semibold text-text-primary">
                  {res.max}
                </div>
                <div className="text-sm font-bold text-text-primary">
                  {res.label}
                </div>
                <div className="text-sm text-text-secondary">
                  {res.description || '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">info</span>
          <p className="text-sm">Selecciona una medición para ver los rangos de resultados</p>
        </div>
      )}
    </div>
  );
};

export default ResultConfig;

import React from 'react';
import { ScoreRange } from '@/types/questionnaire';
import { Input, Button } from '@/shared/components/ui';

interface ResultConfigProps {
  results: ScoreRange[];
  onUpdate: (results: ScoreRange[]) => void;
}

const ResultConfig: React.FC<ResultConfigProps> = ({ results, onUpdate }) => {
  const handleChange = (index: number, field: keyof ScoreRange, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    onUpdate(newResults);
  };

  const handleAdd = () => {
    const newResult: ScoreRange = {
      id: Date.now().toString(),
      min: 0,
      max: 10,
      label: 'Nuevo Perfil'
    };
    onUpdate([...results, newResult]);
  };

  const handleRemove = (index: number) => {
    const newResults = results.filter((_, i) => i !== index);
    onUpdate(newResults);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
        Configuración de Resultados
      </h3>
      <p className="text-sm text-text-secondary">Define los rangos de puntaje y el resultado correspondiente.</p>

      <div className="space-y-3">
        <div className="grid grid-cols-[80px_80px_1fr_40px] gap-3 px-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
          <span>Min</span>
          <span>Max</span>
          <span>Etiqueta del Resultado</span>
          <span></span>
        </div>

        {results.map((res, index) => (
          <div key={res.id} className="grid grid-cols-[80px_80px_1fr_40px] gap-3 items-center">
            <Input
              type="number"
              value={res.min}
              onChange={(e) => handleChange(index, 'min', parseInt(e.target.value) || 0)}
            />
            <Input
              type="number"
              value={res.max}
              onChange={(e) => handleChange(index, 'max', parseInt(e.target.value) || 0)}
            />
            <Input
              value={res.label}
              onChange={(e) => handleChange(index, 'label', e.target.value)}
              placeholder="Ej. Conservador"
            />
            <button
              onClick={() => handleRemove(index)}
              className="text-text-secondary hover:text-red-500 flex justify-center"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        ))}

        <Button
          onClick={handleAdd}
          label="Agregar Rango"
          icon="add_circle"
          variant="icon"
          className="p-0 text-sm font-bold hover:underline mt-2"
        />
      </div>
    </div>
  );
};

export default ResultConfig;

import React from 'react';
import { Question, AnswerOption } from '../../types/questionnaire';
import { Input, TextArea } from '../common/Input';
import AutocompleteInput from '../common/AutocompleteInput';
import { MASTER_DATA } from '../../data/mockMasterData';

interface QuestionItemProps {
  question: Question;
  onUpdate: (q: Question) => void;
  onDelete: (id: string) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, onUpdate, onDelete }) => {
  // Generar sugerencias desde datos maestros
  const questionSuggestions = MASTER_DATA
    .filter(md => md.type === 'registry') // Solo registros con opciones
    .map(md => ({
      id: md.id,
      text: md.name,
      description: md.description
    }));
  const handleOptionChange = (index: number, field: keyof AnswerOption, value: any) => {
    const newOptions = [...question.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdate({ ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newOption: AnswerOption = {
      id: Date.now().toString(),
      text: '',
      score: 0
    };
    onUpdate({ ...question, options: [...question.options, newOption] });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate({ ...question, options: newOptions });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-4 pl-2 space-y-4 animate-fadeIn relative group flex gap-2">
      <div className="pt-4 cursor-move text-text-secondary hover:text-text-primary flex-shrink-0" title="Arrastrar para reordenar">
        <span className="material-symbols-outlined">drag_indicator</span>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <label className="text-sm text-text-primary font-medium block mb-1.5">Pregunta</label>
            <AutocompleteInput
              value={question.text}
              onChange={(value) => onUpdate({ ...question, text: value })}
              suggestions={questionSuggestions}
              placeholder="¿Qué significa para usted una inversión de largo plazo?"
              className="font-bold text-lg"
            />
          </div>
          <button 
            onClick={() => onDelete(question.id)}
            className="text-text-secondary hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Eliminar pregunta"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-[1fr_100px_40px] gap-4 px-2 text-xs font-bold text-text-secondary uppercase tracking-wider">
            <span>Opción de Respuesta</span>
            <span className="text-center">Puntaje</span>
            <span></span>
          </div>
          
          {question.options.map((opt, index) => (
            <div key={opt.id} className="grid grid-cols-[1fr_100px_40px] gap-4 items-center">
              <Input
                value={opt.text}
                onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                placeholder="Texto de la opción"
              />
              <Input
                type="number"
                value={opt.score}
                onChange={(e) => handleOptionChange(index, 'score', parseInt(e.target.value) || 0)}
                className="text-center"
              />
              <button 
                onClick={() => handleRemoveOption(index)}
                className="text-text-secondary hover:text-red-500 flex justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          ))}
          
          <button 
            onClick={handleAddOption}
            className="text-primary text-sm font-bold hover:underline flex items-center gap-1 mt-2"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Agregar Opción
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;

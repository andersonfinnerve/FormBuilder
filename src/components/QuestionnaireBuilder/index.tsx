import React, { useState } from 'react';
import { QuestionnaireConfig, Question } from '../../types/questionnaire';
import QuestionItem from './QuestionItem';
import ResultConfig from './ResultConfig';
import { Input } from '../common/Input';

const initialConfig: QuestionnaireConfig = {
  title: 'Perfil de Inversionista',
  description: 'Cuestionario para determinar el perfil de riesgo del cliente.',
  questions: [
    {
      id: '1',
      text: '¿Qué significa para usted una inversión de largo plazo?',
      options: [
        { id: '1a', text: 'Menor a 1 año', score: 0 },
        { id: '1b', text: 'Entre 1 y 3 años', score: 1 },
        { id: '1c', text: 'Entre 3 y 5 años', score: 4 },
        { id: '1d', text: 'Mayor a 5 años', score: 8 },
      ]
    }
  ],
  results: [
    { id: 'r1', min: 0, max: 10, label: 'Muy Conservador' },
    { id: 'r2', min: 11, max: 20, label: 'Conservador' },
    { id: 'r3', min: 21, max: 30, label: 'Moderado' },
    { id: 'r4', min: 31, max: 100, label: 'Agresivo' },
  ]
};

const QuestionnaireBuilder: React.FC = () => {
  const [config, setConfig] = useState<QuestionnaireConfig>(initialConfig);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleUpdateQuestion = (updatedQuestion: Question) => {
    const newQuestions = config.questions.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setConfig({ ...config, questions: newQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      options: [{ id: Date.now().toString() + 'o', text: '', score: 0 }]
    };
    setConfig({ ...config, questions: [...config.questions, newQuestion] });
  };

  const handleDeleteQuestion = (id: string) => {
    const newQuestions = config.questions.filter(q => q.id !== id);
    setConfig({ ...config, questions: newQuestions });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    // Prevent drag on inputs
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'BUTTON') {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newQuestions = [...config.questions];
    const [draggedItem] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedItem);
    
    setConfig({ ...config, questions: newQuestions });
    setDraggedIndex(null);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="space-y-4">
            <Input
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="text-2xl font-bold bg-transparent border-transparent hover:border-border focus:border-primary px-0"
              placeholder="Título del Cuestionario"
            />
            <Input
              value={config.description || ''}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="text-text-secondary bg-transparent border-transparent hover:border-border focus:border-primary px-0"
              placeholder="Descripción opcional"
            />
          </div>

          <div className="h-px bg-border w-full"></div>

          {/* Questions List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-primary">Preguntas</h2>
              <button 
                onClick={handleAddQuestion}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">add</span>
                Nueva Pregunta
              </button>
            </div>

            {config.questions.map((q, index) => (
              <div
                key={q.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`transition-all duration-200 ${draggedIndex === index ? 'opacity-40' : 'opacity-100'}`}
              >
                <QuestionItem 
                  question={q} 
                  onUpdate={handleUpdateQuestion}
                  onDelete={handleDeleteQuestion}
                />
              </div>
            ))}

            {config.questions.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-text-secondary">
                <span className="material-symbols-outlined text-4xl mb-2">quiz</span>
                <p>No hay preguntas configuradas.</p>
              </div>
            )}
          </div>

          <div className="h-px bg-border w-full"></div>

          {/* Results Configuration */}
          <ResultConfig 
            results={config.results} 
            onUpdate={(results) => setConfig({ ...config, results })} 
          />

        </div>
      </div>
    </div>
  );
};

export default QuestionnaireBuilder;

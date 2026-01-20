import React, { useState } from 'react';
import { QuestionnaireConfig, Question, ScoringSystem, Indicator } from '@/types/questionnaire';
import QuestionItem from '../QuestionItem/QuestionItem';
import ResultConfig from '../ResultConfig/ResultConfig';
import { QuestionnairePreviewModal } from '../QuestionnairePreview';
import { Input, Button, Select } from '@/shared/components/ui';
import { initialQuestionnaire } from '@/data/seeds';
import { mockMeasurements, mockIndicatorGroups } from '@/data/mock';

const QuestionnaireBuilder: React.FC = () => {
  const [config, setConfig] = useState<QuestionnaireConfig>(initialQuestionnaire.structureQuestionnaire);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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
      weight: 1, // Peso por defecto
      options: [{ id: Date.now().toString() + 'o', text: '', score: 0 }]
    };
    setConfig({ ...config, questions: [...config.questions, newQuestion] });
  };

  const handleDeleteQuestion = (id: string) => {
    const newQuestions = config.questions.filter(q => q.id !== id);
    setConfig({ ...config, questions: newQuestions });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDragOverIndex(null);
      return;
    }

    const newQuestions = [...config.questions];
    const [draggedItem] = newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(targetIndex, 0, draggedItem);

    setConfig({ ...config, questions: newQuestions });
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Input
                value={config.title}
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="text-2xl font-bold bg-transparent border-transparent hover:border-border focus:border-primary px-0 flex-1"
                placeholder="Título del Cuestionario"
              />
              <Button
                onClick={() => setIsPreviewOpen(true)}
                disabled={config.questions.length === 0}
                variant="secondary"
                icon="play_circle"
                label="Vista Previa"
              />
            </div>
            <Input
              value={config.description || ''}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="text-text-secondary bg-transparent border-transparent hover:border-border focus:border-primary px-0"
              placeholder="Descripción opcional"
            />
          </div>

          <div className="h-px bg-border w-full"></div>

          {/* Configuraciones Principales */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary">Configuración General</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sistema de Puntaje */}
              <div>
                <Select
                  label="Sistema de Puntaje"
                  value={config.scoringSystem}
                  onChange={(e) => setConfig({ ...config, scoringSystem: e.target.value as ScoringSystem })}
                  description={config.scoringSystem === 'weighted' 
                    ? 'Cada pregunta tiene un peso que afecta el puntaje final' 
                    : 'Todas las preguntas tienen el mismo peso'}
                >
                  <option value="weighted">Ponderado</option>
                  <option value="count">Conteo</option>
                </Select>
              </div>

              {/* Medición */}
              <div>
                <Select
                  label="Medición"
                  value={config.measurementId || ''}
                  onChange={(e) => {
                    const selectedMeasurement = mockMeasurements.find(m => m.id === e.target.value);
                    setConfig({ 
                      ...config, 
                      measurementId: e.target.value,
                      results: selectedMeasurement?.results || config.results
                    });
                  }}
                  description="La medición define los rangos de resultados del cuestionario"
                >
                  <option value="">Seleccionar medición...</option>
                  {mockMeasurements.map(measurement => (
                    <option key={measurement.id} value={measurement.id}>
                      {measurement.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            {/* Grupo de Indicadores */}
            <div>
              <Select
                label="Grupo de Indicadores"
                value={config.indicatorGroupId || ''}
                onChange={(e) => {
                  const selectedGroup = mockIndicatorGroups.find(g => g.id === e.target.value);
                  setConfig({ 
                    ...config, 
                    indicatorGroupId: e.target.value,
                    indicators: selectedGroup?.indicators || config.indicators
                  });
                }}
                description="El grupo de indicadores define las opciones disponibles para clasificar las respuestas"
              >
                <option value="">Seleccionar grupo de indicadores...</option>
                {mockIndicatorGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
              {config.indicatorGroupId && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {config.indicators.map(indicator => (
                    <div
                      key={indicator.id}
                      className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                      title={indicator.description}
                    >
                      {indicator.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-border w-full"></div>

          {/* Questions List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-primary">Preguntas</h2>
              {/* <button
                onClick={handleAddQuestion}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">add</span>
                Nueva Pregunta
              </button> */}
               <Button
                onClick={handleAddQuestion}
                disabled={false}
                variant="primary"
                icon="add"
                label="Nueva Pregunta"
              />
            </div>

            {config.questions.map((q, index) => (
              <div
                key={q.id}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className={`transition-all duration-300 ease-in-out ${
                  draggedIndex === index 
                    ? 'opacity-50 scale-95' 
                    : dragOverIndex === index
                    ? 'transform scale-[1.02] shadow-lg ring-2 ring-primary/50'
                    : 'opacity-100 scale-100'
                }`}
              >
                <QuestionItem
                  question={q}
                  index={index}
                  onUpdate={handleUpdateQuestion}
                  onDelete={handleDeleteQuestion}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === index}
                  availableIndicators={config.indicators}
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

      {/* Preview Modal */}
      {isPreviewOpen && (
        <QuestionnairePreviewModal
          config={config}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default QuestionnaireBuilder;

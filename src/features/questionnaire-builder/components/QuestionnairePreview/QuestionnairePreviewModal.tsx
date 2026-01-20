import React, { useState } from 'react';
import { QuestionnaireConfig, Question, QuestionnaireResult } from '@/types/questionnaire';
import { Title, Button } from '@/shared/components/ui';

interface QuestionnairePreviewModalProps {
  config: QuestionnaireConfig;
  onClose: () => void;
}

const QuestionnairePreviewModal: React.FC<QuestionnairePreviewModalProps> = ({ config, onClose }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    config.questions.forEach((question: Question) => {
      const selectedOptionId = answers[question.id];
      if (!selectedOptionId) return;

      const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
      if (!selectedOption) return;

      if (config.scoringSystem === 'weighted') {
        totalScore += selectedOption.score * question.weight;
        totalWeight += question.weight;
      } else {
        totalScore += selectedOption.score;
        totalWeight += 1;
      }
    });

    // Normalizar el puntaje a escala de 0-100
    const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    return normalizedScore;
  };

  const getResultForScore = (score: number): QuestionnaireResult | null => {
    // Ordenar resultados por minScore descendente
    const sortedResults = [...config.results].sort((a, b) => b.minScore - a.minScore);
    
    // Encontrar el primer resultado donde el score sea mayor o igual al minScore
    const matchedResult = sortedResults.find(r => score >= r.minScore);
    return matchedResult || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar que todas las preguntas estén respondidas
    const unansweredQuestions = config.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      alert(`Por favor responde todas las preguntas. Faltan ${unansweredQuestions.length} pregunta(s).`);
      return;
    }

    const score = calculateScore();
    const matchedResult = getResultForScore(score);
    
    setCalculatedScore(score);
    setResult(matchedResult);
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
    setCalculatedScore(0);
    setResult(null);
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = config.questions.length;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <Title title="Vista Previa del Cuestionario" icon="quiz" />
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 rounded-lg text-text-secondary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-surface">
          {showResults ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-primary/10 border border-primary/20 text-primary p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-3xl">emoji_events</span>
                  <div>
                    <h3 className="font-bold text-lg">¡Cuestionario Completado!</h3>
                    <p className="text-sm opacity-90">Has respondido todas las preguntas</p>
                  </div>
                </div>
              </div>

              <div className="bg-background p-6 rounded-lg border border-border space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-text-primary">Tu Puntaje</h3>
                  <div className="text-3xl font-bold text-primary">
                    {calculatedScore.toFixed(1)}
                    <span className="text-base text-text-secondary ml-1">/100</span>
                  </div>
                </div>
                
                <div className="w-full bg-border rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500"
                    style={{ width: `${calculatedScore}%` }}
                  />
                </div>

                {result && (
                  <div className="mt-6 p-4 bg-surface rounded-lg border border-border">
                    <h4 className="font-bold text-lg text-text-primary mb-2">{result.label}</h4>
                    <p className="text-text-secondary">{result.description}</p>
                    {result.recommendation && (
                      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          <span className="font-semibold">Recomendación: </span>
                          {result.recommendation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-background p-4 rounded-lg border border-border">
                <h4 className="font-semibold text-text-primary mb-3">Detalle de Respuestas</h4>
                <div className="space-y-3">
                  {config.questions.map((question, index) => {
                    const selectedOptionId = answers[question.id];
                    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
                    
                    return (
                      <div key={question.id} className="text-sm border-b border-border pb-3 last:border-b-0">
                        <p className="font-medium text-text-primary mb-1">
                          {index + 1}. {question.text}
                        </p>
                        <p className="text-text-secondary">
                          → {selectedOption?.text} 
                          <span className="ml-2 text-primary">
                            ({selectedOption?.score} pts)
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleReset}
                variant="secondary"
                icon="refresh"
                label="Reiniciar Cuestionario"
                className="w-full"
              />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header */}
              <div className="border-b border-border pb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{config.title}</h2>
                {config.description && (
                  <p className="text-text-secondary">{config.description}</p>
                )}
              </div>

              {/* Progress Bar */}
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    Progreso: {answeredCount} de {totalQuestions}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {progress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {config.questions.map((question, index) => (
                  <div 
                    key={question.id}
                    className="bg-background p-6 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                          {question.text}
                        </h3>
                        {question.indicator && (
                          <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                            {question.indicator.name}
                          </span>
                        )}
                      </div>
                      {config.scoringSystem === 'weighted' && question.weight !== 1 && (
                        <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded border border-border">
                          Peso: {question.weight}x
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 ml-11">
                      {question.options.map(option => (
                        <label
                          key={option.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                            answers[question.id] === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/30 hover:bg-surface'
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            value={option.id}
                            checked={answers[question.id] === option.id}
                            onChange={() => handleAnswerChange(question.id, option.id)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                          <span className="flex-1 text-text-primary">{option.text}</span>
                          <span className="text-xs text-text-secondary px-2 py-1 bg-surface rounded border border-border">
                            {option.score} pts
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4 border-t border-border">
                <Button
                  type="submit"
                  disabled={answeredCount !== totalQuestions}
                  variant="primary"
                  icon="send"
                  label={answeredCount === totalQuestions ? 'Ver Resultados' : `Responde ${totalQuestions - answeredCount} pregunta(s) más`}
                  className="flex-1"
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePreviewModal;

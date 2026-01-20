import React from 'react';
import { Button } from '@/shared/components/ui';
import { FormSubmission } from '@/types/formData';

interface SubmissionSuccessProps {
  submission: FormSubmission;
  onReset: () => void;
  onViewSubmissions?: () => void;
  onClose?: () => void;
}

const SubmissionSuccess: React.FC<SubmissionSuccessProps> = ({
  submission,
  onReset,
  onViewSubmissions,
  onClose
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const [showRawData, setShowRawData] = React.useState(false);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Success Header */}
      <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
          <div>
            <h3 className="font-bold text-lg">¡Formulario enviado con éxito!</h3>
            <p className="text-sm opacity-90">Los datos se han guardado correctamente.</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded border border-green-500/20">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs opacity-75 mb-1">ID de Envío</p>
              <p className="font-mono font-semibold">{submission.id.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-xs opacity-75 mb-1">Formulario</p>
              <p className="font-semibold">{submission.formName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs opacity-75 mb-1">Fecha y Hora</p>
              <p className="font-semibold">
                {new Date(submission.submittedAt).toLocaleString('es-ES', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structure Section - Following InitialFormStructure format */}
      <div className="bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-4 flex items-center justify-between hover:bg-surface dark:hover:bg-surface-dark transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_tree</span>
            <span className="font-semibold text-text-primary">Ver estructura completa (InitialFormStructure)</span>
          </div>
          <span className={`material-symbols-outlined transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </button>
        
        {showDetails && (
          <div className="p-4 border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
            <div className="mb-2 text-xs text-text-secondary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>Estructura completa siguiendo el formato InitialFormStructure con valores llenados</span>
            </div>
            <pre className="text-xs font-mono text-text-primary dark:text-gray-300 overflow-x-auto whitespace-pre-wrap p-4 bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark max-h-96 overflow-y-auto custom-scrollbar">
              {JSON.stringify({
                FormId: submission.FormId,
                Name: submission.Name,
                Description: submission.Description,
                StructureForm: submission.StructureForm
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Raw Data Section - Quick access */}
      {submission.rawData && (
        <div className="bg-background dark:bg-background-dark rounded-lg border border-border dark:border-border-dark overflow-hidden">
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="w-full p-4 flex items-center justify-between hover:bg-surface dark:hover:bg-surface-dark transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">data_object</span>
              <span className="font-semibold text-text-primary">Ver datos planos (acceso rápido)</span>
            </div>
            <span className={`material-symbols-outlined transition-transform ${showRawData ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
          
          {showRawData && (
            <div className="p-4 border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
              <div className="mb-2 text-xs text-text-secondary flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                <span>Valores planos para acceso rápido (key-value pairs)</span>
              </div>
              <pre className="text-xs font-mono text-text-primary dark:text-gray-300 overflow-x-auto whitespace-pre-wrap p-4 bg-background dark:bg-background-dark rounded border border-border dark:border-border-dark">
                {JSON.stringify(submission.rawData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onReset}
          variant="secondary"
          icon="refresh"
          label="Nuevo Envío"
          className="flex-1"
        />
        {onClose && (
          <Button
            onClick={onClose}
            variant="secondary"
            icon="close"
            label="Cerrar"
            className="flex-1"
          />
        )}
        {onViewSubmissions && (
          <Button
            onClick={onViewSubmissions}
            variant="primary"
            icon="inbox"
            label="Ver Todos los Envíos"
            className="flex-1"
          />
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            <p className="font-semibold mb-1">Los datos se han guardado localmente</p>
            <p className="text-xs opacity-90">
              Puedes acceder a todos los envíos desde el panel de administración. 
              Los datos persisten en tu navegador hasta que los elimines manualmente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSuccess;

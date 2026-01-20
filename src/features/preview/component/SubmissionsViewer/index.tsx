import React, { useState, useEffect } from 'react';
import { FormSubmission } from '@/types/formData';
import { getAllSubmissions, deleteSubmission, updateSubmissionStatus } from '@/core/services/formDataService';
import { Title, Button } from '@/shared/components/ui';

interface SubmissionsViewerProps {
  onClose: () => void;
  formId?: string;
}

const SubmissionsViewer: React.FC<SubmissionsViewerProps> = ({ onClose, formId }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'submitted' | 'reviewed'>('all');

  useEffect(() => {
    loadSubmissions();
  }, [formId, filterStatus]);

  const loadSubmissions = () => {
    let allSubmissions = getAllSubmissions();
    
    // Filter by formId if provided
    if (formId) {
      allSubmissions = allSubmissions.filter(s => s.formId === formId);
    }
    
    // Filter by status
    if (filterStatus !== 'all') {
      allSubmissions = allSubmissions.filter(s => s.status === filterStatus);
    }
    
    // Sort by date (newest first)
    allSubmissions.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    
    setSubmissions(allSubmissions);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este envío?')) {
      deleteSubmission(id);
      loadSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleStatusChange = (id: string, status: 'draft' | 'submitted' | 'reviewed') => {
    updateSubmissionStatus(id, status);
    loadSubmissions();
    if (selectedSubmission?.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      case 'submitted': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'reviewed': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return 'draft';
      case 'submitted': return 'send';
      case 'reviewed': return 'check_circle';
      default: return 'help';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-surface w-full max-w-7xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
          <Title title="Envíos de Formularios" icon="inbox" />
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-text-secondary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border bg-surface flex items-center gap-3">
          <span className="text-sm text-text-secondary">Filtrar:</span>
          <div className="flex gap-2">
            {['all', 'draft', 'submitted', 'reviewed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-text-secondary border-border hover:border-primary/50'
                }`}
              >
                {status === 'all' ? 'Todos' : status === 'draft' ? 'Borradores' : status === 'submitted' ? 'Enviados' : 'Revisados'}
              </button>
            ))}
          </div>
          <div className="ml-auto text-sm text-text-secondary">
            {submissions.length} {submissions.length === 1 ? 'envío' : 'envíos'}
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* List */}
          <div className="w-1/3 border-r border-border overflow-y-auto custom-scrollbar">
            {submissions.length === 0 ? (
              <div className="p-8 text-center text-text-secondary">
                <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                <p>No hay envíos para mostrar</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {submissions.map(submission => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-surface ${
                      selectedSubmission?.id === submission.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-text-primary text-sm">
                        {submission.formName}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusColor(submission.status)} flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-xs">{getStatusIcon(submission.status)}</span>
                        {submission.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-1 font-mono">
                      ID: {submission.id.slice(0, 12)}...
                    </p>
                    <p className="text-xs text-text-secondary">
                      {new Date(submission.submittedAt).toLocaleString('es-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {selectedSubmission ? (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-2">
                    {selectedSubmission.formName}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      {new Date(selectedSubmission.submittedAt).toLocaleString('es-ES')}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">fingerprint</span>
                      {selectedSubmission.id}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="bg-background p-4 rounded-lg border border-border">
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Estado del envío
                  </label>
                  <div className="flex gap-2">
                    {['draft', 'submitted', 'reviewed'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedSubmission.id, status as any)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors flex items-center gap-2 ${
                          selectedSubmission.status === status
                            ? getStatusColor(status)
                            : 'bg-surface text-text-secondary border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{getStatusIcon(status)}</span>
                        {status === 'draft' ? 'Borrador' : status === 'submitted' ? 'Enviado' : 'Revisado'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Structure Data */}
                <div className="bg-background p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">account_tree</span>
                    Estructura del Formulario
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">FormId:</span>
                      <span className="text-text-primary font-mono">{selectedSubmission.FormId || 'null'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Name:</span>
                      <span className="text-text-primary">{selectedSubmission.Name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Description:</span>
                      <span className="text-text-primary">{selectedSubmission.Description || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Campos en StructureForm:</span>
                      <span className="text-text-primary font-semibold">{selectedSubmission.StructureForm?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Raw Data - Quick Access */}
                {selectedSubmission.rawData && (
                  <div className="bg-background p-4 rounded-lg border border-border">
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">data_object</span>
                      Datos Planos (Acceso Rápido)
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(selectedSubmission.rawData).map(([key, value]) => (
                        <div key={key} className="border-b border-border pb-3 last:border-0">
                          <p className="text-sm font-medium text-text-secondary mb-1">{key}</p>
                          <p className="text-text-primary">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || '—')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Raw JSON */}
                <details className="bg-background rounded-lg border border-border overflow-hidden">
                  <summary className="p-4 cursor-pointer hover:bg-surface transition-colors font-semibold text-text-primary">
                    Ver JSON completo
                  </summary>
                  <div className="p-4 border-t border-border">
                    <pre className="text-xs font-mono text-text-primary overflow-x-auto whitespace-pre-wrap p-4 bg-surface rounded">
                      {JSON.stringify(selectedSubmission, null, 2)}
                    </pre>
                  </div>
                </details>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={() => handleDelete(selectedSubmission.id)}
                    variant="secondary"
                    icon="delete"
                    label="Eliminar Envío"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(selectedSubmission.data, null, 2));
                      alert('Datos copiados al portapapeles');
                    }}
                    variant="primary"
                    icon="content_copy"
                    label="Copiar Datos"
                    className="flex-1"
                  />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-text-secondary">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl mb-3 block opacity-30">
                    touch_app
                  </span>
                  <p>Selecciona un envío para ver sus detalles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsViewer;

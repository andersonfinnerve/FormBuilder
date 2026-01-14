import React from 'react';
import { useFormRepository } from '../../../../core/contexts/FormRepositoryContext';
import { FormMetadata } from '../../../../types/repository';

interface FormExplorerProps {
  onLoad: (id: string) => void;
  onClose: () => void;
}

const FormExplorer: React.FC<FormExplorerProps> = ({ onLoad, onClose }) => {
  const { getAllFormsMetadata, deleteForm } = useFormRepository();
  const forms = getAllFormsMetadata();

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Mis Formularios</h2>
            <p className="text-sm text-text-secondary">Gestiona tus formularios guardados</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-secondary rounded-full text-text-secondary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {forms.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              <span className="material-symbols-outlined text-4xl mb-2">folder_open</span>
              <p>No tienes formularios guardados aún.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {forms.map((form) => (
                <div key={form.id} className="bg-background border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-colors group">
                  <div>
                    <h3 className="font-medium text-text-primary">{form.name}</h3>
                    <div className="flex gap-4 mt-1 text-xs text-text-secondary">
                      <span>v{form.version}</span>
                      <span>Actualizado: {new Date(form.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onLoad(form.id)}
                      className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-md text-sm font-medium transition-colors"
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => {
                        if(confirm('¿Estás seguro de eliminar este formulario?')) deleteForm(form.id);
                      }}
                      className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormExplorer;

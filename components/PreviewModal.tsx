import React, { useState } from 'react';
import { FormField, GridColumn, parseRichText, SharedFieldDefinition } from '../App';

interface PreviewModalProps {
  fields: FormField[];
  onClose: () => void;
  sharedLibrary: SharedFieldDefinition[]; // Recibir librería
}

const PreviewModal: React.FC<PreviewModalProps> = ({ fields, onClose, sharedLibrary }) => {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<string | null>(null);

  const handleChange = (id: string, value: any) => {
    setFormValues(prev => ({ ...prev, [id]: value }));
  };

  // Grid Handlers
  const handleGridAddRow = (fieldId: string, columns: GridColumn[]) => {
    const currentRows = formValues[fieldId] || [];
    const newRow = columns.reduce((acc, col) => ({ ...acc, [col.label]: '' }), {});
    setFormValues(prev => ({ ...prev, [fieldId]: [...currentRows, newRow] }));
  };

  const handleGridRemoveRow = (fieldId: string, rowIndex: number) => {
    const currentRows = formValues[fieldId] || [];
    const newRows = currentRows.filter((_: any, index: number) => index !== rowIndex);
    setFormValues(prev => ({ ...prev, [fieldId]: newRows }));
  };

  const handleGridCellChange = (fieldId: string, rowIndex: number, columnLabel: string, value: string) => {
    const currentRows = formValues[fieldId] || [];
    const newRows = [...currentRows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnLabel]: value };
    setFormValues(prev => ({ ...prev, [fieldId]: newRows }));
  };

  const isFieldVisible = (field: FormField) => {
    if (!field.logic || !field.logic.enabled || !field.logic.triggerId) return true;
    const triggerValue = formValues[field.logic.triggerId];
    return triggerValue === field.logic.value;
  };

  // Recursive render function for fields
  const renderField = (field: FormField) => {
      if (!isFieldVisible(field)) return null;

      // Handle SECTION
      if (field.type === 'section') {
          return (
              <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} border border-slate-200 dark:border-border-dark rounded-xl p-6 bg-slate-50 dark:bg-black/20 space-y-4 animate-fadeIn`}>
                  <div className="border-b border-slate-200 dark:border-border-dark pb-2">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                          {field.label}
                      </h3>
                      {field.description && (
                          <div className="text-sm text-text-secondary mt-1" dangerouslySetInnerHTML={parseRichText(field.description)} />
                      )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {field.children?.map(child => renderField(child))}
                  </div>
              </div>
          );
      }

      // Handle standard fields
      if (field.type === 'spacer') {
          return <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} hidden md:block`}></div>;
      }
      if (field.type === 'divider') {
          return <div key={field.id} className="md:col-span-2 py-4"><hr className="border-slate-200 dark:border-border-dark" /></div>;
      }
      
      
      if (field.type === 'grid') {
            const rows = formValues[field.id] || [];
            const columns = field.columns || [];
            return (
                <div key={field.id} className="md:col-span-2 space-y-2 animate-fadeIn">
                    <label className="block text-sm font-bold text-slate-700 dark:text-white">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="overflow-x-auto border border-slate-200 dark:border-border-dark rounded-lg">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 dark:text-white uppercase bg-slate-100 dark:bg-surface-dark border-b border-slate-200 dark:border-border-dark">
                                <tr>
                                    {columns.map((col, i) => (
                                        <th key={col.id || i} className="px-4 py-3 whitespace-nowrap">{col.label}</th>
                                    ))}
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row: any, rowIndex: number) => (
                                    <tr key={rowIndex} className="bg-white dark:bg-background-dark border-b border-slate-200 dark:border-border-dark">
                                        {columns.map((col, colIndex) => {
                                            // Resolver opciones: Prioridad sharedSource > options
                                            let options = col.options;
                                            if (col.sharedSource) {
                                                const sharedDef = sharedLibrary.find(s => s.id === col.sharedSource);
                                                if (sharedDef) {
                                                    options = sharedDef.options;
                                                }
                                            }

                                            return (
                                            <td key={col.id || colIndex} className="p-2">
                                                {col.type === 'select' ? (
                                                  <select value={row[col.label] || ''} onChange={(e) => handleGridCellChange(field.id, rowIndex, col.label, e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-primary outline-none px-2 py-1 text-slate-900 dark:text-white">
                                                    <option value="">Seleccionar...</option>
                                                    {options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                                                  </select>
                                                ) : (
                                                  <input type="text" value={row[col.label] || ''} onChange={(e) => handleGridCellChange(field.id, rowIndex, col.label, e.target.value)} className="w-full bg-transparent border-b border-transparent focus:border-primary outline-none px-2 py-1 text-slate-900 dark:text-white" />
                                                )}
                                            </td>
                                            );
                                        })}
                                        <td className="p-2 text-center">
                                            <button type="button" onClick={() => handleGridRemoveRow(field.id, rowIndex)} className="text-slate-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-text-secondary italic">No hay datos.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                    <button type="button" onClick={() => handleGridAddRow(field.id, columns)} className="text-sm font-medium text-primary hover:text-blue-400 flex items-center gap-1 mt-2">
                        <span className="material-symbols-outlined text-lg">add_circle</span> Agregar Fila
                    </button>
                </div>
            );
      }

      if (field.type === 'file' && field.fileStyle === 'button') {
            return (
            <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-4 pt-2 animate-fadeIn`}>
                    <label className="block text-sm font-bold text-slate-500 dark:text-text-secondary uppercase tracking-wider">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {(field.description || field.downloadUrl) && (
                    <div className="text-sm text-slate-700 dark:text-white leading-relaxed">
                        {field.description && <div dangerouslySetInnerHTML={parseRichText(field.description)} />}
                        {field.downloadUrl && (
                            <div className="mt-2"><a href={field.downloadUrl} className="text-primary font-bold inline-flex items-center gap-1"><span className="material-symbols-outlined text-lg">description</span>{field.downloadText || "Descargar"}</a></div>
                        )}
                    </div>
                    )}
                    <button type="button" className="bg-green-500 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow"><span className="material-symbols-outlined">add</span>Agregar archivo</button>
            </div>
            )
      }

      // Generic Field Render
      return (
        <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-2 animate-fadeIn`}>
          <label className="block text-sm font-bold text-slate-700 dark:text-white">
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </label>
          
          {field.type === 'textarea' ? (
             <textarea className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" rows={3} onChange={(e) => handleChange(field.id, e.target.value)} />
          ) : field.type === 'select' ? (
             <div className="relative">
                 <select className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none" onChange={(e) => handleChange(field.id, e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                 </select>
                 <span className="material-symbols-outlined absolute right-3 top-3 text-text-secondary pointer-events-none">expand_more</span>
             </div>
          ) : field.type === 'checkbox' ? (
             <div className="flex items-center gap-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-primary" onChange={(e) => handleChange(field.id, e.target.checked)} />
                <label className="text-sm text-slate-700 dark:text-white">{field.placeholder || 'Aceptar'}</label>
             </div>
          ) : field.type === 'radio' ? (
             <div className="space-y-2">
               {field.options?.map((opt, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <input type="radio" name={field.id} className="w-4 h-4 border-gray-300 dark:border-gray-600 text-primary" onChange={(e) => handleChange(field.id, e.target.value)} value={opt} />
                   <span className="text-sm text-slate-700 dark:text-white">{opt}</span>
                 </div>
               ))}
             </div>
          ) : field.type === 'file' ? (
            <div className="border-2 border-dashed border-slate-300 dark:border-border-dark rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary bg-slate-50 dark:bg-background-dark/50"><span className="material-symbols-outlined text-3xl mb-2">cloud_upload</span><span className="text-xs">Subir archivo</span></div>
          ) : (
             <input type={field.type} className="w-full bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-border-dark rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" onChange={(e) => handleChange(field.id, e.target.value)} />
          )}

          {field.description && <div className="text-xs text-text-secondary" dangerouslySetInnerHTML={parseRichText(field.description)} />}
        </div>
      );
  };

  // Helper to collect data recursively
  const collectData = (nodes: FormField[], target: Record<string, any>) => {
      nodes.forEach(field => {
          if (isFieldVisible(field)) {
              if (field.type !== 'section' && field.type !== 'spacer' && field.type !== 'divider') {
                  target[field.id] = formValues[field.id];
              }
              if (field.children) {
                  collectData(field.children, target);
              }
          }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const visibleValues: Record<string, any> = {};
    collectData(fields, visibleValues);
    setSubmittedData(JSON.stringify(visibleValues, null, 2));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-surface-dark w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border-dark">
        <div className="flex items-center justify-between p-4 border-b border-border-dark bg-background-light dark:bg-background-dark">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">play_circle</span>
            Vista Previa del Formulario
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg text-text-secondary transition-colors"><span className="material-symbols-outlined">close</span></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white dark:bg-surface-dark">
          {submittedData ? (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-lg flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
                <div><h3 className="font-bold">¡Formulario enviado con éxito!</h3><p className="text-sm opacity-90">Los datos se han procesado correctamente.</p></div>
              </div>
              <div className="bg-slate-100 dark:bg-background-dark p-4 rounded-lg border border-border-dark">
                <pre className="text-xs font-mono text-slate-700 dark:text-gray-300 overflow-x-auto whitespace-pre-wrap">{submittedData}</pre>
              </div>
              <button onClick={() => setSubmittedData(null)} className="text-primary hover:underline text-sm font-medium">Volver al formulario</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.length === 0 ? (
                  <div className="col-span-2 text-center py-10 text-text-secondary"><span className="material-symbols-outlined text-4xl mb-2">block</span><p>El formulario está vacío.</p></div>
                ) : (
                  fields.map((field) => renderField(field))
                )}
              </div>
              {fields.length > 0 && <div className="pt-4 flex justify-end"><button type="submit" className="px-6 py-2.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-95">Enviar Datos</button></div>}
            </form>
          )}
        </div>
        
        <div className="p-4 border-t border-border-dark bg-background-light dark:bg-background-dark text-center">
          <p className="text-xs text-text-secondary">Simulación real de vista usuario.</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
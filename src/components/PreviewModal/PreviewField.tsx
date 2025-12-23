import React from 'react';
import { FormField, GridColumn, SharedFieldDefinition } from '../../types';
import { parseRichText } from '../../utils/richText';
import { Input, TextArea } from '../common/Input';
import { Select } from '../common/Select';

interface PreviewFieldProps {
  field: FormField;
  formValues: Record<string, any>;
  sharedLibrary: SharedFieldDefinition[];
  onChange: (id: string, value: any) => void;
  onGridAddRow: (fieldId: string, columns: GridColumn[]) => void;
  onGridRemoveRow: (fieldId: string, rowIndex: number) => void;
  onGridCellChange: (fieldId: string, rowIndex: number, columnLabel: string, value: any) => void;
  isFieldVisible: (field: FormField) => boolean;
}

const PreviewField: React.FC<PreviewFieldProps> = ({
  field,
  formValues,
  sharedLibrary,
  onChange,
  onGridAddRow,
  onGridRemoveRow,
  onGridCellChange,
  isFieldVisible
}) => {
  if (!isFieldVisible(field)) return null;

  // Handle SECTION
  if (field.type === 'section') {
    return (
      <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} border border-border rounded-xl p-6 bg-surface space-y-4 animate-fadeIn`}>
        <div className="border-b border-border pb-2">
          <h3 className="text-lg font-bold text-text-primary uppercase tracking-wide">
            {field.label}
          </h3>
          {field.description && (
            <div className="text-sm text-text-secondary mt-1" dangerouslySetInnerHTML={parseRichText(field.description)} />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {field.children?.map(child => (
            <PreviewField 
              key={child.id}
              field={child}
              formValues={formValues}
              sharedLibrary={sharedLibrary}
              onChange={onChange}
              onGridAddRow={onGridAddRow}
              onGridRemoveRow={onGridRemoveRow}
              onGridCellChange={onGridCellChange}
              isFieldVisible={isFieldVisible}
            />
          ))}
        </div>
      </div>
    );
  }

  // Handle standard fields
  if (field.type === 'spacer') {
    return <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} hidden md:block`}></div>;
  }
  
  if (field.type === 'divider') {
    return <div key={field.id} className="md:col-span-2 py-4"><hr className="border-border border-border-dark" /></div>;
  }
  
  if (field.type === 'grid') {
    const rows = formValues[field.id] || [];
    const columns = field.columns || [];
    return (
      <div key={field.id} className="md:col-span-2 space-y-2 animate-fadeIn">
        <label className="block text-sm font-bold text-text-primary">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-text-primary uppercase bg-surface border-b border-border">
              <tr>
                {columns.map((col, i) => (
                  <th key={col.id || i} className="px-4 py-3 whitespace-nowrap">{col.label}</th>
                ))}
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className="bg-background border-b border-border">
                  {columns.map((col, colIndex) => {
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
                          <Select 
                            value={row[col.label] || ''} 
                            onChange={(e) => onGridCellChange(field.id, rowIndex, col.label, e.target.value)} 
                            className="bg-transparent border-0 border-b border-transparent rounded-none focus:ring-0 focus:border-primary px-2 py-1"
                          >
                            <option value="">Seleccionar...</option>
                            {options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                          </Select>
                        ) : col.type === 'file' ? (
                          <div className="flex items-center gap-2 min-w-[200px]">
                            {row[col.label] instanceof File ? (
                              <>
                                <div className="flex-1 flex items-center gap-2 overflow-hidden bg-surface bg-surface-dark px-2 py-1 rounded border border-border border-border-dark">
                                  <span className="material-symbols-outlined text-text-secondary text-lg">description</span>
                                  <span className="text-xs truncate max-w-[120px] text-text-primary " title={row[col.label].name}>{row[col.label].name}</span>
                                </div>
                                
                                <a 
                                  href={URL.createObjectURL(row[col.label])} 
                                  download={row[col.label].name}
                                  className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors flex items-center justify-center"
                                  title="Descargar archivo"
                                >
                                  <span className="material-symbols-outlined text-lg">download</span>
                                </a>

                                <button 
                                  onClick={() => onGridCellChange(field.id, rowIndex, col.label, null)}
                                  className="p-1.5 text-red-500 hover:bg-red-50 hover:bg-red-900/20 rounded transition-colors flex items-center justify-center"
                                  title="Eliminar archivo"
                                >
                                  <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                              </>
                            ) : (
                              <input 
                                type="file" 
                                className="block w-full text-xs text-text-secondary
                                  file:mr-2 file:py-1.5 file:px-3
                                  file:rounded-full file:border-0
                                  file:text-xs file:font-semibold
                                  file:bg-primary/10 file:text-primary
                                  hover:file:bg-primary/20
                                  cursor-pointer"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    onGridCellChange(field.id, rowIndex, col.label, e.target.files[0]);
                                  }
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <Input 
                            value={row[col.label] || ''} 
                            onChange={(e) => onGridCellChange(field.id, rowIndex, col.label, e.target.value)} 
                            className="bg-transparent border-0 border-b border-transparent rounded-none focus:ring-0 focus:border-primary px-2 py-1"
                          />
                        )}
                      </td>
                    );
                  })}
                  <td className="p-2 text-center">
                    <button type="button" onClick={() => onGridRemoveRow(field.id, rowIndex)} className="text-text-secondary hover:text-red-500">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-text-secondary italic">No hay datos.</td></tr>}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => onGridAddRow(field.id, columns)} className="text-sm font-medium text-primary hover:text-blue-400 flex items-center gap-1 mt-2">
          <span className="material-symbols-outlined text-lg">add_circle</span> Agregar Fila
        </button>
      </div>
    );
  }

  if (field.type === 'file' && field.fileStyle === 'button') {
    const files = formValues[field.id] || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const newFile = e.target.files[0];
        const newFileEntry = {
          name: newFile.name,
          description: '',
          file: newFile,
          url: URL.createObjectURL(newFile)
        };
        onChange(field.id, [...files, newFileEntry]);
      }
    };

    const handleDescriptionChange = (index: number, desc: string) => {
      const newFiles = [...files];
      newFiles[index].description = desc;
      onChange(field.id, newFiles);
    };

    const handleRemoveFile = (index: number) => {
      const newFiles = [...files];
      newFiles.splice(index, 1);
      onChange(field.id, newFiles);
    };

    return (
      <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-4 pt-2 animate-fadeIn`}>
        <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        {(field.description || field.downloadUrl) && (
          <div className="text-sm text-text-primary  leading-relaxed">
            {field.description && <div dangerouslySetInnerHTML={parseRichText(field.description)} />}
            {field.downloadUrl && (
              <div className="mt-2">
                <a href={field.downloadUrl} className="text-primary font-bold inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">description</span>
                  {field.downloadText || "Descargar"}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Files Table */}
        {files.length > 0 && (
          <div className="overflow-x-auto border border-border rounded-lg mb-4">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface text-text-primary uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Nombre del Archivo</th>
                  <th className="px-4 py-3">Descripción de documento</th>
                  <th className="px-4 py-3">Descargar</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {files.map((file: any, index: number) => (
                  <tr key={index} className="bg-background">
                    <td className="px-4 py-3 font-medium text-text-primary ">{file.name}</td>
                    <td className="px-4 py-3">
                      <Input 
                        value={file.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        className="bg-transparent border-0 border-b border-border rounded-none focus:ring-0 focus:border-primary py-1"
                        placeholder="Descripción..."
                      />
                    </td>
                    <td className="px-4 py-3">
                      <a href={file.url} download={file.name} className="text-primary hover:underline flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Descargar
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 hover:bg-red-900/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div>
          <input
            type="file"
            id={`file-upload-${field.id}`}
            className="hidden"
            onChange={handleFileChange}
          />
          <label 
            htmlFor={`file-upload-${field.id}`}
            className="bg-green-500  px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow cursor-pointer w-fit hover:bg-green-600 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Agregar archivo
          </label>
        </div>
      </div>
    );
  }

  // Generic Field Render
  return (
    <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-2 animate-fadeIn`}>
      <label className="block text-sm font-bold text-text-primary">
        {field.label} {field.required && <span className="text-red-500">*</span>}
      </label>
      
      {field.type === 'textarea' ? (
        <TextArea rows={3} onChange={(e) => onChange(field.id, e.target.value)} />
      ) : field.type === 'select' ? (
        <Select onChange={(e) => onChange(field.id, e.target.value)}>
          <option value="">Seleccionar...</option>
          {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
        </Select>
      ) : field.type === 'checkbox' ? (
        <div className="flex items-center gap-3">
          <input type="checkbox" className="w-5 h-5 rounded border-border text-primary" onChange={(e) => onChange(field.id, e.target.checked)} />
          <label className="text-sm text-text-primary ">{field.placeholder || 'Aceptar'}</label>
        </div>
      ) : field.type === 'radio' ? (
        <div className="space-y-2">
          {field.options?.map((opt, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="radio" name={field.id} className="w-4 h-4 border-border text-primary" onChange={(e) => onChange(field.id, e.target.value)} value={opt} />
              <span className="text-sm text-text-primary ">{opt}</span>
            </div>
          ))}
        </div>
      ) : field.type === 'file' ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-text-secondary bg-background">
          <span className="material-symbols-outlined text-3xl mb-2">cloud_upload</span>
          <span className="text-xs">Subir archivo</span>
        </div>
      ) : (
        <Input type={field.type} onChange={(e) => onChange(field.id, e.target.value)} />
      )}

      {field.description && <div className="text-xs text-text-secondary" dangerouslySetInnerHTML={parseRichText(field.description)} />}
    </div>
  );
};

export default PreviewField;

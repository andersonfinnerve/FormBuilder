import React from 'react';
import { FormField } from '@/types';
import { parseRichText } from '@/shared/utils';
import { Input } from '@/shared/components/ui';

interface FileButtonFieldProps {
  field: FormField;
  formValues: Record<string, any>;
  onChange: (id: string, value: any) => void;
}

export const FileButtonField: React.FC<FileButtonFieldProps> = ({
  field,
  formValues,
  onChange
}) => {
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
    <div className={`${field.Width === 'full' ? 'md:col-span-2' : 'md:col-span-1'} space-y-4 pt-2 animate-fadeIn`}>
      <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">
        {field.Label} {field.Required && <span className="text-red-500">*</span>}
      </label>
      {(field.Description || field.DownloadUrl) && (
        <div className="text-sm text-text-primary  leading-relaxed">
          {field.Description && <div dangerouslySetInnerHTML={parseRichText(field.Description)} />}
          {field.DownloadUrl && (
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
          id={`file-upload-${field.ComponentId}`}
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor={`file-upload-${field.ComponentId}`}
          className="bg-green-500  px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow cursor-pointer w-fit hover:bg-green-600 transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Agregar archivo
        </label>
      </div>
    </div>
  );
};

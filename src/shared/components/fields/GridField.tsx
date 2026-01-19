import React from 'react';
import { FormField, GridColumn, SharedFieldDefinition } from '@/types';
import GridCellInput from './GridCellInput';

interface GridFieldProps {
  field: FormField;
  formValues: Record<string, any>;
  sharedLibrary: SharedFieldDefinition[];
  onGridAddRow: (fieldId: string, columns: GridColumn[]) => void;
  onGridRemoveRow: (fieldId: string, rowIndex: number) => void;
  onGridCellChange: (fieldId: string, rowIndex: number, columnLabel: string, value: any) => void;
}

export const GridField: React.FC<GridFieldProps> = ({
  field,
  formValues,
  sharedLibrary,
  onGridAddRow,
  onGridRemoveRow,
  onGridCellChange
}) => {
  const rows = formValues[field.ComponentId] || [];
  const columns = field.Columns || [];

  return (
    <div className="md:col-span-2 space-y-2 animate-fadeIn">
      <label className="block text-sm font-bold text-text-primary">
        {field.Label} {field.Required && <span className="text-red-500">*</span>}
      </label>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-primary uppercase bg-surface border-b border-border">
            <tr>
              {columns.map((col, i) => (
                <th key={col.Id || i} className="px-4 py-3 whitespace-nowrap">{col.Label}</th>
              ))}
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex} className="bg-background border-b border-border">
                {columns.map((col, colIndex) => (
                  <td key={col.Id || colIndex} className="p-2">
                    <GridCellInput
                      column={col}
                      value={row[col.Label]}
                      sharedLibrary={sharedLibrary}
                      onChange={(value) => onGridCellChange(field.ComponentId, rowIndex, col.Label, value)}
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  <button type="button" onClick={() => onGridRemoveRow(field.ComponentId, rowIndex)} className="text-text-secondary hover:text-red-500">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-text-secondary italic">No hay datos.</td></tr>}
          </tbody>
        </table>
      </div>
      <button type="button" onClick={() => onGridAddRow(field.ComponentId, columns)} className="text-sm font-medium text-primary hover:text-blue-400 flex items-center gap-1 mt-2">
        <span className="material-symbols-outlined text-lg">add_circle</span> Agregar Fila
      </button>
    </div>
  );
};


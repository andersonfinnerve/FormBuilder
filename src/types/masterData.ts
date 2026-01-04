// Tipos de datos maestros del BackOffice
export type MasterDataType = 'text' | 'registry' | 'grid';

export interface MasterDataOption {
  id: string; // formDataOptionId
  value: string;
}

export interface MasterDataGridColumn {
  id: string; // formDataGridColumnId
  label: string;
  type: 'text' | 'select' | 'file';
  required: boolean;
  options?: MasterDataOption[]; // Para columnas tipo select
}

export interface MasterData {
  id: string; // formDataId o formDataGridId según el tipo
  name: string;
  type: MasterDataType;
  maxLength?: number; // Para tipo texto
  options?: string[] | MasterDataOption[]; // Para tipo registro (puede ser array simple o con IDs)
  columns?: MasterDataGridColumn[]; // Para tipo grid
  description?: string;
  lastModified?: string;
}

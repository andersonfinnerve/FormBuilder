// Tipos de datos maestros del BackOffice
export type MasterDataType = 'text' | 'registry';

export interface MasterData {
  id: string;
  name: string;
  type: MasterDataType;
  maxLength?: number; // Para tipo texto
  options?: string[]; // Para tipo registro
  description?: string;
  lastModified?: string;
}

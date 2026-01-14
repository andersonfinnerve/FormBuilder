// Tipos de campos disponibles
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'select' | 'date' | 'file' | 'checkbox' | 'radio' | 'spacer' | 'divider' | 'grid' | 'section';

// Opción de desplegable con ID del maestro
export interface  FormDataOption {
  // FormDataOptionId?: number | null; // null = opción nueva, number = opción del maestro
  DataOptionId?: number; // ID de la opción en el dato maestro (null para opciones nuevas)
  TextValue: string; // Texto visible de la opción
}

// Columna de grilla
export interface GridColumn {
  Id: string;
  Label: string;
  Type: 'text' | 'select' | 'file';
  Required: boolean;
  Options?: FormDataOption[]; // Solo si type es 'select' - usa objetos con DataOptionId y TextValue
  SharedSource?: string; // ID de la librería compartida (Centralizado)
  DataGridColumnId?: number | null; // ID local de la columna en la grilla
  FormDataGridColumnId?: number | null; // null = columna nueva, string = columna del maestro
  DataId?: number | null; // ID del dato maestro de la columna (null = columna nueva, string = columna existente en dbo.Data)
}

// Regla de lógica condicional
export interface LogicRule {
  TriggerId: string;    // ID local del campo que controla la visibilidad (para renderizado en web pública)
  TriggerFormDataId?: string | null; // ID del maestro del campo trigger (null=nuevo, string=existente, undefined=no aplica)
  Value: string;        // Valor que debe tener el trigger para mostrar este campo
  Enabled: boolean;     // Si la regla está activa
}

// Campo de formulario
export interface FormField {
  ComponentId: string;
  Type: FieldType;
  Label: string;
  Placeholder?: string;
  Description?: string;
  Required: boolean;
  ReadOnly: boolean;
  Order: number;
  Width: 'full' | 'half'; // Para redimensionar
  Options?: FormDataOption[]; // Para selects o radios - siempre usa objetos con DataOptionId y TextValue
  Columns?: GridColumn[]; // Para grillas (nivel columna)
  SharedSource?: string; // ID del recurso compartido si proviene de la biblioteca central
  Logic?: LogicRule; // Lógica condicional
  PhysicalColumn?: string; // Mapeo a columna física de la entidad (ej. Contact.FirstName)

  // IDs del Dato Maestro del BackOffice según tipo de elemento
  // null = campo nuevo sin crear en el maestro, string = campo del maestro
  DataId?: number | null; // ID para elementos normales (text, select, etc)
  DataGridId?: number | null; // ID para elementos tipo 'grid'
  FormDataId?: number | null; // ID para elementos normales (text, select, etc)
  FormDataGridId?: number | null; // ID para elementos tipo 'grid'

  // Propiedades recursivas para secciones
  Children?: FormField[];

  // Propiedades específicas para 'file'
  FileStyle?: 'dropzone' | 'button'; // Estilo visual de carga
  DownloadUrl?: string; // URL para descargar documento plantilla (ej. W-9)
  DownloadText?: string; // Texto del enlace de descarga
}

// Definición de campo compartido de la librería
export interface SharedFieldDefinition {
  Id: string;
  Label: string;
  Type: FieldType;
  Options?: FormDataOption[]; // Usa objetos con DataOptionId y TextValue
}

// Configuración general del formulario
export interface FormConfig {
  Title: string;
  Description?: string;
}

// Posición para drag & drop
export type DropPosition = 'before' | 'after' | 'inside';

// Posición visual de drag over
export type DragOverPosition = 'top' | 'bottom' | 'inside' | null;

export interface MasterData {
  FormDataId: number; // formDataId o formDataGridId según el tipo
  name: string;
  type: MasterDataType;
  maxLength?: number; // Para tipo texto
  options?: string[] | MasterDataOption[]; // Para tipo registro (puede ser array simple o con IDs)
  columns?: MasterDataGridColumn[]; // Para tipo grid
  description?: string;
  lastModified?: string;
}
// Tipos de datos maestros del BackOffice
export type MasterDataType = 'text' | 'registry' | 'grid';

export interface MasterDataOption {
  DataOptionId: number; // formDataOptionId
  value: string;
}

export interface MasterDataGridColumn {
  FormDataGridColumnId: number; // formDataGridColumnId
  label: string;
  type: 'text' | 'select' | 'file';
  required: boolean;
  options?: MasterDataOption[]; // Para columnas tipo select
}


export interface InitialFormStructure {
  FormId: number | null;
  Name: string;
  Description: string;
  StructureForm: FormField[];
}

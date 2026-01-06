// Tipos de campos disponibles
export type FieldType = 'text' | 'textarea' | 'number' | 'email' | 'select' | 'date' | 'file' | 'checkbox' | 'radio' | 'spacer' | 'divider' | 'grid' | 'section';

// Opción de desplegable con ID del maestro
export interface FormDataOption {
  DataOptionId?: string; // ID de la opción en el dato maestro (null para opciones nuevas)
  TextValue: string; // Texto visible de la opción
}

// Columna de grilla
export interface GridColumn {
  id: string;
  label: string;
  type: 'text' | 'select' | 'file';
  required: boolean;
  options?: FormDataOption[]; // Solo si type es 'select' - usa objetos con DataOptionId y TextValue
  sharedSource?: string; // ID de la librería compartida (Centralizado)
  formDataGridColumnId?: string | null; // null = columna nueva, string = columna del maestro
}

// Regla de lógica condicional
export interface LogicRule {
  triggerId: string;    // ID local del campo que controla la visibilidad (para renderizado en web pública)
  triggerFormDataId?: string | null; // ID del maestro del campo trigger (null=nuevo, string=existente, undefined=no aplica)
  value: string;        // Valor que debe tener el trigger para mostrar este campo
  enabled: boolean;     // Si la regla está activa
}

// Campo de formulario
export interface FormField {
  componentId: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  readOnly: boolean;
  order: number;
  width: 'full' | 'half'; // Para redimensionar
  options?: FormDataOption[]; // Para selects o radios - siempre usa objetos con DataOptionId y TextValue
  columns?: GridColumn[]; // Para grillas (nivel columna)
  sharedSource?: string; // ID del recurso compartido si proviene de la biblioteca central
  logic?: LogicRule; // Lógica condicional
  physicalColumn?: string; // Mapeo a columna física de la entidad (ej. Contact.FirstName)
  
  // IDs del Dato Maestro del BackOffice según tipo de elemento
  // null = campo nuevo sin crear en el maestro, string = campo del maestro
  formDataId?: string | null; // ID para elementos normales (text, select, etc)
  formDataGridId?: string | null; // ID para elementos tipo 'grid'
  
  // Propiedades recursivas para secciones
  children?: FormField[];
  
  // Propiedades específicas para 'file'
  fileStyle?: 'dropzone' | 'button'; // Estilo visual de carga
  downloadUrl?: string; // URL para descargar documento plantilla (ej. W-9)
  downloadText?: string; // Texto del enlace de descarga
}

// Definición de campo compartido de la librería
export interface SharedFieldDefinition {
  id: string;
  label: string;
  type: FieldType;
  options?: FormDataOption[]; // Usa objetos con DataOptionId y TextValue
}

// Configuración general del formulario
export interface FormConfig {
  title: string;
  description?: string;
}

// Posición para drag & drop
export type DropPosition = 'before' | 'after' | 'inside';

// Posición visual de drag over
export type DragOverPosition = 'top' | 'bottom' | 'inside' | null;

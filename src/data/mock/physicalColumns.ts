// Columnas físicas de la entidad Contacto
export interface PhysicalColumn {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'select';
  description?: string;
}

export const CONTACT_PHYSICAL_COLUMNS: PhysicalColumn[] = [
  { id: 'FirstName', label: 'Nombre', type: 'text', description: 'Nombre del contacto' },
  { id: 'LastName', label: 'Apellido', type: 'text', description: 'Apellido del contacto' },
  { id: 'Email', label: 'Email', type: 'email', description: 'Correo electrónico' },
  { id: 'Phone', label: 'Teléfono', type: 'text', description: 'Número de teléfono' },
  { id: 'IdentificationNumber', label: 'Número de Identificación', type: 'text', description: 'DNI/Cédula/Pasaporte' },
  { id: 'BirthDate', label: 'Fecha de Nacimiento', type: 'date', description: 'Fecha de nacimiento' },
  { id: 'Address', label: 'Dirección', type: 'text', description: 'Dirección física' },
  { id: 'City', label: 'Ciudad', type: 'text', description: 'Ciudad de residencia' },
  { id: 'State', label: 'Estado/Provincia', type: 'text', description: 'Estado o provincia' },
  { id: 'PostalCode', label: 'Código Postal', type: 'text', description: 'Código postal/ZIP' },
  { id: 'Country', label: 'País', type: 'select', description: 'País de residencia' },
  { id: 'Company', label: 'Empresa', type: 'text', description: 'Nombre de la empresa' },
  { id: 'JobTitle', label: 'Cargo', type: 'text', description: 'Título del puesto' },
  { id: 'Department', label: 'Departamento', type: 'text', description: 'Departamento' },
  { id: 'Website', label: 'Sitio Web', type: 'text', description: 'URL del sitio web' },
  { id: 'Notes', label: 'Notas', type: 'text', description: 'Notas adicionales' },
];

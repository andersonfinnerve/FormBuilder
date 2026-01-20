// import { InitialFormStructure } from '../../data/initialFields';
import { FormField, InitialFormStructure } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7225';

export interface FormApiResponse {
  FormId: number | null;
  Name: string;
  Description: string;
  StructureForm: any[];
}

export interface SaveFormResponse {
  success: boolean;
  formId: number;
}

export interface UpdateFormResponse {
  success: boolean;
  formId?: number;
}

/**
 * Obtiene la estructura del formulario desde el servicio
 * @param formId - ID del formulario a cargar
 * @returns Estructura del formulario
 */
export const getFormStructure = async (formId?: string): Promise<InitialFormStructure> => {
  try {
    const endpoint = `${API_BASE_URL}/api/Enrollment/RegistrationForm/${formId || '1'}`;

    console.log('Cargando formulario desde:', endpoint, API_BASE_URL);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Agregar headers de autenticación si es necesario
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error al cargar el formulario: ${response.status} ${response.statusText}`);
    }

    const data: FormApiResponse = await response.json();
    
    return {
      FormId: data.FormId,
      Name: data.Name,
      Description: data.Description,
      StructureForm: data.StructureForm
    };
  } catch (error) {
    console.error('Error al obtener la estructura del formulario:', error);
    throw error;
  }
};

/**
 * Guarda la estructura del formulario en el servicio
 * @param formData - Datos del formulario a guardar
 * @returns Respuesta del servidor con success y formId
 */
export const saveFormStructure = async (formData: InitialFormStructure): Promise<SaveFormResponse> => {
  try {
    const endpoint = `${API_BASE_URL}/api/Enrollment/RegistrationForm`;
    
    console.log('Guardando formulario en:', endpoint);
    console.log('Datos a enviar:', formData);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Agregar headers de autenticación si es necesario
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al guardar el formulario: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Respuesta del servidor:', result);
    
    return result;
  } catch (error) {
    console.error('Error al guardar la estructura del formulario:', error);
    throw error;
  }
};

/**
 * Actualiza la estructura del formulario existente
 * @param formId - ID del formulario a actualizar
 * @param formData - Datos del formulario
 * @returns Respuesta del servidor con success
 */
export const updateFormStructure = async (formId: number, formData: InitialFormStructure): Promise<UpdateFormResponse> => {
  try {
    const endpoint = `${API_BASE_URL}/api/Enrollment/RegistrationForm/${formId}`;
    
    console.log('Actualizando formulario en:', endpoint);
    console.log('Datos a enviar:', formData);
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Agregar headers de autenticación si es necesario
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar el formulario: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Respuesta del servidor:', result);
    
    return result;
  } catch (error) {
    console.error('Error al actualizar la estructura del formulario:', error);
    throw error;
  }
};

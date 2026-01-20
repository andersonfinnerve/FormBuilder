// Types for form submission data (user-filled data, not form structure)
import { FormField, FormConfig } from './index';

export interface FormSubmissionMetadata {
  id: string;
  formId: string;
  formName: string;
  submittedAt: string;
  submittedBy?: string;
  status: 'draft' | 'submitted' | 'reviewed';
}

/**
 * Form submission following the same structure as InitialFormStructure
 * Preserves the complete form structure with filled values
 */
export interface FormSubmission extends FormSubmissionMetadata {
  FormId: number | string | null;
  Name: string;
  Description: string;
  StructureForm: FormField[]; // Complete structure with filled values
  Config?: FormConfig;
  rawData?: Record<string, any>; // Optional: flat key-value pairs for quick access
  version?: number;
}

export interface FormDataFilter {
  formId?: string;
  status?: 'draft' | 'submitted' | 'reviewed';
  dateFrom?: string;
  dateTo?: string;
}

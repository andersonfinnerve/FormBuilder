import { FormField, FormConfig } from './index';

export interface FormMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface SavedForm extends FormMetadata {
  fields: FormField[];
  config?: FormConfig;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  fields: FormField[];
  description: string;
}

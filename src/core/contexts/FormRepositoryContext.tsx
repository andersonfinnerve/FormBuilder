import React, { createContext, useContext, useState, useEffect } from 'react';
import { SavedForm, FormMetadata } from '../../types/repository';
import { FormField } from '../../types';

interface FormRepositoryContextType {
  savedForms: SavedForm[];
  saveForm: (form: SavedForm) => void;
  loadForm: (id: string) => SavedForm | undefined;
  deleteForm: (id: string) => void;
  getAllFormsMetadata: () => FormMetadata[];
}

const FormRepositoryContext = createContext<FormRepositoryContextType | undefined>(undefined);

const STORAGE_KEY = 'finnerve_form_repository';

export const FormRepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedForms(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored forms', e);
      }
    }
  }, []);

  // Save to LocalStorage whenever savedForms changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedForms));
  }, [savedForms]);

  const saveForm = (form: SavedForm) => {
    setSavedForms(prev => {
      const existingIndex = prev.findIndex(f => f.id === form.id);
      if (existingIndex >= 0) {
        const newForms = [...prev];
        newForms[existingIndex] = { ...form, updatedAt: new Date().toISOString() };
        return newForms;
      }
      return [...prev, { ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    });
  };

  const loadForm = (id: string) => {
    return savedForms.find(f => f.id === id);
  };

  const deleteForm = (id: string) => {
    setSavedForms(prev => prev.filter(f => f.id !== id));
  };

  const getAllFormsMetadata = () => {
    return savedForms.map(({ fields, ...metadata }) => metadata);
  };

  return (
    <FormRepositoryContext.Provider value={{ savedForms, saveForm, loadForm, deleteForm, getAllFormsMetadata }}>
      {children}
    </FormRepositoryContext.Provider>
  );
};

export const useFormRepository = () => {
  const context = useContext(FormRepositoryContext);
  if (!context) {
    throw new Error('useFormRepository must be used within a FormRepositoryProvider');
  }
  return context;
};

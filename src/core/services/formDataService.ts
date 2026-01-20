/**
 * Form Data Service
 * Handles CRUD operations for form submission data (user-filled data)
 * Separate from form structure management
 */

import { FormSubmission, FormDataFilter } from '@/types/formData';

const STORAGE_KEY = 'finnerve_form_submissions';

/**
 * Save a form submission to local storage
 */
export const saveFormSubmission = (submission: FormSubmission): void => {
  const submissions = getAllSubmissions();
  const existingIndex = submissions.findIndex(s => s.id === submission.id);
  
  if (existingIndex >= 0) {
    submissions[existingIndex] = {
      ...submission,
      submittedAt: new Date().toISOString()
    };
  } else {
    submissions.push({
      ...submission,
      submittedAt: new Date().toISOString(),
      status: submission.status || 'submitted'
    });
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
};

/**
 * Get all form submissions
 */
export const getAllSubmissions = (): FormSubmission[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse submissions', error);
    return [];
  }
};

/**
 * Get submissions filtered by criteria
 */
export const getFilteredSubmissions = (filter: FormDataFilter): FormSubmission[] => {
  const submissions = getAllSubmissions();
  
  return submissions.filter(submission => {
    if (filter.formId && submission.formId !== filter.formId) return false;
    if (filter.status && submission.status !== filter.status) return false;
    if (filter.dateFrom && submission.submittedAt < filter.dateFrom) return false;
    if (filter.dateTo && submission.submittedAt > filter.dateTo) return false;
    return true;
  });
};

/**
 * Get a single submission by ID
 */
export const getSubmissionById = (id: string): FormSubmission | undefined => {
  const submissions = getAllSubmissions();
  return submissions.find(s => s.id === id);
};

/**
 * Delete a submission
 */
export const deleteSubmission = (id: string): void => {
  const submissions = getAllSubmissions();
  const filtered = submissions.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

/**
 * Update submission status
 */
export const updateSubmissionStatus = (
  id: string, 
  status: 'draft' | 'submitted' | 'reviewed'
): void => {
  const submissions = getAllSubmissions();
  const index = submissions.findIndex(s => s.id === id);
  
  if (index >= 0) {
    submissions[index].status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
  }
};

/**
 * Get submissions count by form ID
 */
export const getSubmissionsCountByFormId = (formId: string): number => {
  return getFilteredSubmissions({ formId }).length;
};

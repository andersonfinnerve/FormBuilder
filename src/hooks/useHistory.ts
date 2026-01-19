import { useState, useCallback } from 'react';
import { FormField } from '@/types';
import { HistoryEntry } from '@/types/repository';

export const useHistory = (initialFields: FormField[]) => {
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      id: 'init',
      timestamp: Date.now(),
      fields: initialFields,
      description: 'Estado inicial'
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pushSnapshot = useCallback((fields: FormField[], description: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      fields: JSON.parse(JSON.stringify(fields)), // Deep copy
      description
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      return [...newHistory, newEntry];
    });
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1].fields;
    }
    return null;
  }, [history, currentIndex]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1].fields;
    }
    return null;
  }, [history, currentIndex]);

  const jumpToVersion = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      setCurrentIndex(index);
      return history[index].fields;
    }
    return null;
  }, [history]);

  return {
    history,
    currentIndex,
    pushSnapshot,
    undo,
    redo,
    jumpToVersion,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1
  };
};

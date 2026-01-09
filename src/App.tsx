import React, { useState } from 'react';
import Header from './components/Header';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import { ThemeConfigModal } from './components/ThemeConfig';
import { useFormBuilder } from './hooks/useFormBuilder';
import { useTheme } from './contexts/ThemeContext';
import { FormRepositoryProvider, useFormRepository } from './contexts/FormRepositoryContext';
import { sharedFieldsLibrary } from './data/sharedLibrary';
import { initialFields } from './data/initialFields';
import { flattenFields } from './utils/fieldHelpers';
import QuestionnaireBuilder from './components/QuestionnaireBuilder';
import OnboardingBuilder from './components/OnboardingBuilder';
import FormExplorer from './components/FormExplorer';

const AppContent: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeConfigOpen, setIsThemeConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'questionnaire' | 'onboarding'>('form');
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const { theme, mode } = useTheme();
  const { saveForm, loadForm } = useFormRepository();
  
  const {
    fields,
    selectedField,
    selectedId,
    setSelectedId,
    formConfig,
    handleUpdateFormConfig,
    handleAddField,
    handleAddSharedField,
    handleAddMasterData,
    handleUpdateField,
    handleCommitUpdate,
    handleDeleteField,
    handleDuplicateField,
    handleMoveField,
    handleDropNewField,
    history,
    currentIndex,
    handleUndo,
    handleRedo,
    handleJumpToVersion,
    canUndo,
    canRedo,
    handleLoadForm
  } = useFormBuilder(
    initialFields.StructureForm, 
    sharedFieldsLibrary,
    { Title: initialFields.Name, Description: initialFields.Description }
  );

  const handleSave = () => {
    let id = currentFormId;
    let name = "Formulario Sin Título";
    let createdAt = new Date().toISOString();
    let version = 1;

    if (id) {
      const existing = loadForm(id);
      if (existing) {
        name = existing.name;
        createdAt = existing.createdAt;
        version = existing.version + 1;
      }
    } else {
      id = Date.now().toString();
      const inputName = prompt("Nombre del formulario:", `Formulario ${new Date().toLocaleString()}`);
      if (!inputName) return; // Cancelar si no hay nombre
      name = inputName;
      setCurrentFormId(id);
    }

    saveForm({
      id: id!,
      name: name,
      description: "Formulario guardado",
      fields: fields,
      config: formConfig,
      createdAt: createdAt,
      updatedAt: new Date().toISOString(),
      version: version
    });
    alert("Formulario guardado exitosamente.");
  };

  const handleLoadFromExplorer = (id: string) => {
    const form = loadForm(id);
    if (form) {
      handleLoadForm(form.fields, form.config);
      setCurrentFormId(id);
      setIsExplorerOpen(false);
    }
  };

  const handleNewForm = () => {
    if (window.confirm('¿Estás seguro de crear un nuevo formulario? Se perderán los cambios no guardados en el canvas actual.')) {
      handleLoadForm(
        initialFields.StructureForm,
        { Title: initialFields.Name, Description: initialFields.Description }
      );
      setCurrentFormId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-display">
      <Header 
        onPreview={() => setIsPreviewOpen(true)} 
        onThemeConfig={() => setIsThemeConfigOpen(true)}
        onSave={handleSave}
        onHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onNewForm={handleNewForm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      
      <main className="flex flex-1 overflow-hidden relative">
        {viewMode === 'form' ? (
          <>
            <Toolbox 
              onAddField={handleAddField} 
              sharedLibrary={sharedFieldsLibrary}
              onAddSharedField={handleAddSharedField}
              onAddMasterData={handleAddMasterData}
            />
            
            <Canvas 
              fields={fields} 
              selectedId={selectedId} 
              formConfig={formConfig}
              onSelectField={setSelectedId}
              onDeleteField={handleDeleteField}
              onDuplicateField={handleDuplicateField}
              onUpdateField={handleUpdateField}
              onMoveField={handleMoveField} 
              onDropNewField={handleDropNewField}
            />
            
            <PropertiesPanel 
              selectedField={selectedField} 
              allFields={flattenFields(fields)}
              formConfig={formConfig}
              onUpdateField={handleCommitUpdate} // Use commit update for properties to trigger history
              onUpdateFormConfig={handleUpdateFormConfig}
              sharedLibrary={sharedFieldsLibrary}
            />
          </>
        ) : viewMode === 'questionnaire' ? (
          <QuestionnaireBuilder />
        ) : (
          <div className="w-full h-full overflow-auto bg-background">
            <OnboardingBuilder />
          </div>
        )}
      </main>

      {isPreviewOpen && (
        <PreviewModal 
          onClose={() => setIsPreviewOpen(false)} 
          fields={fields}
          formConfig={formConfig}
          sharedLibrary={sharedFieldsLibrary}
        />
      )}

      {isThemeConfigOpen && (
        <ThemeConfigModal 
          isOpen={isThemeConfigOpen} 
          onClose={() => setIsThemeConfigOpen(false)} 
        />
      )}

      {isExplorerOpen && (
        <FormExplorer 
          onLoad={handleLoadFromExplorer}
          onClose={() => setIsExplorerOpen(false)}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <FormRepositoryProvider>
      <AppContent />
    </FormRepositoryProvider>
  );
};

export default App;

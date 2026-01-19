import React, { useState, useEffect } from 'react';

// Shared Components
import { Header } from '@/shared/components/layouts';
import { ThemeConfigModal } from '@/shared/components/modals';

// Form Builder Feature
import { Canvas, PropertiesPanel, Toolbox, useFormBuilder } from '@/features/form-builder';

// Other Features
import { PreviewModal } from '@/features/preview';
import { QuestionnaireBuilder } from '@/features/questionnaire-builder';
import { OnboardingBuilder } from '@/features/onboarding-builder';
import { FormExplorer } from '@/features/form-explorer';

// Core (Contexts & Services)
import { useTheme, FormRepositoryProvider, useFormRepository } from '@/core/contexts';
import { getFormStructure, updateFormStructure, saveFormStructure } from '@/core/services';

// Data
import { sharedFieldsLibrary, initialFields } from '@/data/seeds';

// Utils
import { flattenFields } from '@/shared/utils';


const AppContent: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeConfigOpen, setIsThemeConfigOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'questionnaire' | 'onboarding'>('form');
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { theme, mode } = useTheme();
  const { saveForm, loadForm } = useFormRepository();

  // Determinar si se debe empezar con un formulario vacío o con datos iniciales
  const urlParams = new URLSearchParams(window.location.search);
  const formIdFromUrl = urlParams.get('formId');
  const shouldStartEmpty = !formIdFromUrl; // Si no hay formId, empezar vacío

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
    shouldStartEmpty ? [] : initialFields.StructureForm,
    sharedFieldsLibrary,
    shouldStartEmpty ? { Title: '', Description: '' } : { Title: initialFields.Name, Description: initialFields.Description }
    );

  console.warn('pep', { fields, formConfig })

  // Cargar formulario desde el servicio al montar el componente
  useEffect(() => {
    const loadFormFromService = async () => {
      // Obtener el formId de la URL
      const urlParams = new URLSearchParams(window.location.search);
      const formIdFromUrl = urlParams.get('formId');

      // Si no hay formId en URL, empezar desde cero con initialFields
      if (!formIdFromUrl) {
        console.log('No hay formId en URL. Empezando formulario nuevo desde cero.');
        setCurrentFormId(null);
        return;
      }

      // Si hay formId, cargar desde el servicio
      setIsLoadingForm(true);
      setLoadError(null);

      try {
        console.log('Cargando formulario con ID:', formIdFromUrl);
        const formStructure = await getFormStructure(formIdFromUrl);

        // Cargar el formulario obtenido
        handleLoadForm(formStructure.StructureForm, {
          Title: formStructure.Name,
          Description: formStructure.Description
        });

        if (formStructure.FormId) {
          setCurrentFormId(formStructure.FormId.toString());
        }

        console.log('Formulario cargado desde el servicio:', formStructure);
      } catch (error) {
        console.error('Error al cargar formulario desde el servicio:', error);
        setLoadError(error instanceof Error ? error.message : 'Error desconocido');
        // En caso de error, continuar con initialFields
      } finally {
        setIsLoadingForm(false);
      }
    };

    loadFormFromService();
  }, []); // Solo ejecutar al montar

  const handleSave = async () => {
    const USE_API = true; // Cambiar a false para solo guardar localmente

    try {
      setIsLoadingForm(true);
      setLoadError(null);

      // Preparar datos para enviar al servicio
      const formDataToSave: any = {
        Name: formConfig.Title,
        Description: formConfig.Description || '',
        StructureForm: fields
      };

      // Solo incluir FormId si existe (para actualización)
      if (currentFormId) {
        formDataToSave.FormId = parseInt(currentFormId);
      }

      let savedFormId = currentFormId;

      if (USE_API) {

        if (formDataToSave.FormId) {
          // Actualizar formulario existente
          console.log('Actualizando formulario con ID:', formDataToSave.FormId);
          const response = await updateFormStructure(formDataToSave.FormId, formDataToSave);

          if (response.success) {
            console.log('Formulario actualizado exitosamente');
            savedFormId = formDataToSave.FormId.toString();
          }
        } else {
          // Crear nuevo formulario
          console.log('Creando nuevo formulario');
          const response = await saveFormStructure(formDataToSave);

          if (response.success && response.formId) {
            console.log('Formulario creado con ID:', response.formId);
            savedFormId = response.formId.toString();
            setCurrentFormId(savedFormId);
          }
        }

        // Recargar el formulario desde el servicio para confirmar
        if (savedFormId) {
          const reloadedForm = await getFormStructure(savedFormId);

          handleLoadForm(reloadedForm.StructureForm, {
            Title: reloadedForm.Name,
            Description: reloadedForm.Description
          });

          console.log('Formulario recargado desde el servicio:', reloadedForm);
        }

        alert(`Formulario ${formDataToSave.FormId ? 'actualizado' : 'guardado'} exitosamente.`);
      }

      // Guardar también localmente en localStorage
      let localId = savedFormId || Date.now().toString();
      let name = formConfig.Title || "Formulario Sin Título";
      let createdAt = new Date().toISOString();
      let version = 1;

      const existing = loadForm(localId);
      if (existing) {
        createdAt = existing.createdAt;
        version = existing.version + 1;
      }

      saveForm({
        id: localId,
        name: name,
        description: formConfig.Description || "Formulario guardado",
        fields: fields,
        config: formConfig,
        createdAt: createdAt,
        updatedAt: new Date().toISOString(),
        version: version
      });

      if (!USE_API) {
        alert("Formulario guardado localmente.");
      }

    } catch (error) {
      console.error('Error al guardar formulario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setLoadError(errorMessage);
      alert(`Error al guardar formulario: ${errorMessage}`);
    } finally {
      setIsLoadingForm(false);
    }
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
      {/* Indicador de carga */}
      {isLoadingForm && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface-dark border border-border-dark rounded-lg p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-text-primary font-medium">Cargando formulario...</span>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de error */}
      {loadError && (
        <div className="absolute top-4 right-4 bg-red-500/10 border border-red-500/30 rounded-lg p-4 shadow-xl z-50 max-w-md">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-red-400">error</span>
            <div>
              <h4 className="text-sm font-bold text-red-400 mb-1">Error al cargar formulario</h4>
              <p className="text-xs text-text-secondary">{loadError}</p>
              <p className="text-xs text-text-secondary mt-1">Usando datos estáticos por defecto.</p>
            </div>
            <button onClick={() => setLoadError(null)} className="text-text-secondary hover:text-text-primary">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

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
          fields={fields || []}
          formConfig={formConfig || { Title: '', Description: '' }}
          onClose={() => setIsPreviewOpen(false)}
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

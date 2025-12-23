import React, { useState } from 'react';
import Header from './components/Header';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import { ThemeConfigModal } from './components/ThemeConfig';
import { useFormBuilder } from './hooks/useFormBuilder';
import { useTheme } from './contexts/ThemeContext';
import { sharedFieldsLibrary } from './data/sharedLibrary';
import { initialFields } from './data/initialFields';
import { flattenFields } from './utils/fieldHelpers';
import QuestionnaireBuilder from './components/QuestionnaireBuilder';

const App: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeConfigOpen, setIsThemeConfigOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'questionnaire'>('form');
  const { theme, mode } = useTheme();
  
  const {
    fields,
    selectedField,
    selectedId,
    setSelectedId,
    handleAddField,
    handleAddSharedField,
    handleUpdateField,
    handleDeleteField,
    handleDuplicateField,
    handleMoveField,
    handleDropNewField
  } = useFormBuilder(initialFields, sharedFieldsLibrary);

  const handleSave = () => {
    const payload = {
      formConfig: fields,
      themeConfig: {
        theme,
        mode
      },
      metadata: {
        version: "2.4.0",
        lastModified: new Date().toISOString(),
        name: "Onboarding Clientes 2024" // Esto podría venir de un estado también
      }
    };

    console.log("=== PAYLOAD PARA GUARDAR EN BD ===");
    console.log(JSON.stringify(payload, null, 2));
    alert("Configuración guardada en consola (Simulación de API)");
    
    // Aquí harías la llamada a tu API:
    // await fetch('/api/forms/save', { 
    //   method: 'POST', 
    //   body: JSON.stringify(payload),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-display">
      <Header 
        onPreview={() => setIsPreviewOpen(true)} 
        onThemeConfig={() => setIsThemeConfigOpen(true)}
        onSave={handleSave}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <main className="flex flex-1 overflow-hidden relative">
        {viewMode === 'form' ? (
          <>
            <Toolbox 
              onAddField={handleAddField} 
              sharedLibrary={sharedFieldsLibrary}
              onAddSharedField={handleAddSharedField}
            />
            
            <Canvas 
              fields={fields} 
              selectedId={selectedId} 
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
              onUpdateField={handleUpdateField}
              sharedLibrary={sharedFieldsLibrary}
            />
          </>
        ) : (
          <QuestionnaireBuilder />
        )}
      </main>

      {isPreviewOpen && (
        <PreviewModal 
          fields={fields} 
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
    </div>
  );
};

export default App;

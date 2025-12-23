import React, { useState } from 'react';
import Header from './components/Header';
import Toolbox from './components/Toolbox';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import PreviewModal from './components/PreviewModal';
import { ThemeConfigModal } from './components/ThemeConfig';
import { useFormBuilder } from './hooks/useFormBuilder';
import { sharedFieldsLibrary } from './data/sharedLibrary';
import { initialFields } from './data/initialFields';
import { flattenFields } from './utils/fieldHelpers';

const App: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isThemeConfigOpen, setIsThemeConfigOpen] = useState(false);
  
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

  return (
    <div className="flex flex-col h-screen overflow-hidden font-display">
      <Header 
        onPreview={() => setIsPreviewOpen(true)} 
        onThemeConfig={() => setIsThemeConfigOpen(true)}
      />
      
      <main className="flex flex-1 overflow-hidden relative">
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

import React from 'react';
import { FormField } from '../../types';

interface ContextualHelpProps {
  field: FormField;
  isShared: boolean;
}

const ContextualHelp: React.FC<ContextualHelpProps> = ({ field, isShared }) => {
  const getTipMessage = () => {
    if (field.type === 'spacer') {
      return 'Usa el espaciador para crear huecos vacíos en filas de múltiples columnas.';
    } else if (field.type === 'file') {
      return 'Usa el estilo "Botón de Acción" para secciones de documentación donde necesites proveer instrucciones largas o archivos descargables.';
    } else if (field.logic?.enabled) {
      return 'Los campos con lógica condicional solo aparecerán cuando el usuario seleccione la opción correcta en el campo disparador.';
    } else if (isShared) {
      return 'Los campos compartidos aseguran que datos críticos como la Nacionalidad se escriban igual en todos los formularios.';
    } else {
      return 'Usa el ancho completo para preguntas importantes o campos que requieren mucha lectura.';
    }
  };

  return (
    <div className="p-4 bg-background-dark border-t border-border-dark m-4 rounded-xl">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
        <div className="text-xs text-text-secondary leading-relaxed">
          <span className="text-white font-bold block mb-1">Tip de Diseño</span>
          {getTipMessage()}
        </div>
      </div>
    </div>
  );
};

export default ContextualHelp;

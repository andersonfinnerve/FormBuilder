import React from 'react';
import { OnboardingFlow } from '../../types/onboarding';

interface OnboardingListProps {
  flows: OnboardingFlow[];
  onEdit: (flow: OnboardingFlow) => void;
  onCreate: () => void;
}

const OnboardingList: React.FC<OnboardingListProps> = ({ flows, onEdit, onCreate }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Flujos de Onboarding</h1>
          <p className="text-text-secondary text-sm mt-1">Gestiona los procesos de alta de clientes</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuevo Flujo
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-secondary border-b border-border">
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nombre del Flujo</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Tipo de Persona</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Pasos</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Última Modificación</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {flows.map((flow) => (
              <tr key={flow.id} className="hover:bg-background-secondary/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-text-primary">{flow.name}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    flow.personType === 'natural' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  }`}>
                    {flow.personType === 'natural' ? 'Persona Natural' : 'Persona Jurídica'}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">
                  {flow.steps.length} pasos
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">
                  {new Date(flow.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEdit(flow)}
                    className="text-text-secondary hover:text-primary transition-colors p-1 rounded-md hover:bg-background"
                    title="Editar configuración"
                  >
                    <span className="material-symbols-outlined text-xl">settings</span>
                  </button>
                </td>
              </tr>
            ))}
            {flows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-secondary">
                  No hay flujos configurados. Crea uno nuevo para comenzar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnboardingList;

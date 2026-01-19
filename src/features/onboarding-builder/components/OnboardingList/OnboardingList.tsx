import React from 'react';
import { OnboardingFlow } from '@/types/onboarding';

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
          <h1 className="text-2xl font-bold text-text-primary">Config Stepper Client</h1>
          <p className="text-text-secondary text-sm mt-1">Gestiona las configuraciones de enrolamiento de clientes</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nueva Configuración
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Nombre</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Genera PDF</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Pasos</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Última Modificación</th>
              <th className="py-3 px-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {flows.map((flow) => (
              <tr key={flow.id} className="hover:bg-background/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-medium text-text-primary">{flow.name}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {flow.generatePDF ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                        Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300">
                        <span className="material-symbols-outlined text-sm mr-1">cancel</span>
                        No
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">
                  {flow.steps.length} {flow.steps.length === 1 ? 'paso' : 'pasos'}
                </td>
                <td className="py-3 px-4 text-sm text-text-secondary">
                  {new Date(flow.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEdit(flow)}
                    className="inline-flex items-center gap-1 text-text-secondary hover:text-primary transition-colors p-1.5 rounded-md hover:bg-background"
                    title="Editar configuración"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </td>
              </tr>
            ))}
            {flows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-text-secondary">
                  <span className="material-symbols-outlined text-4xl mb-2 block opacity-50">settings</span>
                  <p className="font-medium">No hay configuraciones creadas</p>
                  <p className="text-sm mt-1">Crea una nueva para comenzar</p>
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

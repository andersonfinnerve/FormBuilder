import React, { useState } from 'react';
import OnboardingList from '../OnboardingList/OnboardingList';
import OnboardingConfig from '../OnboardingConfig/OnboardingConfig';
import { OnboardingFlow } from '../../../../types/onboarding';
import { initialOnboardingFlows } from '../../../../data/mock/mockOnboardingData';

const OnboardingBuilder: React.FC = () => {
  const [view, setView] = useState<'list' | 'config'>('list');
  const [flows, setFlows] = useState<OnboardingFlow[]>(initialOnboardingFlows);
  const [selectedFlow, setSelectedFlow] = useState<OnboardingFlow | null>(null);

  const handleCreate = () => {
    setSelectedFlow(null);
    setView('config');
  };

  const handleEdit = (flow: OnboardingFlow) => {
    setSelectedFlow(flow);
    setView('config');
  };

  const handleSave = (flow: OnboardingFlow) => {
    if (selectedFlow) {
      // Update existing
      setFlows(flows.map(f => f.id === flow.id ? flow : f));
    } else {
      // Create new
      setFlows([...flows, flow]);
    }
    setView('list');
    setSelectedFlow(null);
  };

  const handleCancel = () => {
    setView('list');
    setSelectedFlow(null);
  };

  if (view === 'config') {
    return (
      <OnboardingConfig
        initialFlow={selectedFlow}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <OnboardingList
      flows={flows}
      onCreate={handleCreate}
      onEdit={handleEdit}
    />
  );
};

export default OnboardingBuilder;

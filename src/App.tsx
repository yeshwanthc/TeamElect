import React from 'react';
import { VotingProvider } from './context/VotingContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <VotingProvider>
      <Dashboard />
    </VotingProvider>
  );
}

export default App;
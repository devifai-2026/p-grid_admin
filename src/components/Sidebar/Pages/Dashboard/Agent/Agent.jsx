import React from 'react';
import AgentCard from './AgentCard';
import SalesDetail from './SalesDetail';

const Agent = () => {


  return (
    <div className="flex flex-col gap-6">
      <AgentCard />
      <SalesDetail />
    </div>
  );
};

export default Agent;
import React from 'react';
import AnalyticsCards from '../../../components/AnalyticsCards';
import SalesAnalytic from '../../../components/SalesAnalytic';
import BalanceCard from '../../../components/BalanceCard';
import GraphSection from '../../../components/GraphSection';
import RecentActivity from '../../../components/RecentActivity';

const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <AnalyticsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-6">
          <SalesAnalytic />
          <GraphSection />
        </div>
        
        <div className="space-y-6">
          <BalanceCard />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
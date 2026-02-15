import React from "react";
import AnalyticsCards from "./AnalyticsCard";
import SalesAnalytic from "./SalesAnalytics";
import SocialSource from "./SocialSource";
import LastTransaction from "./LastTransaction";

const AnalyticsPage = () => {
  return (
    <>
      <AnalyticsCards />
      <div className="space-y-6 mt-6">
        <SalesAnalytic />
        <SocialSource />
        <LastTransaction />
      </div>
    </>
  );
};

export default AnalyticsPage;

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalDetails from './components/PersonalDetails';
import BasicDetails from './components/BasicDetails';
import LocationDetails from './components/LocationDetails';
import LegalDetails from './components/LegalDetails';
import LeaseDetails from './components/LeaseDetails';
import FinancialDetails from './components/FinancialDetails';
import { usePropertyAPIs } from '../../../../../helpers/hooks/usePropertyAPIs';
import { showSuccess, showError } from '../../../../../helpers/swalHelper';


const STEPS = [
  { id: 1, title: 'Personal Details', component: PersonalDetails },
  { id: 2, title: 'Property Overview', component: BasicDetails },
  { id: 3, title: 'Legal & Title', component: LegalDetails },
  { id: 4, title: 'Lease & Tenant', component: LeaseDetails },
  { id: 5, title: 'Financials', component: FinancialDetails },
  { id: 6, title: 'Location Details', component: LocationDetails },
];

const AddProperty = () => {
  const navigate = useNavigate();
  const { createProperty } = usePropertyAPIs();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isStepValid, setIsStepValid] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const currentStepRef = useRef(null);

  const handleNext = (stepData) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);
    
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    } else {
      submitProperty(updatedData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const submitProperty = async (finalData) => {
    setLoading(true);
    try {
      console.log('Submitting Property Data:', finalData);

      const apiFormData = new FormData();

      // --- Personal Details ---
      apiFormData.append('firstName', finalData.firstName || '');
      apiFormData.append('lastName', finalData.lastName || '');
      apiFormData.append('email', finalData.email || '');
      apiFormData.append('mobile', finalData.mobile || '');
      // Capitalize userType: 'broker' -> 'Broker', 'owner' -> 'Owner'
      const userType = finalData.listUnder 
        ? finalData.listUnder.charAt(0).toUpperCase() + finalData.listUnder.slice(1)
        : '';
      apiFormData.append('userType', userType);

      // --- Basic Details ---
      apiFormData.append('propertyType', finalData.propertyType || '');
      apiFormData.append('carpetAreaSqft', finalData.carpetArea || '');
      apiFormData.append('carpetAreaUnit', finalData.carpetAreaUnit || 'Sq. Feet');
      apiFormData.append('completionYear', finalData.builtYear || '');
      apiFormData.append('lastRefurbished', finalData.lastRefurbished || '');
      apiFormData.append('ownershipType', finalData.ownership || '');
      apiFormData.append('buildingGrade', finalData.buildingGrade || '');

      // Parking
      apiFormData.append('parkingSlots', finalData.fourWheelerParkings || '0');
      apiFormData.append('parkingRatio', finalData.twoWheelerParkings || '0');

      // Infrastructure
      apiFormData.append('powerBackupKva', finalData.powerBackup || '');
      apiFormData.append('numberOfLifts', finalData.numLifts || '0');
      apiFormData.append('hvacType', finalData.hvacType || null);
      apiFormData.append('furnishingStatus', finalData.furnishingStatus || null);
      apiFormData.append('caretakerId', finalData.buildingMaintained || '');

      // Amenities (JSON stringified array of IDs)
      apiFormData.append(
        'amenityIds',
        JSON.stringify(finalData.amenityIds || []),
      );

      // Description
      apiFormData.append('description', finalData.propertyDescription || '');

      // --- Legal Details ---
      apiFormData.append('titleStatus', finalData.titleStatus || '');
      apiFormData.append('occupancyCertificate', finalData.occupancyCertificate || '');
      apiFormData.append('leaseRegistration', finalData.leaseRegistration || '');
      apiFormData.append(
        'hasPendingLitigation',
        finalData.pendingLitigations === 'yes' ? 'true' : 'false',
      );
      apiFormData.append('litigationDetails', finalData.litigationNote || '');
      apiFormData.append('reraNumber', finalData.reraNumber || '');

      // Certifications
      const certs = {
        ...(finalData.certifications || {}),
        others: finalData.otherCertifications || [],
      };
      apiFormData.append('certifications', JSON.stringify(certs));

      // --- Lease Details ---
      apiFormData.append('tenantType', finalData.tenantType || '');
      apiFormData.append('leaseStartDate', finalData.leaseStartDate || '');
      apiFormData.append('leaseEndDate', finalData.leaseExpiryDate || '');
      apiFormData.append('lockInPeriodYears', finalData.lockInYears || '0');
      apiFormData.append('lockInPeriodMonths', finalData.lockInMonths || '0');
      apiFormData.append('leaseDurationYears', finalData.leaseDuration || '0');

      const rentTypeMap = { perSqFt: 'Per Sq Ft', lumpSum: 'Lump Sum' };
      apiFormData.append(
        'rentType',
        rentTypeMap[finalData.rentType] || 'Per Sq Ft',
      );
      apiFormData.append('rentPerSqftMonthly', finalData.rentPerSqFt || '0');
      apiFormData.append('totalMonthlyRent', finalData.totalMonthlyRent || '0');

      const depositTypeMap = { months: 'Months of Rent', lumpSum: 'Lump Sum' };
      apiFormData.append(
        'securityDepositType',
        depositTypeMap[finalData.securityDepositType] || 'Months of Rent',
      );
      apiFormData.append(
        'securityDepositMonths',
        finalData.securityDepositMonths || '0',
      );
      apiFormData.append(
        'securityDepositAmount',
        finalData.securityDepositAmount || '0',
      );

      apiFormData.append(
        'escalationFrequencyYears',
        finalData.escalationFrequency || '0',
      );
      apiFormData.append(
        'annualEscalationPercent',
        finalData.escalationPercentage || '0',
      );

      const maintScopeMap = {
        included: 'Yes, included in rent',
        excluded: 'No, excluded from rent',
      };
      apiFormData.append(
        'maintenanceCostsIncluded',
        maintScopeMap[finalData.maintenanceScope] || 'No, excluded from rent',
      );

      const maintTypeMap = { perSqFt: 'Per Sq Ft', lumpSum: 'Lump Sum' };
      apiFormData.append(
        'maintenanceType',
        maintTypeMap[finalData.maintenanceType] || 'Per Sq Ft',
      );
      apiFormData.append(
        'maintenanceAmount',
        finalData.maintenanceAmount || '0',
      );

      // --- Financial Details ---
      apiFormData.append('sellingPrice', finalData.sellingPrice || '0');
      apiFormData.append('propertyTaxAnnual', finalData.propertyTax || '0');
      apiFormData.append('insuranceAnnual', finalData.insurance || '0');
      apiFormData.append('otherCostsAnnual', finalData.otherCosts || '0');
      apiFormData.append(
        'additionalIncomeAnnual',
        finalData.additionalIncome || '0',
      );

      // -- Location Details --
      apiFormData.append('microMarket', finalData.microMarket || '');
      apiFormData.append('city', finalData.city || '');
      apiFormData.append('state', finalData.state || '');
      apiFormData.append('demandDrivers', finalData.demandDrivers || '');
      apiFormData.append(
        'upcomingDevelopments',
        finalData.futureInfrastructure || '',
      );

      const mappedConnectivity = (finalData.connectivity || [])
        .filter((conn) => conn.type && conn.type.trim() !== '')
        .map((conn) => ({
          connectivityType: conn.type,
          name: conn.name,
          distanceKm: conn.distance,
        }));
      apiFormData.append(
        'connectivityDetails',
        JSON.stringify(mappedConnectivity),
      );

      // Media
      if (finalData.mediaFiles && Array.isArray(finalData.mediaFiles)) {
        finalData.mediaFiles.forEach((file) => {
            if (file.fileObject) {
              apiFormData.append('files', file.fileObject);
            }
        });
      }

      createProperty(
        apiFormData,
        (response) => {
          setLoading(false);
          showSuccess('Property Listed Successfully!');
          navigate('/property/view-property'); // Redirect to list page
        },
        (error) => {
          setLoading(false);
          console.error('Submission error:', error);
          showError(error?.message || 'Failed to list property. Please try again.');
        }
      );

    } catch (error) {
      setLoading(false);
      console.error('Error submitting property:', error);
      showError('An unexpected error occurred.');
    }
  };

  const CurrentComponent = STEPS[currentStep - 1].component;

  return (
    <div className="flex h-[calc(100vh-170px)] bg-gray-50 overflow-hidden">
      {/* Sidebar / Progress for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-[#EE2529] mb-8">Add Property</h2>
        <div className="flex flex-col gap-6">
          {STEPS.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                ${currentStep === step.id 
                  ? 'bg-[#EE2529] text-white' 
                  : currentStep > step.id 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'}
              `}>
                {currentStep > step.id ? '✓' : step.id}
              </div>
              <div className="flex-1 pt-1">
                <p className={`text-sm font-semibold ${currentStep === step.id ? 'text-gray-800' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                {currentStep === step.id && (
                  <p className="text-xs text-blue-500 mt-1">In Progress...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header for Mobile */}
        <div className="md:hidden bg-white border-b p-4 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-lg font-bold text-[#EE2529]">Step {currentStep} of {STEPS.length}</h2>
          <span className="text-sm font-medium text-gray-600">{STEPS[currentStep-1].title}</span>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 min-h-[500px]">
              <CurrentComponent
                ref={currentStepRef}
                onNext={handleNext}
                onFormValid={setIsStepValid}
                initialData={formData}
              />
           </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t p-4 px-8 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
           <button
             onClick={handleBack}
             disabled={currentStep === 1 || loading}
             className={`px-6 py-2 rounded-lg text-sm font-semibold border transition-colors ${
               currentStep === 1 
                 ? 'border-gray-200 text-gray-300 cursor-not-allowed' 
                 : 'border-gray-300 text-gray-700 hover:bg-gray-50'
             }`}
           >
             Back
           </button>

           <div className="text-sm text-gray-500 hidden md:block">
             Step {currentStep} of {STEPS.length}: <span className="font-semibold text-gray-700">{STEPS[currentStep-1].title}</span>
           </div>

           <button
             onClick={() => currentStepRef.current?.submit()}
             disabled={!isStepValid || loading}
             className={`flex items-center gap-2 px-8 py-2 rounded-lg text-sm font-semibold text-white transition-all shadow-md ${
               !isStepValid || loading
                 ? 'bg-gray-400 cursor-not-allowed'
                 : 'bg-[#EE2529] hover:bg-red-700 shadow-red-200'
             }`}
           >
             {loading ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Processing...
               </span>
             ) : (
               currentStep === STEPS.length ? 'Submit Property' : 'Next'
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
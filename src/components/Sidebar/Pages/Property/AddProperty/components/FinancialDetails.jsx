import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';

const FinancialDetails = forwardRef(({ onNext, onFormValid, initialData }, ref) => {
  useImperativeHandle(ref, () => ({
    submit: () => {
      onNext(formData);
    },
  }));

  const [formData, setFormData] = useState({
    sellingPrice: initialData?.sellingPrice || '',
    propertyTax: initialData?.propertyTax || '',
    insurance: initialData?.insurance || '',
    otherCosts: initialData?.otherCosts || '',
    additionalIncome: initialData?.additionalIncome || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [metrics, setMetrics] = useState({
    annualGrossRent: '₹0',
    grossRentalYield: '0%',
    annualOperatingCosts: '₹0',
    netRentalYield: '0%',
    netOperatingIncome: '₹0',
    paybackPeriod: '0 years',
    recurringCostsPerSqFt: '0',
    recurringCostsAsPercentageOfRent: '0%',
  });

  useEffect(() => {
    calculateMetrics();
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.sellingPrice !== '' &&
      formData.propertyTax !== '' &&
      formData.insurance !== ''
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'sellingPrice':
        if (!value) return 'Selling Price is required';
        if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
          return 'Please enter a valid price';
        return '';
      case 'propertyTax':
        if (!value) return 'Property Tax is required';
        if (!/^\d+(\.\d+)?$/.test(value))
          return 'Please enter a valid amount';
        return '';
      case 'insurance':
        if (!value) return 'Insurance is required';
        if (!/^\d+(\.\d+)?$/.test(value))
          return 'Please enter a valid amount';
        return '';
      default:
        return '';
    }
  };

  const calculateMetrics = () => {
    // Simplified metrics calculation
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const propertyTax = parseFloat(formData.propertyTax) || 0;
    const insurance = parseFloat(formData.insurance) || 0;
    const otherCosts = parseFloat(formData.otherCosts) || 0;
    const additionalIncome = parseFloat(formData.additionalIncome) || 0;

    const opCosts = propertyTax + insurance + otherCosts;

    setMetrics((prev) => ({
      ...prev,
      annualOperatingCosts: `₹${opCosts.toLocaleString()}`,
    }));
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, String(value));
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const valueToValidate =
      value !== undefined ? value : String(formData[name]);
    const error = validateField(name, valueToValidate);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#EE2529] text-center mb-6">
        Financial Analytics
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Property Details</h3>
        
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            Selling Price *
            <span className="text-gray-400 cursor-help" title="Enter the selling price">ⓘ</span>
          </label>
          <input
            type="number"
            placeholder="Enter Property Selling Price"
            className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
               touched.sellingPrice && errors.sellingPrice ? 'border-red-500' : 'border-transparent'
            }`}
            value={formData.sellingPrice}
            onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
            onBlur={(e) => handleBlur('sellingPrice', e.target.value)}
          />
           {touched.sellingPrice && errors.sellingPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.sellingPrice}</p>
            )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Annual Operating Costs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Tax (Annual) *</label>
              <input
                type="number"
                placeholder="0"
                className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   touched.propertyTax && errors.propertyTax ? 'border-red-500' : 'border-transparent'
                }`}
                value={formData.propertyTax}
                onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                onBlur={(e) => handleBlur('propertyTax', e.target.value)}
              />
              {touched.propertyTax && errors.propertyTax && (
                <p className="text-red-500 text-xs mt-1">{errors.propertyTax}</p>
              )}
           </div>
           
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Insurance (Annual) *</label>
              <input
                type="number"
                placeholder="0"
                className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   touched.insurance && errors.insurance ? 'border-red-500' : 'border-transparent'
                }`}
                value={formData.insurance}
                onChange={(e) => handleInputChange('insurance', e.target.value)}
                onBlur={(e) => handleBlur('insurance', e.target.value)}
              />
               {touched.insurance && errors.insurance && (
                <p className="text-red-500 text-xs mt-1">{errors.insurance}</p>
              )}
           </div>
        </div>

        <div className="mb-4">
           <label className="block text-sm font-bold text-gray-700 mb-2">Other Costs (Annual)</label>
           <input
             type="number"
             placeholder="0"
             className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
             value={formData.otherCosts}
             onChange={(e) => handleInputChange('otherCosts', e.target.value)}
           />
        </div>

        <div className="bg-gray-200 rounded-lg p-4 flex justify-between items-center mb-6">
           <span className="text-sm font-bold text-gray-600">Total Operating Annual Costs</span>
           <span className="text-base font-bold text-black">{metrics.annualOperatingCosts}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Additional Income Details</h3>
        <div className="mb-4">
           <label className="block text-sm font-bold text-gray-700 mb-2">Additional Income (Annual)</label>
           <input
             type="number"
             placeholder="Enter Additional Income"
             className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
             value={formData.additionalIncome}
             onChange={(e) => handleInputChange('additionalIncome', e.target.value)}
           />
           <p className="text-xs text-gray-500 mt-1">Any additional income from parking, advertisements, etc.</p>
        </div>
      </div>

      <div className="mb-6">
         <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Calculated Metrics</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Annual Gross Rent:', value: metrics.annualGrossRent },
              { label: 'Gross Rental Yield:', value: metrics.grossRentalYield },
              { label: 'Annual Operating Costs:', value: metrics.annualOperatingCosts },
              { label: 'Net Rental Yield:', value: metrics.netRentalYield },
              { label: 'Net Operating Income (NOI):', value: metrics.netOperatingIncome },
              { label: 'Payback Period:', value: metrics.paybackPeriod },
              { label: 'Recurring Costs per sq ft:', value: metrics.recurringCostsPerSqFt },
              { label: 'Recurring Costs as % of Rent:', value: metrics.recurringCostsAsPercentageOfRent },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-3">
                 <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                 <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
});

export default FinancialDetails;

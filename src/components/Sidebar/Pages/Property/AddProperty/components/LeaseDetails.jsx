import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import CustomDropdown from './CustomDropdown';
import CustomDatePicker from './CustomDatePicker';

const LeaseDetails = forwardRef(({ onNext, onFormValid, initialData }, ref) => {
  useImperativeHandle(ref, () => ({
    submit: () => {
      onNext(formData);
    },
  }));

  const tenantTypeOptions = [
    { label: 'Government', value: 'Government' },
    { label: 'Startup', value: 'Startup' },
    { label: 'MNC', value: 'MNC' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Others', value: 'Others' },
  ];

  const maintenanceScopeOptions = [
    { label: 'Yes, included in rent', value: 'Yes, included in rent' },
    { label: 'No, excluded from rent', value: 'No, excluded from rent' },
  ];

  const [formData, setFormData] = useState({
    tenantType: initialData?.tenantType || '',
    leaseStartDate: initialData?.leaseStartDate || '',
    leaseExpiryDate: initialData?.leaseExpiryDate || '',
    lockInYears: initialData?.lockInYears || '',
    lockInMonths: initialData?.lockInMonths || '',
    leaseDuration: initialData?.leaseDuration || '',
    rentType: initialData?.rentType || 'Per Sq Ft',
    rentPerSqFt: initialData?.rentPerSqFt || '',
    totalMonthlyRent: initialData?.totalMonthlyRent || '',
    securityDepositType: initialData?.securityDepositType || 'Months of Rent',
    securityDepositMonths: initialData?.securityDepositMonths || '',
    securityDepositAmount: initialData?.securityDepositAmount || '',
    escalationPercentage: initialData?.escalationPercentage || '',
    escalationFrequency: initialData?.escalationFrequency || '',
    maintenanceScope: initialData?.maintenanceScope || '',
    maintenanceType: initialData?.maintenanceType || 'Per Sq Ft',
    maintenanceAmount: initialData?.maintenanceAmount || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.tenantType !== '' &&
      formData.leaseStartDate !== '' &&
      formData.leaseExpiryDate !== '' &&
      formData.leaseDuration !== '' &&
      (formData.rentType === 'Per Sq Ft'
        ? formData.rentPerSqFt !== ''
        : formData.totalMonthlyRent !== '') &&
      (formData.securityDepositType === 'Months of Rent'
        ? formData.securityDepositMonths !== ''
        : formData.securityDepositAmount !== '') &&
      formData.escalationPercentage !== '' &&
      formData.escalationFrequency !== '' &&
      formData.maintenanceScope !== ''
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'tenantType':
        return !value ? 'Tenant Type is required' : '';
      case 'leaseStartDate':
        if (!value) return 'Lease Start Date is required';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
          return 'Invalid date format (YYYY-MM-DD)';
        return '';
      case 'leaseExpiryDate':
        if (!value) return 'Lease End Date is required';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
          return 'Invalid date format (YYYY-MM-DD)';
        return '';
      case 'leaseDuration':
        if (!value) return 'Lease Duration is required';
        if (!/^\d+$/.test(value) || parseInt(value) <= 0)
          return 'Please enter a valid duration';
        return '';
      case 'rentPerSqFt':
        if (formData.rentType === 'Per Sq Ft') {
          if (!value) return 'Rent Per Sq Ft is required';
          if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
            return 'Please enter a valid amount';
        }
        return '';
      case 'totalMonthlyRent':
        if (formData.rentType === 'Lump Sum') {
          if (!value) return 'Total Monthly Rent is required';
          if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
            return 'Please enter a valid amount';
        }
        return '';
      case 'securityDepositMonths':
        if (formData.securityDepositType === 'Months of Rent') {
          if (!value) return 'Deposit (Months) is required';
          if (!/^\d+$/.test(value) || parseInt(value) <= 0)
            return 'Please enter a valid number';
        }
        return '';
      case 'securityDepositAmount':
        if (formData.securityDepositType === 'Lump Sum') {
          if (!value) return 'Deposit Amount is required';
          if (!/^\d+(\.\d+)?$/.test(value) || parseFloat(value) <= 0)
            return 'Please enter a valid amount';
        }
        return '';
      case 'escalationPercentage':
        if (!value) return 'Annual Escalation is required';
        if (!/^\d+(\.\d+)?$/.test(value))
          return 'Please enter a valid percentage';
        return '';
      case 'escalationFrequency':
        if (!value) return 'Frequency is required';
        if (!/^\d+$/.test(value) || parseInt(value) <= 0)
          return 'Please enter a valid number';
        return '';
      case 'maintenanceScope':
        return !value ? 'Maintenance Costs is required' : '';
      default:
        return '';
    }
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
      value !== undefined
        ? value
        : String(formData[name]);
    const error = validateField(name, valueToValidate);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#EE2529] text-center mb-6">
        Lease & Tenant Details
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Tenant Information</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Tenant Type *</label>
          <CustomDropdown
            placeholder="Select Tenant Type"
            value={formData.tenantType}
            options={tenantTypeOptions}
            onChange={(v) => {
              handleInputChange('tenantType', v);
              handleBlur('tenantType', v);
            }}
            onBlur={() => handleBlur('tenantType')}
            error={touched.tenantType && !!errors.tenantType}
          />
          {touched.tenantType && errors.tenantType && (
            <p className="text-red-500 text-xs mt-1">{errors.tenantType}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Lease Duration & Terms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lease Start Date *</label>
            <CustomDatePicker
              value={formData.leaseStartDate}
              onChange={(v) => handleInputChange('leaseStartDate', v)}
              onBlur={() => handleBlur('leaseStartDate')}
              placeholder="YYYY-MM-DD"
              error={touched.leaseStartDate && !!errors.leaseStartDate}
            />
            {touched.leaseStartDate && errors.leaseStartDate && (
              <p className="text-red-500 text-xs mt-1">{errors.leaseStartDate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lease End Date *</label>
            <CustomDatePicker
              value={formData.leaseExpiryDate}
              onChange={(v) => handleInputChange('leaseExpiryDate', v)}
              onBlur={() => handleBlur('leaseExpiryDate')}
              placeholder="YYYY-MM-DD"
              error={touched.leaseExpiryDate && !!errors.leaseExpiryDate}
            />
            {touched.leaseExpiryDate && errors.leaseExpiryDate && (
              <p className="text-red-500 text-xs mt-1">{errors.leaseExpiryDate}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lock In Period</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Years"
                className="flex-1 bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                value={formData.lockInYears}
                onChange={(e) => handleInputChange('lockInYears', e.target.value)}
              />
              <input
                type="number"
                placeholder="Months"
                className="flex-1 bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                value={formData.lockInMonths}
                onChange={(e) => handleInputChange('lockInMonths', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lease Duration (Years) *</label>
            <input
              type="number"
              placeholder="0"
              className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                 touched.leaseDuration && errors.leaseDuration ? 'border-red-500' : 'border-transparent'
              }`}
              value={formData.leaseDuration}
              onChange={(e) => handleInputChange('leaseDuration', e.target.value)}
              onBlur={(e) => handleBlur('leaseDuration', e.target.value)}
            />
            {touched.leaseDuration && errors.leaseDuration && (
              <p className="text-red-500 text-xs mt-1">{errors.leaseDuration}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Rental & Deposit Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          {/* Rent Type Toggle */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Rent Type</label>
            <div className="flex gap-4">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio" 
                    name="rentType"
                    className="w-4 h-4 text-[#EE2529] focus:ring-[#EE2529]"
                    checked={formData.rentType === 'Per Sq Ft'}
                    onChange={() => handleInputChange('rentType', 'Per Sq Ft')}
                  />
                  <span className="text-sm text-gray-700">Sq Ft</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rentType" 
                    className="w-4 h-4 text-[#EE2529] focus:ring-[#EE2529]"
                    checked={formData.rentType === 'Lump Sum'}
                    onChange={() => handleInputChange('rentType', 'Lump Sum')}
                  />
                  <span className="text-sm text-gray-700">Lump Sum</span>
               </label>
            </div>
          </div>

          {/* Deposit Type Toggle */}
           <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Deposit Type</label>
            <div className="flex gap-4">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="securityDepositType"
                    className="w-4 h-4 text-[#EE2529] focus:ring-[#EE2529]"
                    checked={formData.securityDepositType === 'Months of Rent'}
                    onChange={() => handleInputChange('securityDepositType', 'Months of Rent')}
                  />
                  <span className="text-sm text-gray-700">Months</span>
               </label>
               <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="securityDepositType"
                    className="w-4 h-4 text-[#EE2529] focus:ring-[#EE2529]"
                    checked={formData.securityDepositType === 'Lump Sum'}
                    onChange={() => handleInputChange('securityDepositType', 'Lump Sum')}
                  />
                  <span className="text-sm text-gray-700">Lump Sum</span>
               </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
           {/* Rent Input */}
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                 {formData.rentType === 'Per Sq Ft' ? 'Rent Per Sq Ft *' : 'Total Monthly Rent *'}
              </label>
              <input
                type="number"
                placeholder="0.00"
                className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   (touched.rentPerSqFt && errors.rentPerSqFt) || (touched.totalMonthlyRent && errors.totalMonthlyRent) ? 'border-red-500' : 'border-transparent'
                }`}
                value={formData.rentType === 'Per Sq Ft' ? formData.rentPerSqFt : formData.totalMonthlyRent}
                onChange={(e) => handleInputChange(formData.rentType === 'Per Sq Ft' ? 'rentPerSqFt' : 'totalMonthlyRent', e.target.value)}
                onBlur={(e) => handleBlur(formData.rentType === 'Per Sq Ft' ? 'rentPerSqFt' : 'totalMonthlyRent', e.target.value)}
              />
              {((touched.rentPerSqFt && errors.rentPerSqFt) || (touched.totalMonthlyRent && errors.totalMonthlyRent)) && (
                <p className="text-red-500 text-xs mt-1">
                  {formData.rentType === 'Per Sq Ft' ? errors.rentPerSqFt : errors.totalMonthlyRent}
                </p>
              )}
           </div>

           {/* Deposit Input */}
           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                 {formData.securityDepositType === 'Months of Rent' ? 'Deposit (Months) *' : 'Deposit Amount *'}
              </label>
              <input
                type="number"
                placeholder={formData.securityDepositType === 'Months of Rent' ? "0" : "0.00"}
                className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   (touched.securityDepositMonths && errors.securityDepositMonths) || (touched.securityDepositAmount && errors.securityDepositAmount) ? 'border-red-500' : 'border-transparent'
                }`}
                value={formData.securityDepositType === 'Months of Rent' ? formData.securityDepositMonths : formData.securityDepositAmount}
                onChange={(e) => handleInputChange(formData.securityDepositType === 'Months of Rent' ? 'securityDepositMonths' : 'securityDepositAmount', e.target.value)}
                onBlur={(e) => handleBlur(formData.securityDepositType === 'Months of Rent' ? 'securityDepositMonths' : 'securityDepositAmount', e.target.value)}
              />
              {((touched.securityDepositMonths && errors.securityDepositMonths) || (touched.securityDepositAmount && errors.securityDepositAmount)) && (
                <p className="text-red-500 text-xs mt-1">
                  {formData.securityDepositType === 'Months of Rent' ? errors.securityDepositMonths : errors.securityDepositAmount}
                </p>
              )}
           </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Escalation Terms & Maintenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Frequency (Years) *</label>
            <input
              type="number"
              placeholder="Every X years"
              className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                 touched.escalationFrequency && errors.escalationFrequency ? 'border-red-500' : 'border-transparent'
              }`}
              value={formData.escalationFrequency}
              onChange={(e) => handleInputChange('escalationFrequency', e.target.value)}
              onBlur={(e) => handleBlur('escalationFrequency', e.target.value)}
            />
            {touched.escalationFrequency && errors.escalationFrequency && (
              <p className="text-red-500 text-xs mt-1">{errors.escalationFrequency}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Annual Escalation (%) *</label>
            <input
              type="number"
              placeholder="0 %"
              className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                 touched.escalationPercentage && errors.escalationPercentage ? 'border-red-500' : 'border-transparent'
              }`}
              value={formData.escalationPercentage}
              onChange={(e) => handleInputChange('escalationPercentage', e.target.value)}
              onBlur={(e) => handleBlur('escalationPercentage', e.target.value)}
            />
             {touched.escalationPercentage && errors.escalationPercentage && (
              <p className="text-red-500 text-xs mt-1">{errors.escalationPercentage}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Maintenance Costs *</label>
          <CustomDropdown
            placeholder="Are maintenance costs included?"
            value={formData.maintenanceScope}
            options={maintenanceScopeOptions}
            onChange={(v) => {
              handleInputChange('maintenanceScope', v);
              handleBlur('maintenanceScope', v);
            }}
            onBlur={() => handleBlur('maintenanceScope')}
            error={touched.maintenanceScope && !!errors.maintenanceScope}
          />
           {touched.maintenanceScope && errors.maintenanceScope && (
              <p className="text-red-500 text-xs mt-1">{errors.maintenanceScope}</p>
            )}
        </div>

        {formData.maintenanceScope !== '' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm text-gray-500 cursor-not-allowed"
                  value={formData.maintenanceType === 'Per Sq Ft' ? 'Sq Ft' : 'Lump Sum'}
                  disabled
                />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                <input
                   type="number"
                   placeholder="0.00"
                   className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                   value={formData.maintenanceAmount}
                   onChange={(e) => handleInputChange('maintenanceAmount', e.target.value)}
                />
             </div>
           </div>
        )}
      </div>
    </div>
  );
});

export default LeaseDetails;

import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import CustomDropdown from './CustomDropdown';

const INDIAN_STATES = [
  { label: 'Andaman and Nicobar Islands', value: 'Andaman and Nicobar Islands' },
  { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
  { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
  { label: 'Assam', value: 'Assam' },
  { label: 'Bihar', value: 'Bihar' },
  { label: 'Chandigarh', value: 'Chandigarh' },
  { label: 'Chhattisgarh', value: 'Chhattisgarh' },
  { label: 'Dadra and Nagar Haveli', value: 'Dadra and Nagar Haveli' },
  { label: 'Daman and Diu', value: 'Daman and Diu' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Goa', value: 'Goa' },
  { label: 'Gujarat', value: 'Gujarat' },
  { label: 'Haryana', value: 'Haryana' },
  { label: 'Himachal Pradesh', value: 'Himachal Pradesh' },
  { label: 'Jharkhand', value: 'Jharkhand' },
  { label: 'Karnataka', value: 'Karnataka' },
  { label: 'Kerala', value: 'Kerala' },
  { label: 'Ladakh', value: 'Ladakh' },
  { label: 'Lakshadweep', value: 'Lakshadweep' },
  { label: 'Madhya Pradesh', value: 'Madhya Pradesh' },
  { label: 'Maharashtra', value: 'Maharashtra' },
  { label: 'Manipur', value: 'Manipur' },
  { label: 'Meghalaya', value: 'Meghalaya' },
  { label: 'Mizoram', value: 'Mizoram' },
  { label: 'Nagaland', value: 'Nagaland' },
  { label: 'Odisha', value: 'Odisha' },
  { label: 'Puducherry', value: 'Puducherry' },
  { label: 'Punjab', value: 'Punjab' },
  { label: 'Rajasthan', value: 'Rajasthan' },
  { label: 'Sikkim', value: 'Sikkim' },
  { label: 'Tamil Nadu', value: 'Tamil Nadu' },
  { label: 'Telangana', value: 'Telangana' },
  { label: 'Tripura', value: 'Tripura' },
  { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
  { label: 'Uttarakhand', value: 'Uttarakhand' },
  { label: 'West Bengal', value: 'West Bengal' },
];

const CITY_BY_STATE = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Amaravati', 'Tirupati'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun'],
  Assam: ['Guwahati', 'Dibrugarh', 'Silchar'],
  Bihar: ['Patna', 'Gaya', 'Bhagalpur'],
  Chandigarh: ['Chandigarh'],
  Chhattisgarh: ['Raipur', 'Durg', 'Bilaspur'],
  Delhi: ['New Delhi', 'Delhi'],
  Goa: ['Panaji', 'Margao'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
  Haryana: ['Gurgaon', 'Faridabad', 'Hisar', 'Panipat'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Kangra'],
  Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  Karnataka: ['Bangalore', 'Mysore', 'Pune', 'Mangalore', 'Belgaum'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur'],
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Aurangabad'],
  Manipur: ['Imphal'],
  Meghalaya: ['Shillong'],
  Mizoram: ['Aizawl'],
  Nagaland: ['Kohima'],
  Odisha: ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  Puducherry: ['Puducherry', 'Yanam'],
  Punjab: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
  Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  Sikkim: ['Gangtok'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
  Telangana: ['Hyderabad', 'Secundrabad', 'Warangal'],
  Tripura: ['Agartala'],
  'Uttar Pradesh': ['Lucknow', 'Noida', 'Ghaziabad', 'Kanpur', 'Varanasi'],
  Uttarakhand: ['Dehradun', 'Haridwar', 'Nainital'],
  'West Bengal': ['Kolkata', 'Darjeeling', 'Siliguri'],
};

const CONNECTIVITY_TYPES = [
  { label: 'Airport', value: 'Airport' },
  { label: 'Railway Station', value: 'Railway Station' },
  { label: 'Metro Station', value: 'Metro Station' },
  { label: 'Highway', value: 'Highway' },
  { label: 'Bus Station', value: 'Bus Station' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'School', value: 'School' },
  { label: 'Shopping Mall', value: 'Shopping Mall' },
  { label: 'Office Park', value: 'Office Park' },
];

const LocationDetails = forwardRef(({ onNext, onFormValid, initialData }, ref) => {
  useImperativeHandle(ref, () => ({
    submit: () => {
      onNext(formData);
    },
  }));

  const [formData, setFormData] = useState({
    microMarket: initialData?.microMarket || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    connectivity: initialData?.connectivity || [
      { id: 1, type: '', name: '', distance: '' },
    ],
    demandDrivers: initialData?.demandDrivers || '',
    futureInfrastructure: initialData?.futureInfrastructure || '',
    faqs:
      initialData?.faqs ||
      [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.microMarket.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== ''
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'microMarket':
        return !value?.trim() ? 'Micro Market is required' : '';
      case 'city':
        return !value?.trim() ? 'City is required' : '';
      case 'state':
        return !value?.trim() ? 'State is required' : '';
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
      value !== undefined ? value : String(formData[name]);
    const error = validateField(name, valueToValidate);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleConnectivityChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      connectivity: prev.connectivity.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addConnectivity = () => {
    setFormData((prev) => ({
      ...prev,
      connectivity: [
        ...prev.connectivity,
        { id: Date.now(), type: '', name: '', distance: '' },
      ],
    }));
  };

  const removeConnectivity = (id) => {
    setFormData((prev) => ({
      ...prev,
      connectivity: prev.connectivity.filter((item) => item.id !== id),
    }));
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { id: Date.now(), question: '', answer: '' }],
    }));
  };

  const handleFaqChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq) =>
        faq.id === id ? { ...faq, [field]: value } : faq,
      ),
    }));
  };

  const removeFaq = (id) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((faq) => faq.id !== id),
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#EE2529] text-center mb-6">
        Location & Market Details
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Location Details</h3>
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Micro Market *</label>
          <input
            type="text"
            placeholder="Enter Micro Market"
            className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
               touched.microMarket && errors.microMarket ? 'border-red-500' : 'border-transparent'
            }`}
            value={formData.microMarket}
            onChange={(e) => handleInputChange('microMarket', e.target.value)}
            onBlur={(e) => handleBlur('microMarket', e.target.value)}
          />
          {touched.microMarket && errors.microMarket && (
            <p className="text-red-500 text-xs mt-1">{errors.microMarket}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
               <CustomDropdown
                 placeholder="Select State"
                 value={formData.state}
                 options={INDIAN_STATES}
                 onChange={(v) => {
                   handleInputChange('state', v);
                   handleInputChange('city', ''); // Reset city
                   handleBlur('state', v);
                 }}
                 onBlur={() => handleBlur('state')}
                 error={touched.state && !!errors.state}
               />
               {touched.state && errors.state && (
                 <p className="text-red-500 text-xs mt-1">{errors.state}</p>
               )}
            </div>

            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
               <CustomDropdown
                 placeholder="Select City"
                 value={formData.city}
                 options={
                   formData.state && CITY_BY_STATE[formData.state]
                     ? CITY_BY_STATE[formData.state].map(c => ({ label: c, value: c }))
                     : []
                 }
                 onChange={(v) => {
                   handleInputChange('city', v);
                   handleBlur('city', v);
                 }}
                 onBlur={() => handleBlur('city')}
                 error={touched.city && !!errors.city}
               />
               {touched.city && errors.city && (
                 <p className="text-red-500 text-xs mt-1">{errors.city}</p>
               )}
            </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Connectivity Details</h3>
        {formData.connectivity.map((item, index) => (
          <div key={item.id} className="bg-white border rounded-lg p-4 mb-3 relative">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                {formData.connectivity.length > 1 && (
                   <button
                     type="button"
                     onClick={() => removeConnectivity(item.id)}
                     className="text-red-500 hover:text-red-700"
                   >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                     </svg>
                   </button>
                )}
             </div>
             
             <div className="mb-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">Type</label>
                <CustomDropdown
                  placeholder="Select Type"
                  value={item.type}
                  options={CONNECTIVITY_TYPES}
                  onChange={(v) => handleConnectivityChange(item.id, 'type', v)}
                />
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                   <label className="block text-xs font-bold text-gray-600 mb-1">Name</label>
                   <input
                     type="text"
                     placeholder="Enter Name"
                     className="w-full bg-white border rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EE2529]"
                     value={item.name}
                     onChange={(e) => handleConnectivityChange(item.id, 'name', e.target.value)}
                   />
                </div>
                <div className="col-span-1">
                   <label className="block text-xs font-bold text-gray-600 mb-1">Distance (KM)</label>
                   <input
                     type="number"
                     placeholder="0"
                     className="w-full bg-white border rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EE2529]"
                     value={item.distance}
                     onChange={(e) => handleConnectivityChange(item.id, 'distance', e.target.value)}
                   />
                </div>
             </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addConnectivity}
          className="flex items-center gap-2 text-[#EE2529] font-semibold border border-[#EE2529] rounded-lg px-4 py-2 hover:bg-red-50 text-sm w-full justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Connectivity
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Demand Drivers</h3>
        <div className="mb-4">
           <label className="block text-sm font-bold text-gray-700 mb-2">Key factors driving property demand</label>
           <textarea
             className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] h-20"
             placeholder="e.g., Proximity to campuses"
             value={formData.demandDrivers}
             onChange={(e) => handleInputChange('demandDrivers', e.target.value)}
           />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Future Infrastructure</h3>
         <div className="mb-4">
           <label className="block text-sm font-bold text-gray-700 mb-2">Upcoming developments and projects</label>
           <textarea
             className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] h-20"
             placeholder="e.g., Upcoming Ring Road"
             value={formData.futureInfrastructure}
             onChange={(e) => handleInputChange('futureInfrastructure', e.target.value)}
           />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Frequently Asked Questions</h3>
         {formData.faqs.map((faq, index) => (
          <div key={faq.id} className="bg-white border rounded-lg p-4 mb-3 relative">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-400">FAQ #{index + 1}</span>
                 <button
                     type="button"
                     onClick={() => removeFaq(faq.id)}
                     className="text-red-500 hover:text-red-700"
                   >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                     </svg>
                   </button>
             </div>
             
             <div className="mb-2">
               <label className="block text-xs font-bold text-gray-600 mb-1">Question</label>
               <input
                 type="text"
                 placeholder="Enter Question"
                 className="w-full bg-white border rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EE2529]"
                 value={faq.question}
                 onChange={(e) => handleFaqChange(faq.id, 'question', e.target.value)}
               />
             </div>
             <div>
               <label className="block text-xs font-bold text-gray-600 mb-1">Answer</label>
               <textarea
                 placeholder="Enter Answer"
                 className="w-full bg-white border rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EE2529] h-16"
                 value={faq.answer}
                 onChange={(e) => handleFaqChange(faq.id, 'answer', e.target.value)}
               />
             </div>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addFaq}
          className="flex items-center gap-2 text-[#EE2529] font-semibold border border-[#EE2529] rounded-lg px-4 py-2 hover:bg-red-50 text-sm w-full justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add FAQ
        </button>
      </div>
    </div>
  );
});

export default LocationDetails;

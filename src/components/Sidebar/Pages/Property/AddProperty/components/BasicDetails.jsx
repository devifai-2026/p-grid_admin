import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import CustomDropdown from './CustomDropdown';
import CustomMultiSelect from './CustomMultiSelect';
import { usePropertyAPIs } from '../../../../../../helpers/hooks/usePropertyAPIs';

const BasicDetails = forwardRef(({ onNext, onFormValid, initialData }, ref) => {
  const { getAmenities, getCaretakers } = usePropertyAPIs();
  
  // Assuming width check is not strictly needed for logic, but for responsive layout we use Tailwind classes
  
  useImperativeHandle(ref, () => ({
    submit: () => {
      onNext({ ...formData, carpetAreaUnit: 'Sq. Feet', mediaFiles });
    },
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 31 }, (_, i) => ({
    label: (currentYear - i).toString(),
    value: (currentYear - i).toString(),
  }));

  const propertyTypeOptions = [
    { label: 'Residential', value: 'Residential' },
    { label: 'Retail', value: 'Retail' },
    { label: 'Offices', value: 'Offices' },
    { label: 'Industrial', value: 'Industrial' },
    { label: 'Others', value: 'Others' },
  ];

  const buildingGradeOptions = [
    { label: 'Grade A+', value: 'A+' },
    { label: 'Grade A', value: 'A' },
    { label: 'Grade B+', value: 'B+' },
    { label: 'Grade B', value: 'B' },
    { label: 'Grade C', value: 'C' },
  ];

  const ownershipOptions = [
    { label: 'Freehold', value: 'Freehold' },
    { label: 'Leasehold', value: 'Leasehold' },
    { label: 'Jointly-hold', value: 'Jointly-hold' },
    { label: 'Government Owned', value: 'Government Owned' },
  ];

  const furnishingOptions = [
    {
      label: 'Fully Furnished by landowner',
      value: 'Fully Furnished by landowner',
    },
    {
      label: 'Semi-Furnished by landowner',
      value: 'Semi-Furnished by landowner',
    },
    {
      label: 'Not Furnished by landowner',
      value: 'Not Furnished by landowner',
    },
  ];

  const powerBackupOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const hvacOptions = [
    { label: 'Central AC', value: 'Central AC' },
    { label: 'Split AC', value: 'Split AC' },
    { label: 'VRF System', value: 'VRF System' },
    { label: 'Chilled Water System', value: 'Chilled Water System' },
    { label: 'None', value: 'None' },
  ];

  const [amenityOptions, setAmenityOptions] = useState([]);
  const [caretakerOptions, setCaretakerOptions] = useState([]);

  useEffect(() => {
    getAmenities((data) => {
      if (Array.isArray(data)) {
        const options = data.map((a) => ({
          label: a.amenityName,
          value: a.amenityId,
        }));
        setAmenityOptions(options);
      }
    });
    getCaretakers((data) => {
      if (Array.isArray(data)) {
        const options = data.map((c) => ({
          label: c.caretakerName,
          value: String(c.caretakerId),
        }));
        setCaretakerOptions(options);
      }
    });
  }, []);

  const [formData, setFormData] = useState({
    propertyType: initialData?.propertyType || '',
    builtYear: initialData?.builtYear || '',
    buildingGrade: initialData?.buildingGrade || '',
    carpetArea: initialData?.carpetArea || '',
    carpetAreaUnit: initialData?.carpetAreaUnit || 'Sq. Feet',
    lastRefurbished: initialData?.lastRefurbished || '',
    ownership: initialData?.ownership || '',
    fourWheelerParkings: initialData?.fourWheelerParkings || '',
    twoWheelerParkings: initialData?.twoWheelerParkings || '',
    powerBackup: initialData?.powerBackup || '',
    numLifts: initialData?.numLifts || '',
    hvacType: initialData?.hvacType || '',
    furnishingStatus: initialData?.furnishingStatus || '',
    buildingMaintained: initialData?.buildingMaintained || '',
    amenityIds: initialData?.amenityIds || [],
    propertyDescription: initialData?.propertyDescription || '',
  });

  const [mediaFiles, setMediaFiles] = useState(
    initialData?.mediaFiles || []
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.propertyType !== '' &&
      formData.builtYear !== '' &&
      formData.buildingGrade !== '' &&
      formData.carpetArea !== '' &&
      formData.ownership !== '' &&
      formData.fourWheelerParkings !== '' &&
      formData.twoWheelerParkings !== '' &&
      formData.furnishingStatus !== ''
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'propertyType':
        return !value ? 'Property Type is required' : '';
      case 'builtYear':
        if (!value) return 'Completion Year is required';
        if (!/^\d{4}$/.test(value)) return 'Please enter a valid year';
        const year = parseInt(value);
        if (year < 1900 || year > currentYear)
          return `Year must be between 1900 and ${currentYear}`;
        return '';
      case 'buildingGrade':
        return !value ? 'Building Grade is required' : '';
      case 'carpetArea':
        if (!value) return 'Carpet Area is required';
        if (!/^\d+$/.test(value) || parseInt(value) <= 0)
          return 'Please enter a valid area';
        return '';
      case 'ownership':
        return !value ? 'Ownership is required' : '';
      case 'fourWheelerParkings':
        if (!value) return '4 Wheeler Parkings is required';
        if (!/^\d+$/.test(value)) return 'Please enter a valid number';
        return '';
      case 'twoWheelerParkings':
        if (!value) return '2 Wheeler Parkings is required';
        if (!/^\d+$/.test(value)) return 'Please enter a valid number';
        return '';
      case 'furnishingStatus':
        return !value ? 'Furnishing Status is required' : '';
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

  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) => ({
        uri: URL.createObjectURL(file), // create temporary URL for preview
        fileName: file.name,
        type: file.type,
        fileSize: file.size,
        fileObject: file,
      }));
      setMediaFiles(files);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#EE2529] text-center mb-6">
        Property Overview and Basic Details
      </h2>

      <div className="mb-6">
         <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Basic Property Details</h3>
         
         <div className="mb-4">
           <label className="block text-sm font-bold text-gray-700 mb-2">Property Type *</label>
           <CustomDropdown
             placeholder="Select Property Type"
             value={formData.propertyType}
             options={propertyTypeOptions}
             onChange={(v) => {
               handleInputChange('propertyType', v);
               handleBlur('propertyType', v);
             }}
             onBlur={() => handleBlur('propertyType')}
             error={touched.propertyType && !!errors.propertyType}
           />
           {touched.propertyType && errors.propertyType && (
             <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>
           )}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Carpet Area *</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Area"
                  className={`flex-1 bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                    touched.carpetArea && errors.carpetArea ? 'border-red-500' : 'border-transparent'
                  }`}
                  value={formData.carpetArea}
                  onChange={(e) => handleInputChange('carpetArea', e.target.value)}
                  onBlur={(e) => handleBlur('carpetArea', e.target.value)}
                />
                <div className="w-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                  Sq. Ft.
                </div>
              </div>
              {touched.carpetArea && errors.carpetArea && (
                <p className="text-red-500 text-xs mt-1">{errors.carpetArea}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Completion Year *</label>
              <input
                type="number"
                placeholder="Year"
                className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                  touched.builtYear && errors.builtYear ? 'border-red-500' : 'border-transparent'
                }`}
                value={formData.builtYear}
                onChange={(e) => handleInputChange('builtYear', e.target.value)}
                onBlur={(e) => handleBlur('builtYear', e.target.value)}
              />
              {touched.builtYear && errors.builtYear && (
                <p className="text-red-500 text-xs mt-1">{errors.builtYear}</p>
              )}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Building Grade *</label>
               <CustomDropdown
                 placeholder="Select Grade"
                 value={formData.buildingGrade}
                 options={buildingGradeOptions}
                 onChange={(v) => {
                   handleInputChange('buildingGrade', v);
                   handleBlur('buildingGrade', v);
                 }}
                 onBlur={() => handleBlur('buildingGrade')}
                 error={touched.buildingGrade && !!errors.buildingGrade}
               />
               {touched.buildingGrade && errors.buildingGrade && (
                 <p className="text-red-500 text-xs mt-1">{errors.buildingGrade}</p>
               )}
            </div>
            
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Ownership *</label>
               <CustomDropdown
                 placeholder="Select Ownership"
                 value={formData.ownership}
                 options={ownershipOptions}
                 onChange={(v) => {
                   handleInputChange('ownership', v);
                   handleBlur('ownership', v);
                 }}
                 onBlur={() => handleBlur('ownership')}
                 error={touched.ownership && !!errors.ownership}
               />
               {touched.ownership && errors.ownership && (
                 <p className="text-red-500 text-xs mt-1">{errors.ownership}</p>
               )}
            </div>
         </div>
      </div>
      
      <div className="mb-6">
         <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Parking Details</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">4 Wheeler Parkings *</label>
               <input
                 type="number"
                 placeholder="Slots"
                 className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   touched.fourWheelerParkings && errors.fourWheelerParkings ? 'border-red-500' : 'border-transparent'
                 }`}
                 value={formData.fourWheelerParkings}
                 onChange={(e) => handleInputChange('fourWheelerParkings', e.target.value)}
                 onBlur={(e) => handleBlur('fourWheelerParkings', e.target.value)}
               />
               {touched.fourWheelerParkings && errors.fourWheelerParkings && (
                  <p className="text-red-500 text-xs mt-1">{errors.fourWheelerParkings}</p>
               )}
            </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">2 Wheeler Parkings *</label>
               <input
                 type="number"
                 placeholder="Slots"
                 className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   touched.twoWheelerParkings && errors.twoWheelerParkings ? 'border-red-500' : 'border-transparent'
                 }`}
                 value={formData.twoWheelerParkings}
                 onChange={(e) => handleInputChange('twoWheelerParkings', e.target.value)}
                 onBlur={(e) => handleBlur('twoWheelerParkings', e.target.value)}
               />
               {touched.twoWheelerParkings && errors.twoWheelerParkings && (
                  <p className="text-red-500 text-xs mt-1">{errors.twoWheelerParkings}</p>
               )}
            </div>
         </div>
      </div>

      <div className="mb-6">
          <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Infrastructure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Furnishing Status *</label>
               <CustomDropdown
                  placeholder="Select Status"
                  value={formData.furnishingStatus}
                  options={furnishingOptions}
                  onChange={(v) => {
                    handleInputChange('furnishingStatus', v);
                    handleBlur('furnishingStatus', v);
                  }}
                  onBlur={() => handleBlur('furnishingStatus')}
                  error={touched.furnishingStatus && !!errors.furnishingStatus}
                />
                {touched.furnishingStatus && errors.furnishingStatus && (
                  <p className="text-red-500 text-xs mt-1">{errors.furnishingStatus}</p>
                )}
             </div>
             
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-2">Number of Lifts</label>
                <input
                 type="number"
                 placeholder="0"
                 className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                 value={formData.numLifts}
                 onChange={(e) => handleInputChange('numLifts', e.target.value)}
               />
             </div>
          </div>
      </div>

      <div className="mb-6">
          <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">Building Amenities & Infrastructure</h3>
          
          <div className="mb-4">
             <label className="block text-sm font-bold text-gray-700 mb-2">Amenities</label>
             <CustomMultiSelect
                placeholder="Select Amenities"
                value={formData.amenityIds}
                options={amenityOptions}
                onChange={(v) => handleInputChange('amenityIds', v)}
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Power Backup</label>
                 <CustomDropdown
                   placeholder="Select Power Backup"
                   value={formData.powerBackup}
                   options={powerBackupOptions}
                   onChange={(v) => {
                     handleInputChange('powerBackup', v);
                     handleBlur('powerBackup', v);
                   }}
                   onBlur={() => handleBlur('powerBackup')}
                   error={touched.powerBackup && !!errors.powerBackup}
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">HVAC Type</label>
                 <CustomDropdown
                   placeholder="Select HVAC Type"
                   value={formData.hvacType}
                   options={hvacOptions}
                   onChange={(v) => {
                     handleInputChange('hvacType', v);
                     handleBlur('hvacType', v);
                   }}
                   onBlur={() => handleBlur('hvacType')}
                   error={touched.hvacType && !!errors.hvacType}
                 />
              </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Building Maintained By</label>
                 <CustomDropdown
                   placeholder="Select Building Maintenance"
                   value={formData.buildingMaintained}
                   options={caretakerOptions}
                   onChange={(v) => {
                     handleInputChange('buildingMaintained', v);
                     handleBlur('buildingMaintained', v);
                   }}
                   onBlur={() => handleBlur('buildingMaintained')}
                   error={touched.buildingMaintained && !!errors.buildingMaintained}
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Last Refurbished</label>
                 <CustomDropdown
                   placeholder="Select Year"
                   value={formData.lastRefurbished}
                   options={yearOptions}
                   onChange={(v) => {
                     handleInputChange('lastRefurbished', v);
                     handleBlur('lastRefurbished', v);
                   }}
                   onBlur={() => handleBlur('lastRefurbished')}
                   error={touched.lastRefurbished && !!errors.lastRefurbished}
                 />
              </div>
          </div>
          
          <div className="mb-6">
             <label className="block text-sm font-bold text-gray-700 mb-2">Property Description</label>
             <textarea
               className="w-full bg-gray-100 border border-transparent rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] h-32"
               placeholder="Describe your property..."
               value={formData.propertyDescription}
               onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
             />
          </div>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => document.getElementById('fileInput').click()}
          >
             <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
             />
             <div className="mb-2">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={mediaFiles.length > 0 ? '#EE2529' : '#999'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
               </svg>
             </div>
             <p className="text-sm font-semibold text-gray-600">
               {mediaFiles.length > 0 
                 ? `${mediaFiles.length} file(s) selected` 
                 : 'Upload Photos / Videos'}
             </p>
             <p className="text-xs text-gray-400 mt-1">Max 10MB each</p>
             
             {/* Preview thumbnails could actally take up a lot of space, showing count is safer for now */}
          </div>
      </div>
    </div>
  );
});

export default BasicDetails;

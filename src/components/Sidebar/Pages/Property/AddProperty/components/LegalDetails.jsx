import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import CustomDropdown from './CustomDropdown';

const LegalDetails = forwardRef(({ onNext, onFormValid, initialData }, ref) => {
  useImperativeHandle(ref, () => ({
    submit: () => {
      onNext(formData);
    },
  }));

  const titleStatusOptions = [
    { label: 'No Litigation', value: 'No Litigation' },
    { label: 'Pending Litigation', value: 'Pending Litigation' },
  ];

  const occupancyCertificateOptions = [
    { label: 'Yes, available', value: 'Yes, available' },
    { label: 'In Process', value: 'In Process' },
    { label: 'Not available', value: 'Not available' },
  ];

  const leaseRegistrationOptions = [
    { label: 'Registered Lease', value: 'Registered Lease' },
    { label: 'Notorized Lease', value: 'Notorized Lease' },
    { label: 'No lease document', value: 'No lease document' },
  ];

  const [formData, setFormData] = useState({
    titleStatus: initialData?.titleStatus || '',
    occupancyCertificate: initialData?.occupancyCertificate || '',
    leaseRegistration: initialData?.leaseRegistration || '',
    pendingLitigations: initialData?.pendingLitigations || 'no',
    litigationNote: initialData?.litigationNote || '',
    certifications: initialData?.certifications || {
      rera: false,
      leed: false,
      igbc: false,
    },
    otherCertifications: initialData?.otherCertifications || [''],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const isValid = validateFormSilently();
    onFormValid(isValid);
  }, [formData]);

  const validateFormSilently = () => {
    return (
      formData.titleStatus !== '' &&
      formData.occupancyCertificate !== '' &&
      formData.leaseRegistration !== '' &&
      formData.pendingLitigations !== '' &&
      (formData.pendingLitigations !== 'yes' ||
        formData.litigationNote.trim() !== '')
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'titleStatus':
        return !value ? 'Title Status is required' : '';
      case 'occupancyCertificate':
        return !value ? 'Occupancy Certificate is required' : '';
      case 'leaseRegistration':
        return !value ? 'Lease Registration is required' : '';
      case 'pendingLitigations':
        return !value ? 'Please select Yes or No' : '';
      case 'litigationNote':
        if (formData.pendingLitigations === 'yes' && !value.trim()) {
          return 'Please provide litigation details';
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const valueToValidate =
      value !== undefined ? value : formData[name];
    const error = validateField(name, valueToValidate);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const toggleCertification = (cert) => {
    setFormData((prev) => ({
      ...prev,
      certifications: {
        ...prev.certifications,
        [cert]: !prev.certifications[cert],
      },
    }));
  };

  const handleOtherCertChange = (index, value) => {
    const newCerts = [...formData.otherCertifications];
    newCerts[index] = value;
    setFormData((prev) => ({ ...prev, otherCertifications: newCerts }));
  };

  const addOtherCert = () => {
    if (
      formData.otherCertifications[
        formData.otherCertifications.length - 1
      ].trim()
    ) {
      setFormData((prev) => ({
        ...prev,
        otherCertifications: [...prev.otherCertifications, ''],
      }));
    }
  };

  const removeOtherCert = (index) => {
    const newCerts = formData.otherCertifications.filter(
      (_, i) => i !== index,
    );
    setFormData((prev) => ({
      ...prev,
      otherCertifications: newCerts.length ? newCerts : [''],
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#EE2529] text-center mb-6">
        Legal & Title Details
      </h2>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">
          Title & Ownership Status
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Title Status *</label>
          <CustomDropdown
            placeholder="Select Status"
            value={formData.titleStatus}
            options={titleStatusOptions}
            onChange={(v) => {
              handleInputChange('titleStatus', v);
              handleBlur('titleStatus', v);
            }}
            onBlur={() => handleBlur('titleStatus')}
            error={touched.titleStatus && !!errors.titleStatus}
          />
          {touched.titleStatus && errors.titleStatus && (
            <p className="text-red-500 text-xs mt-1">{errors.titleStatus}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Occupancy Certificate (OC) *</label>
            <CustomDropdown
              placeholder="Select Status"
              value={formData.occupancyCertificate}
              options={occupancyCertificateOptions}
              onChange={(v) => {
                handleInputChange('occupancyCertificate', v);
                handleBlur('occupancyCertificate', v);
              }}
              onBlur={() => handleBlur('occupancyCertificate')}
              error={touched.occupancyCertificate && !!errors.occupancyCertificate}
            />
            {touched.occupancyCertificate && errors.occupancyCertificate && (
              <p className="text-red-500 text-xs mt-1">{errors.occupancyCertificate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Lease Registration *</label>
            <CustomDropdown
              placeholder="Select Status"
              value={formData.leaseRegistration}
              options={leaseRegistrationOptions}
              onChange={(v) => {
                handleInputChange('leaseRegistration', v);
                handleBlur('leaseRegistration', v);
              }}
              onBlur={() => handleBlur('leaseRegistration')}
              error={touched.leaseRegistration && !!errors.leaseRegistration}
            />
            {touched.leaseRegistration && errors.leaseRegistration && (
              <p className="text-red-500 text-xs mt-1">{errors.leaseRegistration}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Any Pending Litigations *</label>
          <div className="flex gap-6 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pendingLitigations"
                className="w-5 h-5 text-[#EE2529] focus:ring-[#EE2529]"
                checked={formData.pendingLitigations === 'yes'}
                onChange={() => {
                  handleInputChange('pendingLitigations', 'yes');
                  handleBlur('pendingLitigations');
                }}
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pendingLitigations"
                className="w-5 h-5 text-[#EE2529] focus:ring-[#EE2529]"
                checked={formData.pendingLitigations === 'no'}
                onChange={() => {
                  handleInputChange('pendingLitigations', 'no');
                  handleBlur('pendingLitigations');
                }}
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
          {touched.pendingLitigations && errors.pendingLitigations && (
            <p className="text-red-500 text-xs mt-1">{errors.pendingLitigations}</p>
          )}
        </div>

        {formData.pendingLitigations === 'yes' && (
          <div className="mb-4">
            <textarea
              className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] h-24 ${
                touched.litigationNote && errors.litigationNote ? 'border-red-500' : 'border-transparent'
              }`}
              placeholder="Enter Brief note on Litigation"
              value={formData.litigationNote}
              onChange={(e) => handleInputChange('litigationNote', e.target.value)}
              onBlur={(e) => handleBlur('litigationNote', e.target.value)}
            />
            {touched.litigationNote && errors.litigationNote && (
              <p className="text-red-500 text-xs mt-1">{errors.litigationNote}</p>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold text-[#EE2529] mb-4 border-b pb-2">
          Licenses & Certifications
        </h3>

        <div className="flex flex-wrap gap-4 mb-4">
          {['rera', 'leed', 'igbc'].map((cert) => (
            <label key={cert} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#EE2529] rounded focus:ring-[#EE2529]"
                checked={formData.certifications[cert]}
                onChange={() => toggleCertification(cert)}
              />
              <span className="text-sm text-gray-700 uppercase">{cert}</span>
            </label>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Add Others (if Any)</label>
          {formData.otherCertifications.map((cert, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 bg-gray-100 border border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                placeholder="Enter certification"
                value={cert}
                onChange={(e) => handleOtherCertChange(index, e.target.value)}
              />
              {index === formData.otherCertifications.length - 1 ? (
                <button
                  type="button"
                  onClick={addOtherCert}
                  className="bg-[#EE2529] text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-700 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removeOtherCert(index)}
                  className="bg-gray-200 text-gray-600 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default LegalDetails;

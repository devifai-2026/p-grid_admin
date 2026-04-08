import React, {
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';
import { useAuth } from '../../../../../../context/AuthContext';

const PersonalDetails = forwardRef(({ onNext, onFormValid, initialData }, ref) => {
  const { user } = useAuth();
  const nameParts = user?.name ? user.name.split(' ') : [];
  const userFirstName = nameParts.length > 0 ? nameParts[0] : '';
  const userLastName =
    nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const userRoleLower = user?.role?.toLowerCase();

  const [formData, setFormData] = useState({
    firstName: userFirstName || initialData?.firstName || '',
    lastName: userLastName || initialData?.lastName || '',
    email: user?.email || initialData?.email || '',
    mobile: user?.mobileNumber || initialData?.mobile || '',
    listUnder:
      (userRoleLower === 'broker' || userRoleLower === 'owner'
        ? userRoleLower
        : '') ||
      initialData?.listUnder ||
      '',
    otp: initialData?.otp || '',
    agreeTerms: initialData?.agreeTerms || false,
    agreePrivacy: initialData?.agreePrivacy || false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  // Refs for OTP inputs
  const otpInputRefs = useRef([]);

  useEffect(() => {
    const isValid = !!validateFormSilently();
    onFormValid(isValid);
  }, [formData, otpSent]);

  const validateFormSilently = () => {
    const mobileNumber = formData.mobile.replace(/\D/g, '');

    return (
      formData.firstName.trim() !== '' &&
      /^[A-Za-z\s]{2,50}$/.test(formData.firstName.trim()) &&
      formData.lastName.trim() !== '' &&
      /^[A-Za-z\s]{2,50}$/.test(formData.lastName.trim()) &&
      (!formData.email ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) &&
      mobileNumber.length === 10 &&
      /^[6-9]\d{9}$/.test(mobileNumber) &&
      formData.listUnder !== '' &&
      (!otpSent || (formData.otp && /^\d{4}$/.test(formData.otp))) &&
      formData.agreeTerms &&
      formData.agreePrivacy
    );
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First Name is required';
        if (!/^[A-Za-z\s]{2,50}$/.test(value.trim()))
          return 'First Name must be 2-50 letters only';
        return '';

      case 'lastName':
        if (!value.trim()) return 'Last Name is required';
        if (!/^[A-Za-z\s]{2,50}$/.test(value.trim()))
          return 'Last Name must be 2-50 letters only';
        return '';

      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Please enter a valid email address';
        return '';

      case 'mobile':
        const mobileNumber = value.replace(/\D/g, '');
        if (!mobileNumber) return 'Mobile number is required';
        if (mobileNumber.length !== 10)
          return 'Mobile number must be 10 digits';
        if (!/^[6-9]\d{9}$/.test(mobileNumber))
          return 'Please enter a valid Indian mobile number';
        return '';

      case 'listUnder':
        if (!value) return 'Please select Broker or Owner';
        return '';

      case 'otp':
        if (otpSent) {
          if (!value) return 'OTP is required';
          if (!/^\d{4}$/.test(value)) return 'OTP must be 4 digits';
        }
        return '';

      case 'agreeTerms':
        if (!value) return 'Please agree to terms & conditions';
        return '';

      case 'agreePrivacy':
        if (!value) return 'Please agree to Privacy Policy';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }

    if (touched[name] || isSubmitted) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleMobileChange = (e) => {
    const text = e.target.value;
    let value = text.replace(/\D/g, '');
    // Simple formatting if needed, but keeping it simple for now
    // if (value.length > 5) {
    //   value = `${value.slice(0, 5)}-${value.slice(5, 10)}`;
    // }
    handleChange('mobile', value);
  };

  const handleBlur = (name, value) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const valueToValidate =
      value !== undefined ? value : formData[name];
    const error = validateField(name, valueToValidate);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSendOtp = () => {
    const mobileNumber = formData.mobile.replace(/\D/g, '');
    const mobileError = validateField('mobile', formData.mobile);

    if (!mobileError && mobileNumber.length === 10) {
      setOtpSent(true);
      // Auto-focus first OTP input after a short delay
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } else {
      setErrors((prev) => ({
        ...prev,
        mobile:
          mobileError || 'Please enter a valid mobile number to send OTP',
      }));
    }
  };

  const handleOtpChange = (e, index) => {
    const text = e.target.value;
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');

    const currentOtpArray = formData.otp.split('').concat(Array(4).fill('')).slice(0, 4);
    currentOtpArray[index] = digit;
    const newOtp = currentOtpArray.join('');
    
    handleChange('otp', newOtp);

    // Auto-focus next input if digit entered
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Handle backspace on empty field - move to previous input
    if (
      e.key === 'Backspace' &&
      !formData.otp[index] &&
      index > 0
    ) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const allTouched = {};
    Object.keys(formData).forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (validateFormSilently()) {
      onNext(formData);
    }
  };

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const mobileNumberRaw = formData.mobile.replace(/\D/g, '');

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-[#EE2529] text-center mb-6">
        Personal Details
      </h2>

      <div className="flex flex-col md:flex-row gap-4 mb-5">
        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">First Name *</label>
          <input
            type="text"
            className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
              touched.firstName && errors.firstName ? 'border-red-500' : 'border-transparent'
            }`}
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Enter Your First Name"
            onBlur={(e) => handleBlur('firstName', e.target.value)}
          />
          {touched.firstName && errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div className="flex-1">
          <label className="block text-sm font-bold text-gray-700 mb-2">Last Name *</label>
          <input
            type="text"
            className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
              touched.lastName && errors.lastName ? 'border-red-500' : 'border-transparent'
            }`}
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Enter Your Last Name"
            onBlur={(e) => handleBlur('lastName', e.target.value)}
          />
          {touched.lastName && errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
        <input
          type="email"
          className={`w-full bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
            touched.email && errors.email ? 'border-red-500' : 'border-transparent'
          }`}
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="Enter Email Address"
          onBlur={(e) => handleBlur('email', e.target.value)}
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">List Property Under *</label>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="listUnder"
              className="w-5 h-5 text-[#EE2529] focus:ring-[#EE2529]"
              checked={formData.listUnder === 'broker'}
              onChange={() => handleChange('listUnder', 'broker')}
            />
            <span className="text-sm text-gray-700">Broker</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="listUnder"
              className="w-5 h-5 text-[#EE2529] focus:ring-[#EE2529]"
              checked={formData.listUnder === 'owner'}
              onChange={() => handleChange('listUnder', 'owner')}
            />
            <span className="text-sm text-gray-700">Owner</span>
          </label>
        </div>
        {touched.listUnder && errors.listUnder && (
          <p className="text-red-500 text-xs mt-1">{errors.listUnder}</p>
        )}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="tel"
            className={`flex-1 bg-gray-100 border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
              touched.mobile && errors.mobile ? 'border-red-500' : 'border-transparent'
            }`}
            value={formData.mobile}
            onChange={handleMobileChange}
            placeholder="9876543210"
            maxLength={10}
            onBlur={(e) => handleBlur('mobile', e.target.value)}
          />
          <button
            type="button"
            className={`px-4 py-3 rounded-lg text-white font-semibold text-sm transition-colors ${
              mobileNumberRaw.length !== 10 || otpSent
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#EE2529] hover:bg-red-700'
            }`}
            onClick={handleSendOtp}
            disabled={mobileNumberRaw.length !== 10 || otpSent}
          >
            {otpSent ? 'Resend OTP' : 'Send OTP'}
          </button>
        </div>
        {touched.mobile && errors.mobile && (
          <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
        )}
      </div>

      {otpSent && (
        <div className="mb-5">
          <label className="block text-sm font-bold text-gray-700 mb-2">OTP *</label>
          <div className="flex gap-3 justify-center md:justify-start">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (otpInputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                className={`w-12 h-12 text-center text-lg font-bold border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#EE2529] ${
                   touched.otp && errors.otp ? 'border-red-500' : 'border-gray-300'
                }`}
                value={formData.otp[index] || ''}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                autoComplete="one-time-code"
              />
            ))}
          </div>
          {touched.otp && errors.otp && (
            <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-[#EE2529] rounded focus:ring-[#EE2529]"
            checked={formData.agreeTerms}
            onChange={() => handleChange('agreeTerms', !formData.agreeTerms)}
          />
          <span className="text-sm text-gray-700">
            I agree to the{' '}
            <span className="text-blue-500 underline">terms & conditions</span>
          </span>
        </label>
        {isSubmitted && !formData.agreeTerms && (
          <p className="text-red-500 text-xs ml-6">Please agree to terms & conditions</p>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 text-[#EE2529] rounded focus:ring-[#EE2529]"
            checked={formData.agreePrivacy}
            onChange={() => handleChange('agreePrivacy', !formData.agreePrivacy)}
          />
          <span className="text-sm text-gray-700">
            I agree to the <span className="text-blue-500 underline">Privacy Policy</span>
          </span>
        </label>
        {isSubmitted && !formData.agreePrivacy && (
          <p className="text-red-500 text-xs ml-6">Please agree to Privacy Policy</p>
        )}
      </div>
    </div>
  );
});

export default PersonalDetails;

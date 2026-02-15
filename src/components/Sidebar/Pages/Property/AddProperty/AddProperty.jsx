import React, { useState } from 'react';
import { 
  FiUploadCloud, 
  FiMapPin, 
  FiHome, 
  FiDollarSign,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown
} from 'react-icons/fi';
import { 
  MdBed, 
  MdBathtub, 
  MdStraighten, 
  MdApartment,
  MdOutlineCategory,
  MdOutlineSell,
  MdOutlineLocationCity,
  MdOutlineLocationOn,
  MdOutlineAttachMoney,
  MdOutlineAddPhotoAlternate
} from 'react-icons/md';
import { 
  FaHome,
  FaBuilding,
  FaCity,
  FaGlobeAmericas,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { 
  IoHomeOutline,
  IoBusinessOutline,
  IoLocationOutline,
  IoBedOutline,
  IoWaterOutline,
  IoResizeOutline,
  IoBusinessSharp
} from 'react-icons/io5';
import { 
  BsHouse,
  BsBuilding,
  BsGeoAlt,
  BsCurrencyDollar
} from 'react-icons/bs';
import { 
  HiOutlineHome,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker
} from 'react-icons/hi';
import { 
  TbBuilding,
  TbHome,
  TbCurrencyDollar
} from 'react-icons/tb';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Villas',
    propertyFor: 'Sale',
    bedrooms: '',
    bathrooms: '',
    squareFoot: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    floor: ''
  });

  const [errors, setErrors] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Property name is required';
        else if (value.length < 3) error = 'Name must be at least 3 characters';
        break;
      case 'price':
        if (!value) error = 'Price is required';
        else if (parseFloat(value) < 0) error = 'Price cannot be negative';
        else if (parseFloat(value) === 0) error = 'Price must be greater than 0';
        break;
      case 'bedrooms':
      case 'bathrooms':
      case 'floor':
        if (value && parseInt(value) < 0) error = 'Cannot be negative';
        break;
      case 'squareFoot':
        if (value && parseFloat(value) < 0) error = 'Cannot be negative';
        else if (value && parseFloat(value) === 0) error = 'Must be greater than 0';
        break;
      case 'zipCode':
        if (value && !/^\d+$/.test(value)) error = 'Only numbers allowed';
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        break;
      case 'city':
      case 'country':
        if (!value) error = 'This field is required';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Prevent negative values for number inputs
    if (['price', 'bedrooms', 'bathrooms', 'squareFoot', 'floor'].includes(name)) {
      if (value && parseFloat(value) < 0) {
        processedValue = '';
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Validate on change
    const error = validateField(name, processedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Only JPEG, PNG, and GIF files are allowed'
        }));
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'File size must be less than 5MB'
        }));
        return;
      }
      
      setErrors(prev => ({ ...prev, image: '' }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[name="${firstError}"]`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    console.log('Form submitted:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Property added successfully!');
      // Reset form
      setFormData({
        name: '',
        price: '',
        category: 'Villas',
        propertyFor: 'Sale',
        bedrooms: '',
        bathrooms: '',
        squareFoot: '',
        address: '',
        zipCode: '',
        city: '',
        country: '',
        floor: ''
      });
      setUploadedImage(null);
      setErrors({});
    }, 1500);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setFormData({
        name: '',
        price: '',
        category: 'Villas',
        propertyFor: 'Sale',
        bedrooms: '',
        bathrooms: '',
        squareFoot: '',
        address: '',
        zipCode: '',
        city: '',
        country: '',
        floor: ''
      });
      setUploadedImage(null);
      setErrors({});
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-2">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Property Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiHome className="w-5 h-5 text-[#EE2529]" />
              Property Preview
            </h3>
            
            {/* Property Preview Image */}
            <div className="rounded-lg overflow-hidden mb-4 h-40 bg-gray-200 relative">
              {uploadedImage ? (
                <img src={uploadedImage} alt="Property" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <MdOutlineAddPhotoAlternate className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {formData.propertyFor && (
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-bold ${
                    formData.propertyFor === 'Sale' ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {formData.propertyFor === 'Sale' ? (
                      <MdOutlineSell className="w-3 h-3" />
                    ) : (
                      <TbCurrencyDollar className="w-3 h-3" />
                    )}
                    {formData.propertyFor === 'Sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">
                  {formData.name || 'Dvilla Residences'}
                </h3>
                <p className="text-gray-500 text-xs flex items-center gap-1">
                  <MdOutlineCategory className="w-3 h-3" />
                  {formData.category || 'Residences'}
                </p>
              </div>

              <p className="text-gray-500 text-xs flex items-start gap-1">
                <FaMapMarkerAlt className="w-3 h-3 mt-0.5 flex-shrink-0" />
                {formData.address || '4604 , Philli Lane Kiowa U.S.A'}
              </p>

              <div>
                <p className="text-gray-600 text-xs font-medium mb-1 flex items-center gap-1">
                  <MdOutlineAttachMoney className="w-4 h-4" />
                  Price :
                </p>
                <p className="text-xl font-bold text-gray-800">
                  ${formData.price ? parseFloat(formData.price).toLocaleString() : '8,930.00'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-gray-600 pt-2">
                <span className="flex items-center gap-1">
                  <IoBedOutline className="w-3 h-3" />
                  {formData.bedrooms || '5'} Bed
                </span>
                <span className="flex items-center gap-1">
                  <IoWaterOutline className="w-3 h-3" />
                  {formData.bathrooms || '4'} Bat
                </span>
                <span className="flex items-center gap-1">
                  <IoResizeOutline className="w-3 h-3" />
                  {formData.squareFoot || '1400'} sqft
                </span>
                <span className="flex items-center gap-1">
                  <IoBusinessSharp className="w-3 h-3" />
                  {formData.floor || '3'} Floor
                </span>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 px-3 py-2 border border-[#EE2529] text-[#EE2529] rounded-lg text-sm font-medium hover:bg-red-50 transition flex items-center justify-center gap-2 text-nowrap ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#EE2529]"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                     
                      Add Property
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCancel}
                  className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form - Right Side */}
        <div className="lg:col-span-3 space-y-6">
          {/* Add Property Photo Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiUploadCloud className="w-5 h-5 text-[#EE2529]" />
              Add Property Photo
            </h2>

            {errors.image && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm flex items-center gap-2">
                  <FiXCircle className="w-4 h-4" />
                  {errors.image}
                </p>
              </div>
            )}

            {/* Drag & Drop Area */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer ${
                errors.image 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-[#EE2529] hover:bg-red-50'
              }`}
              onClick={() => document.getElementById('imageInput').click()}
            >
              <div className="flex flex-col items-center gap-3">
                <FiUploadCloud className="w-12 h-12 text-[#EE2529]" />
                <p className="text-gray-600 font-medium">Drop your images here, or click to browse</p>
                <p className="text-gray-500 text-sm">(1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed)</p>
              </div>
              <input
                id="imageInput"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/jpg"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Property Information Form */}
          <div className="bg-white rounded-2xl shadow-sm p-2 md:p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-8 flex items-center gap-2">
              <IoHomeOutline className="w-5 h-5 text-[#EE2529]" />
              Property Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Property Name & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                    
                    Property Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter property name"
                    className={`w-full px-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-[#EE2529]'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                   
                    Property Categories
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#EE2529] appearance-none"
                    >
                      <option value="Villas">Villas</option>
                      <option value="Apartments">Apartments</option>
                      <option value="Houses">Houses</option>
                      <option value="Condos">Condos</option>
                      <option value="Townhouses">Townhouses</option>
                      <option value="Duplexes">Duplexes</option>
                    </select>
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <MdOutlineCategory className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-3.5 text-gray-600 pointer-events-none">
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Property For */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                    
                    Price
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <BsCurrencyDollar className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                        errors.price 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                    
                    Property For
                  </label>
                  <div className="relative">
                    <select
                      name="propertyFor"
                      value={formData.propertyFor}
                      onChange={handleChange}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#EE2529] appearance-none"
                    >
                      <option value="Sale">Sale</option>
                      <option value="Rent">Rent</option>
                    </select>
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <MdOutlineSell className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-3.5 text-gray-600 pointer-events-none">
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                    
                    Bedroom
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <MdBed className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter number"
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                        errors.bedrooms 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    />
                  </div>
                  {errors.bedrooms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.bedrooms}
                    </p>
                  )}
                </div>
              </div>

              {/* Bathroom & Square Foot & Floor */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                    
                    Bathroom
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <MdBathtub className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter number"
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                        errors.bathrooms 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    />
                  </div>
                  {errors.bathrooms && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.bathrooms}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-3 flex items-center gap-2">
                   
                    Square Foot
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <MdStraighten className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="squareFoot"
                      value={formData.squareFoot}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter area"
                      min="0"
                      step="0.01"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                        errors.squareFoot 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    />
                  </div>
                  {errors.squareFoot && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.squareFoot}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                   
                    Floor
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <MdApartment className="w-5 h-5" />
                    </div>
                    <input
                      type="number"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter floor"
                      min="0"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                        errors.floor 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    />
                  </div>
                  {errors.floor && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.floor}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Address */}
              <div>
                <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                 
                  Property Address
                </label>
                <div className="relative">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter complete address"
                    rows="3"
                    className={`w-full pl-3 pr-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 resize-none ${
                      errors.address 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:ring-[#EE2529]'
                    }`}
                  />
                  <div className="absolute left-4 top-3 text-gray-600">
                 
                  </div>
                </div>
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <FiXCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Zip Code & City & Country */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-3 flex items-center gap-2">
                   
                    Zip-Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter zip code"
                      pattern="\d*"
                      className={`w-full px-4 py-3 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 ${
                        errors.zipCode 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    />
                    <div className="absolute right-4 top-3.5 text-gray-600">
                      <BsGeoAlt className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.zipCode && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                   
                    City
                  </label>
                  <div className="relative">
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 appearance-none ${
                        errors.city 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    >
                      <option value="">Select city</option>
                      <option value="New York">New York</option>
                      <option value="Los Angeles">Los Angeles</option>
                      <option value="Chicago">Chicago</option>
                      <option value="Miami">Miami</option>
                      <option value="Houston">Houston</option>
                      <option value="Phoenix">Phoenix</option>
                    </select>
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <FaCity className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-3.5 text-gray-600 pointer-events-none">
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm  text-gray-700 mb-3 flex items-center gap-2">
                   
                    Country
                  </label>
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 pl-12 border rounded-lg text-gray-600 focus:outline-none focus:ring-2 appearance-none ${
                        errors.country 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-[#EE2529]'
                      }`}
                    >
                      <option value="">Select country</option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </select>
                    <div className="absolute left-4 top-3.5 text-gray-600">
                      <FaGlobeAmericas className="w-5 h-5" />
                    </div>
                    <div className="absolute right-4 top-3.5 text-gray-600 pointer-events-none">
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                  {errors.country && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <FiXCircle className="w-3 h-3" />
                      {errors.country}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 border-2 border-[#EE2529] text-[#EE2529] rounded-lg font-semibold hover:bg-red-50 transition flex items-center gap-2 text-nowrap ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#EE2529]"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      Create Property
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
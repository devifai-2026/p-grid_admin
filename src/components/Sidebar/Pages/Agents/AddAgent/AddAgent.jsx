import React, { useState, useRef } from 'react';
import { 
  FaUpload, 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
  FaUser,
  FaHome,
  FaMapMarkerAlt,
  FaGlobe
} from 'react-icons/fa';
import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdCancel
} from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsFillHouseFill } from 'react-icons/bs';

const AddAgent = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    agentNumber: '',
    propertiesNumber: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Handle form submission
  };

  const handleCancel = () => {
    setFormData({
      fullName: '',
      email: '',
      agentNumber: '',
      propertiesNumber: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: ''
    });
    setPreviewImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Left Sidebar - Agent Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-6">
              {/* Profile Section */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-indigo-100 bg-slate-100 flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-4xl text-slate-400" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {formData.fullName || 'Michael A. Miner'}
                </h3>
                <p className="text-xs text-slate-500 mb-1">
                  {formData.email || 'michaelminer@dayrep.com'}
                </p>
                <p className="text-xs font-semibold text-indigo-600">#1</p>
              </div>

              {/* Properties Info */}
              <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <BsFillHouseFill className="text-lg text-indigo-600" />
                  <span className="text-sm font-medium">
                    {formData.propertiesNumber || '243'} Properties
                  </span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MdLocationOn className="text-lg text-indigo-600" />
                  <span className="text-xs">
                    {formData.address || 'Lincoln Drive Harrisburg, PA 17101 U.S.A'}
                  </span>
                </div>
              </div>

              {/* Social Media */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-600 mb-3">Social Media :</p>
                <div className="flex justify-center items-center gap-2">
                  <a href="#" className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                    <FaFacebookF size={18} />
                  </a>
                  <a href="#" className="p-2 hover:bg-pink-50 rounded-lg text-pink-600 transition-colors">
                    <FaInstagram size={18} />
                  </a>
                  <a href="#" className="p-2 hover:bg-cyan-50 rounded-lg text-cyan-500 transition-colors">
                    <FaTwitter size={18} />
                  </a>
                  <a href="#" className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors">
                    <FaWhatsapp size={18} />
                  </a>
                  <a href="#" className="p-2 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors">
                    <FaEnvelope size={18} />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="px-3 py-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition-colors text-sm text-nowrap">
                  Add Agent
                </button>
                <button onClick={handleCancel} className="px-2 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-semibold text-sm transition-colors text-nowrap">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Right Content - Form */}
          <div className="lg:col-span-4">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Add Agent Photo</h3>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-4 text-indigo-600">
                      <FaUpload size={48} className="mx-auto" />
                    </div>
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      Drop your images here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500">
                      (1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed )
                    </p>
                  </div>
                </div>

                {previewImage && (
                  <div className="mt-6 relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Agent Information Section */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-8">Agent Information</h3>
                
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Agent Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Agent Email
                    </label>
                    <div className="relative">
                      <MdEmail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Agent Number and Properties Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Agent Number
                    </label>
                    <div className="relative">
                      <MdPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="agentNumber"
                        placeholder="Enter Number"
                        value={formData.agentNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Properties Number
                    </label>
                    <div className="relative">
                      <BsFillHouseFill className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="propertiesNumber"
                        placeholder="Enter Properties Number"
                        value={formData.propertiesNumber}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Address */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Agent Address
                  </label>
                  <div className="relative">
                    <MdLocationOn className="absolute left-4 top-4 text-slate-400" />
                    <textarea
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="4"
                      className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                {/* Row 4: Zip Code, City, Country */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Zip-Code
                    </label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Zip-Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      City
                    </label>
                    <div className="relative">
                      <MdLocationOn className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                      >
                        <option value="">Select City</option>
                        <option value="new-york">New York</option>
                        <option value="los-angeles">Los Angeles</option>
                        <option value="chicago">Chicago</option>
                        <option value="houston">Houston</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Country
                    </label>
                    <div className="relative">
                      <FaGlobe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none"
                      >
                        <option value="">Select Country</option>
                        <option value="usa">United States</option>
                        <option value="canada">Canada</option>
                        <option value="uk">United Kingdom</option>
                        <option value="australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 5: Social Media URLs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Facebook URL
                    </label>
                    <div className="relative">
                    
                      <input
                        type="url"
                        name="facebookUrl"
                        placeholder="Enter URL"
                        value={formData.facebookUrl}
                        onChange={handleChange}
                        className="w-full pl-2 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Instagram URL
                    </label>
                    <div className="relative">
                     
                      <input
                        type="url"
                        name="instagramUrl"
                        placeholder="Enter URL"
                        value={formData.instagramUrl}
                        onChange={handleChange}
                        className="w-full pl-2 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Twitter URL
                    </label>
                    <div className="relative">
                     
                      <input
                        type="url"
                        name="twitterUrl"
                        placeholder="Enter URL"
                        value={formData.twitterUrl}
                        onChange={handleChange}
                        className="w-full pl-2 pr-4 py-3 border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pb-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full sm:w-auto justify-center px-8 py-3 bg-red-400 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <MdCancel size={16} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto justify-center px-8 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold transition-colors flex items-center gap-2"
                >
                  <FaUser size={16} />
                  Create Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;
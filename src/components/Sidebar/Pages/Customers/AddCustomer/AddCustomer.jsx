import React, { useState } from 'react';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaCommentAlt, 
  FaEnvelope, 
  FaCheck,
  FaCloudUploadAlt
} from 'react-icons/fa';

const AddCustomer = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerNumber: '',
    viewProperties: '',
    ownProperties: '',
    investProperty: '000',
    customerAddress: '',
    zipCode: '',
    city: '',
    country: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    status: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', { formData, image: selectedImage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-2 md:p-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Left Sidebar - Customer Card Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-8">
              {/* Header Background */}
              <div className="h-32 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 relative">
                <div className="absolute -bottom-16 left-8">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400 text-4xl">👤</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="pt-20 px-6 pb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {formData.customerName || 'David Nummi'}
                </h3>
                <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  Available
                </span>

                <div className="mt-6 space-y-3 text-sm border-t border-slate-200 pt-6">
                  <div>
                    <p className="text-slate-600 font-medium">Email Address:</p>
                    <p className="text-slate-800 text-xs break-all">
                      {formData.customerEmail || 'davidnumminer@teleworm.us'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Contact Number:</p>
                    <p className="text-slate-800 text-xs">
                      {formData.customerNumber || '+231 06-75820711'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Address:</p>
                    <p className="text-slate-800 text-xs">
                      {formData.customerAddress || 'Schoolstraat 161 5151 HH Drunen'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 text-center">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {formData.viewProperties || '231'}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">View Property</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {formData.ownProperties || '27'}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">Own Property</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#EE2529]">
                      {formData.investProperty || '₹142,465'}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">Invest</p>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-600 font-medium mb-3">Social Information:</p>
                  <div className="flex gap-3">
                    <button className="p-2.5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors">
                      <FaFacebook className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-pink-100 hover:bg-pink-200 text-pink-600 rounded-lg transition-colors">
                      <FaInstagram className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-sky-100 hover:bg-sky-200 text-sky-500 rounded-lg transition-colors">
                      <FaTwitter className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors">
                      <FaCommentAlt className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 bg-orange-100 hover:bg-orange-200 text-orange-500 rounded-lg transition-colors">
                      <FaEnvelope className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Add Customer Photo</h3>
                
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    dragActive
                      ? 'border-[#EE2529] bg-red-50'
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                  />
                  
                  <label htmlFor="imageInput" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                        <FaCloudUploadAlt className="w-7 h-7 text-[#EE2529]" />
                      </div>
                      <div>
                        <p className="text-lg text-slate-700 font-semibold mb-1">
                          Drop your images here, or click to browse
                        </p>
                        <p className="text-sm text-slate-500">
                          (1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed.)
                        </p>
                      </div>
                    </div>
                  </label>

                  {imagePreview && (
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <FaCheck className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-8">Customer Information</h3>

                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Full Name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Customer Email
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      placeholder="Enter Email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Customer Number
                    </label>
                    <input
                      type="text"
                      name="customerNumber"
                      placeholder="Enter Number"
                      value={formData.customerNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      View Properties
                    </label>
                    <input
                      type="text"
                      name="viewProperties"
                      placeholder="Enter View Properties"
                      value={formData.viewProperties}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Own Properties
                    </label>
                    <input
                      type="text"
                      name="ownProperties"
                      placeholder="Enter Own Properties"
                      value={formData.ownProperties}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Invest Property
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600 text-lg">$</span>
                      <input
                        type="text"
                        name="investProperty"
                        placeholder="000"
                        value={formData.investProperty}
                        onChange={handleInputChange}
                        className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Customer Address
                  </label>
                  <textarea
                    name="customerAddress"
                    placeholder="Enter address"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400 resize-none"
                  ></textarea>
                </div>

                {/* Row 4 - Location */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Zip-Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Zip-Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Row 5 - Social URLs */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebookUrl"
                      placeholder="Enter URL"
                      value={formData.facebookUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagramUrl"
                      placeholder="Enter URL"
                      value={formData.instagramUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitterUrl"
                      placeholder="Enter URL"
                      value={formData.twitterUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transition-all text-slate-900 bg-white"
                  >
                    <option value="">Select Status</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  className="px-8 py-3 border-2 border-[#EE2529] text-[#EE2529] rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  Create Customer
                </button>
                <button
                  type="button"
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
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

export default AddCustomer;
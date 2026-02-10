import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { 
  FaPhone, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaWhatsapp,
  FaDownload,
  FaShareAlt,
  FaEye,
  FaSearch,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaGlobeAmericas
} from 'react-icons/fa';
import {
  MdLocationOn,
  MdMessage,
  MdSettings,
  MdHome,
  MdBusiness,
  MdPeople,
  MdTrendingUp,
  MdEmail,
  MdFileDownload
} from 'react-icons/md';
import { 
  FiMessageSquare, 
  FiAward, 
  FiFileText, 
  FiMapPin, 
  FiEye,
  FiShare2
} from 'react-icons/fi';
import { AiOutlineMail, AiOutlineMessage } from 'react-icons/ai';
import { HiOutlineLocationMarker, HiOutlineDownload } from 'react-icons/hi';
import { IoMapOutline } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';

const AgentDetails = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Chart data
  const propertyStatusData = [
    { name: 'Total Listing', value: 243, fill: '#10b981' },
    { name: 'Property Sold', value: 136, fill: '#f59e0b' },
    { name: 'Property Rent', value: 105, fill: '#3b82f6' }
  ];

  // World map data for locations
  const worldMapData = [
    { x: 100, y: 80, z: 100, name: 'New York', color: '#3b82f6' },
    { x: 150, y: 100, z: 80, name: 'London', color: '#8b5cf6' },
    { x: 200, y: 120, z: 120, name: 'Harrisburg', color: '#10b981' },
    { x: 250, y: 140, z: 90, name: 'Tokyo', color: '#f59e0b' },
    { x: 300, y: 110, z: 70, name: 'Sydney', color: '#ef4444' },
    { x: 200, y: 200, z: 110, name: 'Dubai', color: '#ec4899' },
    { x: 320, y: 180, z: 60, name: 'Paris', color: '#6366f1' },
  ];

  // Location performance data for bar chart
  const locationPerformanceData = [
    { city: 'Harrisburg', properties: 45, value: 85, fill: '#3b82f6' },
    { city: 'New York', properties: 38, value: 92, fill: '#8b5cf6' },
    { city: 'London', properties: 32, value: 78, fill: '#10b981' },
    { city: 'Tokyo', properties: 28, value: 88, fill: '#f59e0b' },
    { city: 'Dubai', properties: 25, value: 95, fill: '#ec4899' },
  ];

  const reviews = [
    {
      id: 1,
      author: 'Esther Howard',
      handle: '@kasyrrh',
      location: '(U.S.A)',
      text: '"The team at agent went above and beyond to understand my needs and tailor their solutions to fit my business requirements.Not only did they exceed our expectations."',
      rating: 4.5,
      daysAgo: '3 Days Ago',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop'
    },
    {
      id: 2,
      author: 'Elbart Bant',
      handle: '@ryegyhf',
      location: '(Canada)',
      text: '"The agent team exceeded expectations in my needs and customizing their solutions to perfectly align with my business requirements game-changer for our business."',
      rating: 4.5,
      daysAgo: '15 Days Ago',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'
    }
  ];

  // Property photos for slider
  const propertyPhotos = [
    {
      id: 1,
      title: 'PIK Villa House',
      address: '27, Boulevard Cockeysville',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      features: ['4 Bedrooms', '3 Bathrooms', 'Swimming Pool', 'Garden']
    },
    {
      id: 2,
      title: 'Modern Apartment',
      address: '45, Lincoln Drive',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      features: ['2 Bedrooms', '2 Bathrooms', 'City View', 'Balcony']
    },
    {
      id: 3,
      title: 'Luxury Penthouse',
      address: '123, Skyline Avenue',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
      features: ['3 Bedrooms', '3.5 Bathrooms', 'Roof Terrace', 'Panoramic View']
    },
    {
      id: 4,
      title: 'Countryside Villa',
      address: '78, Green Valley Road',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&h=600&fit=crop',
      features: ['5 Bedrooms', '4 Bathrooms', 'Large Garden', 'Private Pool']
    }
  ];

  const properties = [
    {
      id: 1,
      title: 'Weekend Villa MBH',
      location: '980, Jim Rosa Lane Dublin',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c52e8f?w=400&h=300&fit=crop',
      icon: '🏠'
    }
  ];

  const locationData = [
    { location: 'Walker Art Center', address: 'Lincoln Drive Harrisburg, PA 17101 U.S.A', rating: 4.5, reviews: 5809 }
  ];

  const files = [
    { name: 'Property-File.pdf', size: '2.6 MB', icon: '📄', color: 'bg-red-100' },
    { name: 'Client-List.pdf', size: '1.6 MB', icon: '📋', color: 'bg-blue-100' },
    { name: 'Property-Photo.pdf', size: '23.2 MB', icon: '📸', color: 'bg-green-100' },
    { name: 'Area-soft.png', size: '2.3 MB', icon: '🖼️', color: 'bg-orange-100' }
  ];

  // Auto slider functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % propertyPhotos.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % propertyPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + propertyPhotos.length) % propertyPhotos.length);
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-300" />);
    }
    
    return stars;
  };

  // Custom tooltip for world map
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
          <p className="font-bold text-slate-900">{payload[0].payload.name}</p>
          <p className="text-sm text-slate-600">Properties: {payload[0].payload.z}</p>
          <p className="text-xs text-slate-500">Market Value: High</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-600 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop"
          alt="Property"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Agent Header Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left: Agent Info */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 -mt-20 md:-mt-32 relative z-10">
            <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left w-full">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
                  alt="Michael A. Miner"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-indigo-100"
                />
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Michael A. Miner</h1>
                  <p className="text-slate-500 mb-4">michaelminer@dayrep.com</p>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                    <button className="flex-1 md:flex-none justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
                      <AiOutlineMessage size={16} />
                      Message
                    </button>
                    <button className="flex-1 md:flex-none justify-center px-6 py-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2">
                      <MdPeople size={16} />
                      Work With Michael
                    </button>
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 md:static p-3 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-full transition-colors">
                <MdSettings size={24} />
              </button>
            </div>

            {/* Agent Details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-700">
                <MdLocationOn size={20} className="text-indigo-600 flex-shrink-0" />
                <span>Lincoln Drive Harrisburg, PA 17101 U.S.A</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <FaPhone size={20} className="text-indigo-600 flex-shrink-0" />
                <span>+123 864-357-7713</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900">Social Media :</span>
                <div className="flex gap-3">
                  <a href="#" className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                    <FaFacebookF size={20} />
                  </a>
                  <a href="#" className="p-2 hover:bg-pink-50 rounded-lg text-pink-600 transition-colors">
                    <FaInstagram size={20} />
                  </a>
                  <a href="#" className="p-2 hover:bg-blue-50 rounded-lg text-blue-400 transition-colors">
                    <FaTwitter size={20} />
                  </a>
                  <a href="#" className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors">
                    <FaWhatsapp size={20} />
                  </a>
                  <a href="#" className="p-2 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors">
                    <AiOutlineMail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Achievement Card - Updated to match image */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 shadow-sm border border-slate-200 relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-slate-900 font-bold text-lg">Michael A. Miner</h3>
                <p className="text-sm text-slate-600">#1 Medal</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                #1
              </div>
            </div>

            {/* Achievement Stats */}
            <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl p-4 mb-4 border border-yellow-200">
              <div className="flex items-center justify-center mb-2">
                <div className="text-center">
                  <p className="text-yellow-600 font-bold text-3xl">19,343</p>
                  <p className="text-sm text-slate-600">Collected In This Month</p>
                </div>
              </div>
            </div>

            {/* Property Photos Slider */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">Property Photos</h4>
                <div className="flex gap-2">
                  <button 
                    onClick={prevSlide}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaChevronLeft size={14} className="text-slate-600" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaChevronRight size={14} className="text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Property Photo Slider */}
              <div className="relative overflow-hidden rounded-xl bg-slate-100 h-48">
                {propertyPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                      index === currentSlide ? 'translate-x-0' : index < currentSlide ? '-translate-x-full' : 'translate-x-full'
                    }`}
                  >
                    <div className="relative h-full">
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h4 className="font-bold text-lg">{photo.title}</h4>
                        <p className="text-sm opacity-90">{photo.address}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {photo.features.map((feature, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {propertyPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? 'bg-white w-4' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Current Slide Counter */}
              <div className="text-center mt-3 text-sm text-slate-600">
                {currentSlide + 1} / {propertyPhotos.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Tabs */}
          <div className="border-b border-slate-200 flex">
            <button
              onClick={() => setActiveTab('about')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-4 font-semibold transition-colors text-center ${
                activeTab === 'about'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About Michael
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex-1 md:flex-none px-4 md:px-8 py-4 font-semibold transition-colors text-center ${
                activeTab === 'properties'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Properties
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'about' && (
              <>
                {/* About Text */}
                <div className="mb-12">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About Michael :</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Meet Michael, a dedicated and experienced real estate agent who is committed to making your real estate journey smooth and successful. With a passion for helping clients achieve their dreams, Michael brings a wealth of knowledge and expertise to every transaction.
                  </p>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Michael has been a prominent figure in the real estate industry for over a decade. His career began with a focus on residential properties, quickly expanding to include commercial real estate and investment properties. Michael's extensive experience and deep market knowledge have helped him to navigate even the most complex transactions with ease.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Meet Michael, a dedicated and experienced real estate agent who is committed to making your real estate journey smooth and successful. With a passion for helping clients achieve their dreams, Michael brings a wealth of knowledge and expertise to every transaction.
                  </p>
                </div>

                {/* Agency Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-4">Agency :</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Agent License</span>
                        <span className="font-semibold text-slate-900">: LC-5758-2048-3944</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Test Number</span>
                        <span className="font-semibold text-slate-900">: TC-9275-PC-55685</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">Services Area</span>
                        <span className="font-semibold text-slate-900">: Lincoln Drive Harrisburg</span>
                      </div>
                    </div>
                    <a href="#" className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm inline-block mt-4">
                      View More →
                    </a>
                  </div>

                  {/* Property Status Charts */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-6">Property Status :</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* Total Listing */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[propertyStatusData[0]]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" startAngle={90} endAngle={-270}>
                                <Cell fill={propertyStatusData[0].fill} />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">243</p>
                        <p className="text-xs text-slate-600">Total Listing</p>
                      </div>

                      {/* Property Sold */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[propertyStatusData[1]]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" startAngle={90} endAngle={-270}>
                                <Cell fill={propertyStatusData[1].fill} />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">136</p>
                        <p className="text-xs text-slate-600">Property Sold</p>
                      </div>

                      {/* Property Rent */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 mb-3">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[propertyStatusData[2]]} cx="50%" cy="50%" innerRadius={30} outerRadius={50} dataKey="value" startAngle={90} endAngle={-270}>
                                <Cell fill={propertyStatusData[2].fill} />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <p className="text-2xl font-bold text-slate-900">105</p>
                        <p className="text-xs text-slate-600">Property Rent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-12">
                  <h4 className="font-bold text-slate-900 mb-6">Reviews :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={review.image}
                            alt={review.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-slate-900">{review.author}</p>
                            <p className="text-xs text-slate-500">{review.handle} {review.location}</p>
                          </div>
                        </div>
                        <p className="text-slate-700 text-sm mb-4">{review.text}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs text-slate-500">{review.daysAgo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Files */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-6">Property File :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center gap-4">
                        <div className={`${file.color} w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0`}>
                          {file.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{file.name}</p>
                          <p className="text-xs text-slate-500">{file.size}</p>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0">
                          <HiOutlineDownload size={18} className="text-slate-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'properties' && (
              <div className="space-y-8">
                {/* Properties Grid */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Featured Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((prop) => (
                      <div key={prop.id} className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="relative h-48 overflow-hidden bg-slate-200">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                            {prop.icon} Featured
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-slate-900 mb-2">{prop.title}</h4>
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <MdLocationOn size={16} /> {prop.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Section - Updated with Recharts */}
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Location</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  

                    {/* Center: Worldwide Map with Recharts */}
                    <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <FaGlobeAmericas className="text-indigo-600" />
                          Worldwide Property Locations
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>High Value</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span>Medium Value</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                              type="number" 
                              dataKey="x" 
                              name="Longitude" 
                              hide={true}
                              domain={[0, 400]}
                            />
                            <YAxis 
                              type="number" 
                              dataKey="y" 
                              name="Latitude" 
                              hide={true}
                              domain={[0, 300]}
                            />
                            <ZAxis 
                              type="number" 
                              dataKey="z" 
                              range={[60, 400]} 
                              name="Value"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Scatter 
                              name="Property Locations" 
                              data={worldMapData} 
                              fill="#3b82f6"
                              shape={(props) => {
                                const { cx, cy, payload } = props;
                                return (
                                  <g>
                                    <circle 
                                      cx={cx} 
                                      cy={cy} 
                                      r={payload.z / 15} 
                                      fill={payload.color}
                                      fillOpacity={0.7}
                                      stroke="white"
                                      strokeWidth={2}
                                    />
                                    <text 
                                      x={cx} 
                                      y={cy} 
                                      textAnchor="middle" 
                                      dy=".3em" 
                                      fontSize={10}
                                      fill="white"
                                      fontWeight="bold"
                                    >
                                      {payload.name.charAt(0)}
                                    </text>
                                  </g>
                                );
                              }}
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                        {worldMapData.map((location, index) => (
                          <div key={index} className="text-xs">
                            <div className="font-medium text-slate-900">{location.name}</div>
                            <div className="text-slate-500">{location.z} properties</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Location Performance Bar Chart */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-bold text-slate-900">Location Performance</h4>
                      <div className="text-sm text-slate-600">
                        Properties Value Score (%) vs Number of Properties
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={locationPerformanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="city" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b' }}
                          />
                          <YAxis 
                            yAxisId="left"
                            orientation="left"
                            label={{ value: 'Value Score (%)', angle: -90, position: 'insideLeft' }}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b' }}
                            domain={[0, 100]}
                          />
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            label={{ value: 'Properties', angle: 90, position: 'insideRight' }}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white',
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            formatter={(value, name) => {
                              if (name === 'value') return [`${value}%`, 'Value Score'];
                              if (name === 'properties') return [value, 'Properties'];
                              return value;
                            }}
                          />
                          <Legend />
                          <Bar 
                            yAxisId="left"
                            dataKey="value" 
                            name="Value Score" 
                            radius={[4, 4, 0, 0]}
                            fill="#3b82f6"
                            fillOpacity={0.8}
                          />
                          <Bar 
                            yAxisId="right"
                            dataKey="properties" 
                            name="Properties" 
                            radius={[4, 4, 0, 0]}
                            fill="#8b5cf6"
                            fillOpacity={0.8}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
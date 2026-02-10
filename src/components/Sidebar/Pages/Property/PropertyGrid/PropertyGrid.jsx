import { useState, useEffect } from 'react';
import { BsBookmark } from 'react-icons/bs';
import { FaBath, FaBed, FaRuler } from 'react-icons/fa';
import { FiMapPin, FiHeart, FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { MdOutlineRoofing } from 'react-icons/md';

const PropertyGrid = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([6000, 100000]);
  const [selectedFilters, setSelectedFilters] = useState({
    forRent: false,
    forSale: false,
    allProperty: true,
    apartment: false,
    duplex: false,
    balcony: false,
    parking: false,
    spa: false,
    pool: false,
    restaurant: false,
    fitnessClub: false
  });

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const properties = [
    {
      id: 1,
      name: 'Dvilla Residences Batu',
      location: '4604, Pilli Lane Kows',
      price: 8930.00,
      beds: 5,
      baths: 4,
      area: 1400,
      floors: 3,
      status: 'For Rent',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 2,
      name: 'PIK Villa House',
      location: '127, Boulevard Cockeysville',
      price: 60691.00,
      beds: 6,
      baths: 5,
      area: 1100,
      floors: 3,
      status: 'For Rent',
      statusColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 3,
      name: 'Tungis Luxury',
      location: '900, Cresde Wi 54913',
      price: 70245.00,
      beds: 4,
      baths: 3,
      area: 1200,
      floors: 2,
      status: 'For Rent',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 4,
      name: 'Luxury Apartment',
      location: '223, Cresde Santa Maria',
      price: 5825.00,
      beds: 2,
      baths: 2,
      area: 800,
      floors: 1,
      status: 'For Rent',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 5,
      name: 'Weekend Villa MBH',
      location: '980, Jim Rosa Lane Dublin',
      price: 90674.00,
      beds: 5,
      baths: 5,
      area: 1100,
      floors: 2,
      status: 'For Sale',
      statusColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 6,
      name: 'Luxury Penthouse',
      location: 'Summer Street Los Angeles',
      price: 10500.00,
      beds: 7,
      baths: 6,
      area: 2000,
      floors: 1,
      status: 'For Rent',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 7,
      name: 'Qiag Duplex House',
      location: '24, Hanover, New York',
      price: 75341.00,
      beds: 3,
      baths: 3,
      area: 1300,
      floors: 2,
      status: 'Sold',
      statusColor: 'bg-red-500',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003fa2628?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 8,
      name: 'Luxury Bungalow Villas',
      location: 'Khale Florence, SC 219',
      price: 54230.00,
      beds: 4,
      baths: 4,
      area: 1200,
      floors: 1,
      status: 'For Rent',
      statusColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1416427891411-f3b02dc199dd?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 9,
      name: 'Duplex Bungalow',
      location: 'Sr, Willison Street Becker',
      price: 14564.00,
      beds: 3,
      baths: 3,
      area: 1600,
      floors: 3,
      status: 'For Rent',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    },
    {
      id: 10,
      name: 'Woods B. Apartment',
      location: 'Bungalow Road Nidmara',
      price: 34341.00,
      beds: 4,
      baths: 3,
      area: 1700,
      floors: 8,
      status: 'For Rent',
      statusColor: 'bg-green-500',
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a7d3f629?w=500&h=300&fit=crop',
      icon: <BsBookmark />
    }
  ];

  const handleFilterChange = (key) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col lg:flex-row relative">
      {/* Mobile Header & Filter Toggle */}
      <div className="lg:hidden p-4 bg-white border-b border-gray-200 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <h2 className="text-lg font-bold text-gray-800">Properties</h2>
        <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
            <FiFilter /> Filters
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobile && showFilters && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
        />
      )}

      {/* Left Sidebar - Filters */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white p-4 border-r border-gray-200 overflow-y-auto transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64 lg:block lg:z-auto ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
            <h3 className="text-lg font-bold text-gray-800">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                <FiX size={20} />
            </button>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-6">Type Of Place</h3>

        {/* Custom Price Range */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Custom Price Range :</h4>
          <div className="flex items-center gap-2 mb-4">
            <input 
              type="range" 
              min="0" 
              max="100000" 
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>6000</span>
            <span>to</span>
            <span>100000</span>
          </div>
        </div>

        {/* Accessibility Features - For Rent/Sale */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Accessibility Features :</h4>
          <div className=" flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedFilters.forRent}
                onChange={() => handleFilterChange('forRent')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">For Rent</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.forSale}
                onChange={() => handleFilterChange('forSale')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">For Sale</span>
            </label>
          </div>
        </div>

        {/* Properties Type */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Properties Type :</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.allProperty}
                onChange={() => handleFilterChange('all-property')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">All Properties</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.cottage}
                onChange={() => handleFilterChange('cottage')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Cottage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.villa}
                onChange={() => handleFilterChange('villa')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Villas</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.apartment}
                onChange={() => handleFilterChange('apartment')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Apartment</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.duplex}
                onChange={() => handleFilterChange('duplex')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Duplex Bungalow</span>
            </label>
          </div>
        </div>

        {/* Bedrooms */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Bedrooms :</h4>
          <div className="flex flex-wrap gap-2">
            {['1 BHK', '2 BHK', '3 BHK', '4 & 5 BHK'].map((option) => (
              <button
                key={option}
                className="px-3 py-1 text-xs border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility Features - Amenities */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Accessibility Features :</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.balcony}
                onChange={() => handleFilterChange('balcony')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Balcony</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.parking}
                onChange={() => handleFilterChange('parking')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Parking</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.spa}
                onChange={() => handleFilterChange('spa')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Spa</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.pool}
                onChange={() => handleFilterChange('pool')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Pool</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.restaurant}
                onChange={() => handleFilterChange('restaurant')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Restaurant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedFilters.fitnessClub}
                onChange={() => handleFilterChange('fitnessClub')}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-600">Fitness Club</span>
            </label>
          </div>
        </div>

        {/* Apply Button */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition mb-4">
          Apply
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-2">

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gray-200">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 ${property.statusColor} text-white text-xs font-semibold px-3 py-1 rounded`}>
                  {property.status}
                </div>

                {/* Icon Badge */}
                <div className="absolute top-3 left-3 bg-white bg-opacity-90 w-8 h-8 rounded flex items-center justify-center text-lg">
                  {property.icon}
                </div>

                {/* Favorite Icon */}
                <button className="absolute bottom-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100">
                  <FiHeart className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-2">
                {/* Property Name and Location */}
                <h3 className="text-lg font-bold text-gray-800 mb-1">{property.name}</h3>
                
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                  <FiMapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                  <span className="flex items-center gap-1 text-nowrap border rounded-sm py-1 px-2 text-xs">
                    <FaBed className="w-3 h-3" />
                    {property.beds} Beds
                  </span>
                  <span className="flex items-center gap-1 text-nowrap border rounded-sm py-1 px-2 text-xs">
                    <FaBath className="w-3 h-3" />
                    {property.baths} Bath
                  </span>
                  <span className="flex items-center gap-1 text-nowrap border rounded-sm py-1 px-2 text-xs">
                    <FaRuler className="w-3 h-3" />
                    {property.area}ft
                  </span>
                </div>

                {/* Floors */}
                <div className="flex items-center gap-1 text-nowrap border rounded-sm py-1 px-2 text-xs">
                    <MdOutlineRoofing className="w-3 h-3" />
                  {property.floors} Floor
                </div>

                {/* Price */}
                <div className="text-2xl font-bold text-gray-800 mb-4">
                  ${property.price.toLocaleString()}
                </div>

                {/* More Inquiry Link */}
                <div className="text-indigo-600 font-medium text-sm hover:text-indigo-800 cursor-pointer">
                  More Inquiry →
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            Previous
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyGrid;
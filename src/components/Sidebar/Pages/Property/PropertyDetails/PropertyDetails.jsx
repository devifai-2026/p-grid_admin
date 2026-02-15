import React, { useState } from 'react';
import { 
  FiShare2, 
  FiHeart, 
  FiMapPin, 
  FiMoreVertical,
  FiCalendar,
  FiPhone,
  FiMessageSquare,
  FiNavigation2
} from 'react-icons/fi';
import { 
  MdVerified,
  MdBathtub,
  MdKingBed,
  MdSquareFoot,
  MdApartment,
  MdStar,
  MdCheckCircle,
  MdPhone,
  MdEmail,
  MdMessage
} from 'react-icons/md';
import { 
  FaSwimmingPool,
  FaTheaterMasks,
  FaPlane,
  FaParking,
  FaBolt,
  FaTree,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { 
  BsFillHouseFill,
  BsFillCalendarFill
} from 'react-icons/bs';
import { 
  AiOutlineDollar,
} from 'react-icons/ai';
import { 
  GrInstagram,
  GrTwitter,
  GrWhatsapp
} from 'react-icons/gr';
import { TiSocialFacebook } from 'react-icons/ti';
import { FaWhatsapp } from "react-icons/fa";

const PropertyDetails = () => {
  const [tourDate, setTourDate] = useState('');
  const [tourTime, setTourTime] = useState('12:00 PM');

  const property = {
    title: 'Hayfield Ashton Place Residences at Willow Brook Valley',
    location: '1668 Lincoln Drive Harrisburg, PA 17101 U.S.A',
    price: '$80,675.00',
    bedrooms: 5,
    bathrooms: 4,
    area: '1800sqft',
    floors: 3,
    rating: 4.4,
    status: 'For Sale',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=500&fit=crop'
  };

  const facilities = [
    { name: 'Big Swimming pool', icon: <FaSwimmingPool className="w-4 h-4" /> },
    { name: 'Near Airport', icon: <FaPlane className="w-4 h-4" /> },
    { name: 'Big Size Garden', icon: <FaTree className="w-4 h-4" /> },
    { name: '4 Car Parking', icon: <FaParking className="w-4 h-4" /> },
    { name: '24/7 Electricity', icon: <FaBolt className="w-4 h-4" /> },
    { name: 'Personal Theater', icon: <FaTheaterMasks className="w-4 h-4" /> }
  ];

  const owner = {
    name: 'Gaston Lapierre',
    role: '(Owner)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  };

  const propertyDescription = `Property refers to any item that an individual or a business holds legal title to. This can include tangible items, such as houses, cars or appliances, as well as intangible items that hold potential future value, such as stock and bond certificates. Legally, property is classified into two categories: personal property and real property. This distinction originates from English common law, and our contemporary legal system continues to differentiate between these two types.`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-2">
        {/* Left Sidebar - Owner Info & Schedule Tour */}
        <div className="lg:col-span-1">
          {/* Owner Card */}
          <div className="bg-white rounded-2xl p-2 shadow-sm mb-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-24 h-24 rounded-full object-cover mb-3 border-4 border-red-100"
              />
              <h3 className="text-lg font-bold text-gray-800">{owner.name}</h3>
              <p className="text-gray-600 text-sm">{owner.role}</p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-3 mb-6">
              <a href="#" className="w-8 h-8 bg-gray-400 rounded-sm flex items-center justify-center  hover:bg-blue-600 text-blue-600">
                <TiSocialFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-400 rounded-sm flex items-center justify-center  text-pink-600">
                <GrInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-400 rounded-sm flex items-center justify-center  text-cyan-600">
                <GrTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-400 rounded-sm flex items-center justify-center  text-green-600">
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <button className="flex-1 bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-1 px-2 rounded-sm transition flex items-center justify-center gap-2 text-nowrap text-sm">
                <FiPhone className="w-3 h-3" />
                Call Us
              </button>
              <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-2 rounded-sm transition flex items-center justify-center gap-2">
                <FiMessageSquare className="w-3 h-3" />
                Message
              </button>
            </div>

            {/* Schedule A Tour */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiCalendar className="w-5 h-5" />
                Schedule A Tour
              </h4>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    placeholder="dd-mm-yyyy"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                  />
                  <FiCalendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative">
                  <select
                    value={tourTime}
                    onChange={(e) => setTourTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] appearance-none"
                  >
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                  <FiCalendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                  />
                  <MdMessage className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                  />
                  <MdEmail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]"
                  />
                  <MdPhone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Message"
                    rows="4"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529] resize-none"
                  ></textarea>
                  <FiMessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>

                <button className="w-full bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2">
                  <MdMessage className="w-5 h-5" />
                  Send Information
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Right Side */}
        <div className="lg:col-span-3 space-y-6">
          {/* Property Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-80 object-cover"
            />
          </div>

          {/* Property Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {/* Title and Actions */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MdVerified className="w-5 h-5 text-green-500" />
                  <FiMapPin className="w-5 h-5" />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiShare2 className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiHeart className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <BsFillHouseFill className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <FiMoreVertical className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">
                <AiOutlineDollar className="w-4 h-4" />
              </div>
              <span className="text-xl font-semibold text-gray-800">{property.price}</span>
            </div>

            {/* Key Features */}
            <div className="flex  gap-4 items-center mb-6  border-b border-gray-200 border p-2">
              <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
                <MdKingBed className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-nowrap text-sm">{property.bedrooms} Bedroom</span>
              </div>
              <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
                <MdBathtub className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-nowrap text-sm">{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
                <MdSquareFoot className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-nowrap text-sm">{property.area}</span>
              </div>
              <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
                <MdApartment className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 text-nowrap text-sm">{property.floors} Floor</span>
              </div>
              <div className="flex items-center gap-2 border-r border-gray-300 pr-2">
                <MdStar className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700 text-nowrap text-sm">{property.rating} Review</span>
              </div>
              <div className="flex items-center gap-2 ">
                <MdCheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-gray-700 text-nowrap text-sm">
                  {property.status}
                </span>
              </div>
            </div>

            {/* Facilities */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Some Facility :</h3>
              <div className="flex flex-wrap gap-2">
                {facilities.map((facility, index) => (
                  <span key={index} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm flex items-center gap-2">
                    {facility.icon}
                    {facility.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Property Details Description */}
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Property Details :</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {propertyDescription}
              </p>
              <div className="flex justify-between items-center">
                <a href="#" className="text-[#EE2529] font-semibold hover:text-[#B71C1C] flex items-center gap-1">
                  View More Detail →
                </a>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <BsFillCalendarFill className="w-4 h-4" />
                  10 May 2024
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
          {/* Map Section */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="h-96 bg-gray-200 relative">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3003.0480225280706!2d-75.13660232346045!3d40.04188447129896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6b82b5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2s1668%20Lincoln%20Drive%2C%20Harrisburg%2C%20PA%2017101!5e0!3m2!1sen!2sus!4v1234567890"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property Location"
              ></iframe>
            </div>

            {/* Map Info Card */}
            <div className="p-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 inline-block mb-4">
                <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt className="w-5 h-5 text-red-500" />
                  University of Oxford
                </h4>
                <p className="text-sm text-gray-600 mb-2 ml-7">Wellington Square, Oxford OX1 2JD, United Kingdom</p>
                <div className="flex items-center gap-1 mb-2 ml-7">
                  <MdStar className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold text-gray-800">4.6</span>
                  <span className="text-gray-500 text-sm">(6,787 reviews)</span>
                </div>
                <div className="ml-7">
                  <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1">
                    <FiNavigation2 className="w-4 h-4" />
                    Directions
                  </a>
                  <a href="#" className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1 float-right">
                    <FiMapPin className="w-4 h-4" />
                    View larger map
                  </a>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
};

export default PropertyDetails;
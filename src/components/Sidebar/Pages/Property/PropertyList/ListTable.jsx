import React from 'react';
import { FiEye, FiEdit2, FiTrash2, FiChevronDown, FiHome, FiMapPin, FiDollarSign } from 'react-icons/fi';

const ListTable = () => {
  const properties = [
    {
      id: 1,
      name: 'Dvilla Residences Batu',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=100&h=80&fit=crop',
      size: '1400ft²',
      type: 'Residences',
      status: 'Rent',
      statusColor: 'bg-green-100 text-green-700',
      bedrooms: 5,
      location: 'France',
      price: '$8,930.00'
    },
    {
      id: 2,
      name: 'PIK Villa House',
      image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=100&h=80&fit=crop',
      size: '1700ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 6,
      location: 'Bermuda',
      price: '$60,691.00'
    },
    {
      id: 3,
      name: 'Tungis Luxury',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=80&fit=crop',
      size: '1200ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 4,
      location: 'Australia',
      price: '$70,245.00'
    },
    {
      id: 4,
      name: 'Luxury Apartment',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&h=80&fit=crop',
      size: '900ft²',
      type: 'Residences',
      status: 'Rent',
      statusColor: 'bg-green-100 text-green-700',
      bedrooms: 2,
      location: 'France',
      price: '$5,825.00'
    },
    {
      id: 5,
      name: 'Weekend Villa MBH',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=80&fit=crop',
      size: '1900ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 5,
      location: 'U.S.A',
      price: '$90,674.00'
    },
    {
      id: 6,
      name: 'Luxury Penthouse',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&h=80&fit=crop',
      size: '2000ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 7,
      location: 'Greenland',
      price: '$10,500.00'
    },
    {
      id: 7,
      name: 'Ojiag Duplex House',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003fa2628?w=100&h=80&fit=crop',
      size: '1300ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 3,
      location: 'France',
      price: '$75,341.00'
    },
    {
      id: 8,
      name: 'Luxury Bungalow Villas',
      image: 'https://images.unsplash.com/photo-1416427891411-f3b02dc199dd?w=100&h=80&fit=crop',
      size: '1200ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 4,
      location: 'France',
      price: '$54,230.00'
    },
    {
      id: 9,
      name: 'Duplex Bungalow',
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a7d3f629?w=100&h=80&fit=crop',
      size: '1800ft²',
      type: 'Residences',
      status: 'Rent',
      statusColor: 'bg-green-100 text-green-700',
      bedrooms: 3,
      location: 'Canada',
      price: '$14,564.00'
    },
    {
      id: 10,
      name: 'Woodis B. Apartment',
      image: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=100&h=80&fit=crop',
      size: '1700ft²',
      type: 'Residences',
      status: 'Rent/Sale',
      statusColor: 'bg-blue-100 text-blue-700',
      bedrooms: 4,
      location: 'U.S.A',
      price: '$34,341.00'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">All Properties List</h2>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer">
          <span className="text-gray-700 text-sm font-medium">This Month</span>
          <FiChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-8 py-4 text-left text-sm font-semibold text-gray-600 min-w-[250px]">
                Property Photo & Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[100px]">
                Size
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[120px]">
                Property Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[100px]">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[120px]">
                Rent/Sale
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 min-w-[140px]">
                Action
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                {/* Property Photo & Name with Bedrooms */}
                <td className="px-8 py-4 min-w-[250px]">
                  <div className="flex items-center gap-4">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-16 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiHome className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500 text-sm">{property.bedrooms} Bedrooms</span>
                      </div>
                      <span className="font-medium text-gray-800">{property.name}</span>
                    </div>
                  </div>
                </td>

                {/* Size */}
                <td className="px-6 py-4 text-gray-600 text-sm min-w-[100px]">
                  {property.size}
                </td>

                {/* Property Type */}
                <td className="px-6 py-4 text-gray-600 text-sm min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <FiHome className="w-4 h-4 text-gray-400" />
                    <span>{property.type}</span>
                  </div>
                </td>

                {/* Price with Location */}
                <td className="px-6 py-4 min-w-[100px]">
                  <div>
                    <div className="font-semibold text-gray-800">{property.price}</div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                      <FiMapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </td>

                {/* Rent/Sale Status */}
                <td className="px-6 py-4 min-w-[120px]">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.statusColor}`}>
                    {property.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 min-w-[140px]">
                  <div className="flex items-center gap-3">
                    <button 
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      title="View"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button 
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-8 py-6 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-600">
          Showing 1 to 10 of 10 properties
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            Previous
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListTable;
import React, { useState } from 'react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
  FaLeaf,
  FaEdit
} from 'react-icons/fa';
import {
  MdMessage,
  MdChatBubbleOutline,
  MdLocationOn,
  MdEmail
} from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';

const GridView = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const agents = [
    {
      id: 1,
      name: 'Michael A. Miner',
      status: 'Available',
      statusColor: 'bg-emerald-500',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      email: 'davidnumminer@teleworm.us',
      phone: '+231 06-75820711',
      address: 'Schoolstraat 161 5151 HH Drunen',
      viewProperty: 231,
      ownProperty: 27,
      investProperty: '$928,128'
    },
    {
      id: 2,
      name: 'Theresa T. Brose',
      status: 'Available',
      statusColor: 'bg-emerald-500',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      email: 'sinikkapentiinen@dayrep.com',
      phone: '+231 47-23456789',
      address: 'Jean Racinelaan 48 5629 PK Eindhoven',
      viewProperty: 134,
      ownProperty: 13,
      investProperty: '$435,892'
    },
    {
      id: 3,
      name: 'James L. Erickson',
      status: 'Available',
      statusColor: 'bg-emerald-500',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      email: 'jerepalmu@rhyta.com',
      phone: '+231 73-34567890',
      address: 'Alkmenehof 124 2728 KA Zoetermeer',
      viewProperty: 301,
      ownProperty: 15,
      investProperty: '$743,120'
    },
    {
      id: 4,
      name: 'Lily W. Wilson',
      status: 'Unavailable',
      statusColor: 'bg-rose-500',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
      email: 'ullanorela@rhyta.com',
      phone: '+231 45-45678901',
      address: 'Oudegracht 135 3511 NJ Utrecht',
      viewProperty: 109,
      ownProperty: 7,
      investProperty: '$635,812'
    },
    {
      id: 5,
      name: 'Sarah M. Brooks',
      status: 'Available',
      statusColor: 'bg-emerald-500',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
      email: 'tiiakarppinen@teleworm.us',
      phone: '+231 16-56789012',
      address: 'Willem de Zwijgerlaan 183 2315 AT Leiden',
      viewProperty: 142,
      ownProperty: 18,
      investProperty: '$733,291'
    },
    {
      id: 6,
      name: 'Joe K. Hall',
      status: 'Unavailable',
      statusColor: 'bg-rose-500',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      email: 'harlandorsini@dayrep.com',
      phone: '+231 82-67890123',
      address: 'Bongerd 116 6367 CL Voerendaal',
      viewProperty: 109,
      ownProperty: 10,
      investProperty: '$831,760'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-2">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Property Agents</h1>
        <p className="text-slate-600 flex items-center gap-2">
          <FaLeaf className="w-4 h-4" />
          Connect with our professional team
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map((agent) => (
          <div
            key={agent.id}
            onMouseEnter={() => setHoveredCard(agent.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200"
          >
            {/* Decorative Header */}
            <div className="h-32 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-slate-400 rounded-lg p-2">
                <FaEdit />
              </div>
              {/* Decorative leaves */}
              <div className="absolute -top-8 left-2 text-green-200 opacity-30 text-3xl">🍃</div>
              <div className="absolute top-4 right-12 text-yellow-200 opacity-20 text-2xl">🌿</div>
            </div>

            {/* Profile Section */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="flex justify-center -mt-16 mb-4">
                <div className="relative">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-8 h-8 ${agent.statusColor} rounded-full border-3 border-white`}></div>
                </div>
              </div>

              {/* Name and Status */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 mb-1">{agent.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${agent.statusColor}`}>
                  {agent.status}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6 text-sm text-slate-600 border-b border-slate-100 pb-4">
                <div className="flex items-start gap-2">
                  <MdEmail className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 min-w-fit">Email Address:</span>
                  <span className="text-slate-600 break-all">{agent.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <FaPhone className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 min-w-fit">Contact Number:</span>
                  <span className="text-slate-600">{agent.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MdLocationOn className="text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold text-slate-700 min-w-fit">Address:</span>
                  <span className="text-slate-600">{agent.address}</span>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{agent.viewProperty}</p>
                  <p className="text-xs text-slate-600 font-medium">View Property</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">{agent.ownProperty}</p>
                  <p className="text-xs text-slate-600 font-medium">Own Property</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[#EE2529]">{agent.investProperty}</p>
                  <p className="text-xs text-slate-600 font-medium">Invest On</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-slate-600 mb-3">Social Information:</p>
                <div className="flex gap-3">
                  <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600 hover:text-blue-700">
                    <FaFacebookF className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-pink-50 rounded-lg transition-colors text-pink-600 hover:text-pink-700">
                    <FaInstagram className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-sky-50 rounded-lg transition-colors text-sky-500 hover:text-sky-600">
                    <FaTwitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600 hover:text-green-700">
                    <FaWhatsapp className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-orange-50 rounded-lg transition-colors text-orange-500 hover:text-orange-600">
                    <FaEnvelope className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <MdChatBubbleOutline className="w-4 h-4" />
                  Open Chat
                </button>
                <button className="px-4 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-lg transition-colors duration-200 hover:bg-slate-50">
                  <FaPhone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridView;
import React from 'react';
import { FaTimes } from 'react-icons/fa'; 

const PersonalInfoModal = ({ member, onClose }) => {
  if (!member) return null;

  if (typeof member !== 'object' || !member.profilePicture || !member.name || !member.email || !member.status || !member.role || !Array.isArray(member.teams)) {
    console.error('Invalid member object');
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-8 rounded-l-lg shadow-lg overflow-y-auto w-[700px] h-[600px]">
       
        <div className="relative bg-blue-800 text-white p-4 flex items-center rounded-tl-lg">
          <img
            src={member.profilePicture}
            alt={member.name}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{member.name}</span>
            <div className="flex items-center text-sm">
               user.Id
              <span className="mx-2">|</span>
              <span>{member.role}</span>
              <span>{}</span>
            </div>
          </div>
     
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-normal mb-6 mt-6">Personal Information</h2>
          <div className="mb-6">
            <h3 className="text-gray-700 border-b border-gray-300 pb-2 mb-2 flex">
              <span>Date Of Birth</span>
              <span className="mx-2">:</span>
              <span>24-02-1987</span>
            </h3>
            <h3 className="text-gray-700 border-b border-gray-300 pb-2 mb-2 flex">
              <span>Gender</span>
              <span className="mx-2">:</span>
              <span>Female</span>
            </h3>
            <h3 className="text-gray-700 border-b border-gray-300 pb-2 mb-2 flex">
              <span>Nationality</span>
              <span className="mx-2">:</span>
              <span>Canadian</span>
            </h3>
            <h3 className="text-gray-700 border-b border-gray-300 pb-2 mb-2 flex">
              <span>Email</span>
              <span className="mx-2">:</span>
              <span>{member.email}</span>
            </h3>
            <h3 className="text-gray-700 border-b border-gray-300 pb-2 flex">
              <span>Contact Number</span>
              <span className="mx-2">:</span>
              <span>789654321</span>
            </h3>
          </div>

        </div>
      </div>

  );
};

export default PersonalInfoModal;

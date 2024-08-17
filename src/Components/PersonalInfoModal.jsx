import React from 'react';

const PersonalInfoModal = ({ member, onClose }) => {
  if (!member) return null;

  // Simple runtime check for member object
  if (typeof member !== 'object' || !member.profilePicture || !member.name || !member.email || !member.status || !member.role || !Array.isArray(member.teams)) {
    console.error('Invalid member object');
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-l-lg shadow-lg w-[50%] h-full overflow-y-auto">
        {/* Header with profile picture, userId, and role */}
        <div className="bg-blue-500 text-white p-4 flex items-center">
          <img
            src={member.profilePicture}
            alt={member.name}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div className="flex flex-col flex-grow">
            <div className="flex items-center text-lg font-semibold">
              <span className="mr-4">{member.userId}</span>
              <span className="mx-2 border-l border-white h-6"></span>
              <span>{member.role}</span>
            </div>
          </div>
        </div>
        
        {/* Modal content */}
        <h2 className="text-2xl font-semibold mb-6 mt-6">Personal Information</h2>
        <div className="mb-6 flex items-center">
          <img
            src={member.profilePicture}
            alt={member.name}
            className="w-24 h-24 rounded-full mr-6"
          />
          <div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-gray-700">Email: {member.email}</p>
            <p className="text-gray-700">Status: {member.status}</p>
            <p className="text-gray-700">Teams: {member.teams.join(', ')}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded px-6 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoModal;

import React from 'react';
import PropTypes from 'prop-types';

const PersonalInfoModal = ({ member, onClose }) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="mb-4 flex items-center">
          <img
            src={member.profilePicture}
            alt={member.name}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-gray-700">Email: {member.email}</p>
            <p className="text-gray-700">Status: {member.status}</p>
            <p className="text-gray-700">Role: {member.role}</p>
            <p className="text-gray-700">Teams: {member.teams.join(', ')}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

PersonalInfoModal.propTypes = {
  member: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default PersonalInfoModal;

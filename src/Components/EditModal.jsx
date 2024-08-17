import React, { useState, useEffect } from 'react';
import { FaCamera, FaTrashAlt } from 'react-icons/fa';
import Select from 'react-select';

const EditModal = ({ isOpen, onClose, member, onSave }) => {

  const availableRoles = [
    { label: 'Product Designer', value: 'Product Designer' },
    { label: 'Product Manager', value: 'Product Manager' },
    { label: 'Frontend Developer', value: 'Frontend Developer' },
    { label: 'Backend Developer', value: 'Backend Developer' },
    
  ];

  const availableTeams = [
    { label: 'Design', value: 'Design' },
    { label: 'Product', value: 'Product' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Technology', value: 'Technology' }

  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
    teams: [],
  });
  const [imagePreview, setImagePreview] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || '',
        status: member.status || 'active',
        teams: member.teams || [],
      });
      setImagePreview(member.profilePicture || '');
      setSelectedTeams(member.teams.map(team => ({ label: team, value: team })));
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ ...member, ...formData, teams: selectedTeams.map(team => team.value) });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
   
          <div className="mb-4 flex flex-col items-center">
            <label className="block text-gray-700 mb-2">Profile Picture</label>
            <div className="relative w-40 h-28 rounded-full bg-gray-200">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div className="absolute top-0 right-0 bg-black bg-opacity-50 w-full h-full flex items-center justify-center rounded-full">
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span>No image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="bg-gray-200 text-gray-500 rounded px-4 py-2 flex items-center gap-2"
              >
                <FaCamera size={16} />
                Change Picture
              </button>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="bg-gray-200 text-gray-500 rounded px-4 py-2 flex items-center gap-2"
              >
                <FaTrashAlt size={16} />
                Remove Picture
              </button>
            </div>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
                required
              />
            </div>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
                required
              >
                <option value="" disabled>Select role</option>
                {availableRoles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded w-full p-2"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Teams</label>
            <Select
              isMulti
              options={availableTeams}
              value={selectedTeams}
              onChange={setSelectedTeams}
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Select teams"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 rounded px-4 py-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white rounded px-4 py-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;

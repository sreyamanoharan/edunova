import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../api/axios';
import Select from 'react-select';
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { FaFilter } from "react-icons/fa";
import ProfileModal from './ProfileModal';
import { FaCamera, FaTrashAlt } from 'react-icons/fa';

const availableTeams = [
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'technology', label: 'Technology' },
];

const availableRoles = [
  { value: 'product-designer', label: 'Product Designer' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'frontend-developer', label: 'Frontend Developer' },
  { value: 'backend-developer', label: 'Backend Developer' },
];

const TableHeader = ({ refreshTable, onSearchChange, onFilterChange, memberCount }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset, control } = useForm();
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(''); // 'role' or 'teams'
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedFilterTeams, setSelectedFilterTeams] = useState([]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'edunova');

    try {
      const response = await axiosInstance.post(
        'https://api.cloudinary.com/v1_1/ds0dvm4ol/image/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error.response ? error.response.data : error.message);
      return null;
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = imageURL;
      if (selectedFile) {
        imageUrl = await uploadToCloudinary(selectedFile);
      }
  
      await axiosInstance.post('/register', {
        ...data,
        role: data.role.value, 
        profilePicture: imageUrl,
        teams: selectedTeams.map(team => team.value) 
      });
  
      handleCloseModal();
      reset();
      setImagePreview('');
      setSelectedFile(null);
      setImageURL('');
      setSelectedTeams([]);
      refreshTable(); // Call the refresh function to update the table
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();  // Reset the form when closing the modal
    setImagePreview('');
    setSelectedFile(null);
    setImageURL('');
    setSelectedTeams([]);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setImagePreview('');
    setSelectedFile(null);
    setImageURL('');
  };

  const handleFilterChange = () => {
    onFilterChange({
      role: selectedRole,
      teams: selectedFilterTeams.map(team => team.value) // Ensure team values are extracted
    });
    setFilterOpen(false); // Close the filter dropdown after applying filter
  };

  const handleFilterOptionClick = (filterType) => {
    setSelectedFilter(filterType);
    setFilterOpen(true); // Open filter dropdown
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setFilterOpen(false); // Close filter dropdown if clicked outside
    }
  };

  const filterRef = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Team Members</h2>
          <button className='bg-blue-300 rounded-md'>{memberCount} members</button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded p-2 pr-10 w-full"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          </div>
          <div className="relative" ref={filterRef}>
            <FaFilter 
              className="text-gray-600 cursor-pointer" 
              size={20} 
              onClick={() => setFilterOpen(!filterOpen)} 
            />
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg z-10">
                <div className="p-4">
                  <button
                    onClick={() => handleFilterOptionClick('role')}
                    className="block w-full text-left px-4 py-2"
                  >
                    Role
                  </button>
                  <button
                    onClick={() => handleFilterOptionClick('teams')}
                    className="block w-full text-left px-4 py-2"
                  >
                    Teams
                  </button>

                  {selectedFilter === 'role' && (
                    <div>
                      <h3 className="text-gray-700 mb-2">Select Role</h3>
                      <div>
                        {availableRoles.map(role => (
                          <label key={role.value} className="block">
                            <input
                              type="radio"
                              name="role"
                              value={role.value}
                              checked={selectedRole === role.value}
                              onChange={(e) => setSelectedRole(e.target.value)}
                              className="mr-2"
                            />
                            {role.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedFilter === 'teams' && (
                    <div>
                      <h3 className="text-gray-700 mb-2">Select Teams</h3>
                      <div>
                        {availableTeams.map(team => (
                          <label key={team.value} className="block">
                            <input
                              type="checkbox"
                              name="teams"
                              value={team.value}
                              checked={selectedFilterTeams.some(t => t.value === team.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFilterTeams([...selectedFilterTeams, team]);
                                } else {
                                  setSelectedFilterTeams(selectedFilterTeams.filter(t => t.value !== team.value));
                                }
                              }}
                              className="mr-2"
                            />
                            {team.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <button
                      onClick={handleFilterChange}
                      className="bg-violet-600 text-white rounded px-4 py-2 w-full"
                    >
                      SELECT
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-violet-600 text-white flex items-center rounded-lg h-8 px-3 w-[250px]"
          >
            <IoIosAdd className="text-2xl" />
            ADD MEMBER
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              className="hidden" // Hide the file input
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
                {...register('name')}
                className="border border-gray-300 rounded w-full p-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="border border-gray-300 rounded w-full p-2"
                required
              />
            </div>
          </div>
      
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700">Role</label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={availableRoles}
                    className="border border-gray-300 rounded w-full p-2"
                    placeholder="Select role"
                  />
                )}
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Status</label>
              <select
                {...register('status')}
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
              onClick={handleCloseModal}
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
      </ProfileModal>
      
      )}
    </>
  );
};

export default TableHeader;
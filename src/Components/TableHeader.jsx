import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../api/axios';
import { FaSearch, FaFilter } from 'react-icons/fa'; 
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import ProfileModal from './ProfileModal';
import Select from 'react-select';

const availableTeams = [
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'technology', label: 'Technology' },
];

const TableHeader = ({ refreshTable }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset, control } = useForm();
  const [selectedTeams, setSelectedTeams] = useState([]);

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

      console.log('Cloudinary response:', response.data);
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
        profilePicture: imageUrl,
        teams: selectedTeams.map(team => team.value) // Extract the value from the selected teams
      });

      console.log('Profile updated');
      handleCloseModal();
      reset();
      setImagePreview('');
      setSelectedFile(null);
      setImageURL('');
      setSelectedTeams([]);
      refreshTable(); // Call the refresh function
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Team Members</h2>
          <span className="text-gray-600">(10 members)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 rounded p-2 pr-10 w-full"
            />
            <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800" />
          </div>
          <FaFilter className="text-gray-600 cursor-pointer" size={20} />
          <button
            onClick={handleOpenModal}
            className="bg-violet-600 flex items-center text-white rounded-lg h-8 px-3"
          >
            <IoIosAdd className="mr-1" size={20} />
            ADD MEMBER
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col items-center">
              <label className="block text-gray-700 mb-2">Profile Picture</label>
      
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center w-full h-full text-gray-500">No Image</span>
                )}
              </div>
              <input
                type="file"
                id="profilePicture"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('profilePicture').click()}
                  className="bg-blue-500 text-white rounded px-4 py-2"
                >
                  Update Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-red-500 text-white rounded px-4 py-2"
                >
                  Remove Photo
                </button>
              </div>
            </div>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input type="text" {...register('name')} className="border border-gray-300 rounded p-2 w-full" placeholder="Enter name" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input type="email" {...register('email')} className="border border-gray-300 rounded p-2 w-full" placeholder="Enter email" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select {...register('role')} className="border border-gray-300 rounded p-2 w-full">
                  <option value="product-designer">Product Designer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="backend-developer">Backend Developer</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select {...register('status')} className="border border-gray-300 rounded p-2 w-full">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 mb-2">Teams</label>
                <Controller
                  name="teams"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti
                      options={availableTeams}
                      value={selectedTeams}
                      onChange={(selectedOptions) => {
                        setSelectedTeams(selectedOptions || []);
                        field.onChange(selectedOptions);
                      }}
                      className="basic-single"
                      classNamePrefix="select"
                      placeholder="Select teams"
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={handleCloseModal} className="bg-gray-500 text-white rounded px-4 py-2 mr-2">
                Cancel
              </button>
              <button type="submit" className="bg-violet-600 text-white rounded px-4 py-2">
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

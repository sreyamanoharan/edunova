import React, { useState } from 'react';
import { TbTableFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

  const [selectedItem, setSelectedItem] = useState(null);


  const navigate = useNavigate();

  return (
    <div className='w-[250px] bg-white h-screen pt-8 pl-6'>
      <div
        className={`flex items-center space-x-2 cursor-pointer p-2 font-bold ${selectedItem === 'overview' ? 'text-violet-500' : 'text-black'}`}
        onClick={() => {
          setSelectedItem('overview');
          navigate('/');
        }}
      >
        <TbTableFilled className='text-lg' />
        <h4>Overview</h4>
      </div>
      
      <div
        className={`flex items-center space-x-2 cursor-pointer p-2 font-bold ${selectedItem === 'people' ? 'text-violet-500' : 'text-black'}`}
        onClick={() => {
          setSelectedItem('people');
          navigate('/people');
        }}
      >
        <TbTableFilled className='text-lg ' />
        <h4>People directory</h4>
      </div>
    </div>
  );
};

export default Sidebar;

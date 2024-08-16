import React, { useState } from 'react';
import { TbTableFilled } from 'react-icons/tb';

const Sidebar = () => {
  // State to manage the selected item
  const [selectedItem, setSelectedItem] = useState(null);

  // Function to handle item selection
  const handleClick = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className='w-[250px] bg-white h-screen pt-8 pl-6'>
      <div
        className={`flex items-center space-x-2 cursor-pointer p-2  font-bold ${selectedItem === 'overview' ? 'text-violet-500' : 'text-black'}`}
        onClick={() => handleClick('overview')} 
      >
        <TbTableFilled className='text-lg' />
        <h4>Overview</h4>
      </div>
      
      <div
        className={`flex items-center space-x-2 cursor-pointer p-2 font-bold ${selectedItem === 'people' ? 'text-violet-500' : 'text-black'}`}
        onClick={() => handleClick('people')}
      >
        <TbTableFilled className='text-lg ' />
        <h4>People directory</h4>
      </div>
    </div>
  );
};

export default Sidebar;
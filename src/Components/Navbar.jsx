import React from 'react';
import { CiBellOn } from "react-icons/ci";
import { IoIosContact } from "react-icons/io";

const Navbar = () => {
    return (
        <div >
            <div className='h-24 bg-white pl-5  flex items-center justify-between border border-gray-300'>

                <h1 className='text-violet-700 font-bold text-4xl'>PEOPLE.CO</h1>
                <div className='text-lg flex items-center justify-between pr-4 w-[160px] pl-9'>
                    <CiBellOn />
                    <IoIosContact/>
                    <h1>Jane doe</h1>
                </div>

            </div>

        </div>
    );
}

export default Navbar;

import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import Welcome from '../Components/Welcome'


const Dashboard = () => {
  return (
    <div className='h-screen overflow-hidden'>
        <Navbar/>
        <div className='flex'>
        <Sidebar/>
        <Welcome/>
        </div>
        
    </div>
  )
}

export default Dashboard
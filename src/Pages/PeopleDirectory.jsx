import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import Table from '../Components/Table'


const PeopleDirectory = () => {
  return (
    <div className='h-screen overflow-hidden'>
    <Navbar/>
    <div className='flex box-border'>
    <Sidebar/>
    <Table/>
    </div>
    </div>
  )
}

export default PeopleDirectory
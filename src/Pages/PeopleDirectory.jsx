import React from 'react'
import Navbar from '../Components/Navbar'
import Sidebar from '../Components/Sidebar'
import Table from '../Components/Table'


const PeopleDirectory = () => {
  return (
    <div>
        <Navbar/>
        <div className='flex'>
        <Sidebar/>
        <Table/>
        </div>
       
    </div>
  )
}

export default PeopleDirectory
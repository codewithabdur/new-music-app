import React, { useState } from 'react'
import {Sidebar, Body} from "../Container"
import {Navbar} from "../Components"

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState(''); 
  return (
    <>
    <Navbar/>
    <div className="flex">
    <Sidebar setSearchQuery={setSearchQuery}/>
    <Body searchQuery={searchQuery} />
    </div>
    </>
  )
}

export default Homepage
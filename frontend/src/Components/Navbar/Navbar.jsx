import React, { useEffect, useState } from 'react'
import oldclient from '../../lib/oldclient'

const Navbar = () => {
  const [sanity, setSanity] = useState([])

  useEffect(() =>{
    oldclient.fetch(`*[_type == "nav"]{
      title,
      imageL{
      asset->{
      url,
      },
      },
      imageR{
      asset->{
      url,
      },
      },
      }`).then((data) =>{
      setSanity(data)
      console.log(data)
      }).catch((error) =>{
      console.log("Error fetching data from Sanity:", error)
      })
  },[])
  return (
    <>
    <div className="navbar bg-[#545f66]">
      <div className="navbarbox flex justify-around items-center h-[15vh]">
        <div className="nableft">
          <img src={sanity[0]?.imageL?.asset?.url} alt="logo" className='w-[200px]' />
        </div>
        <div className="navright h-[80px] w-[80px] overflow-hidden rounded-[50%] object-cover">
          <span>
            <img src={sanity[0]?.imageR?.asset?.url} alt="" />
          </span>
        </div>
      </div>
    </div>
    </>
  )
}

export default Navbar

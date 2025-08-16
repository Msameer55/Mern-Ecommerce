import React from 'react'
import { NavLink } from 'react-router-dom'
import {TbBrandMeta} from "react-icons/tb"
import {IoLogoInstagram} from "react-icons/io"
import {RiTwitterXLine} from "react-icons/ri"

const Topbar = () => {
  return (
    <>
        <div className="bg-[#2d2d2d] text-white p-2">
            <div className="container mx-auto inner-container flex justify-between items-center">
                <div className="icon  gap-2 items-center hidden md:flex">
                    <NavLink to="#" className="hover:text-gray-50">
                           <TbBrandMeta /> 
                    </NavLink>
                    <NavLink to="#" className="hover:text-gray-50">
                           <IoLogoInstagram /> 
                    </NavLink>
                    <NavLink to="#" className="hover:text-gray-50">
                           <RiTwitterXLine /> 
                    </NavLink>
                </div>
                <div className="text-center text-sm w-full md:w-auto">
                    <p>We Ship Worldwide fast and reliable shipping</p>
                </div>
                <div className="text-center text-sm hidden md:block">
                    <a href="tel:+1234567890" className='hover:text-gray-50'>
                        +1 (234) 567-890
                    </a>
                </div>
            </div>
        </div>
    </>
  )
}

export default Topbar
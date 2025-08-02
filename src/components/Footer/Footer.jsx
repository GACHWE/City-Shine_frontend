// import React from 'react'
// import FbIcon from '../common/FbIcon'
// import InstaIcon from '../common/InstaIcon'


// const Footer = ({content}) => {
//   return (
//     <div className='bg-black text-white py-8'>
//         <div className='flex justify-around'>
//             {content?.items && content?.items?.map((item,index)=>{
//                 return (
//                     <div className='flex flex-col'>
//                     <p className='text-[16px] pb-[10px]'>{item?.title}</p>
//                     {item?.list && item?.list?.map((listItem,index)=><a className='flex flex-col text-[12px] py-2'
//                      href={listItem?.path}>{listItem?.label}</a>)}
//                      {item?.description && <p>{item?.description}</p>}
//                     </div>
//                 )
//             })}
//         </div>
//         <div className='flex gap-2 items-center justify-center py-4'>
//           <a href='/fb'><FbIcon /></a>
//           <a href='/insta'><InstaIcon /></a>  
//         </div>
//         <p className='text-sm text-white text-center content-center'>{content?.copyright}</p>

//     </div>
//   )
// }


// export default Footer

import React from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";
// import { Link } from "react-scroll";
import { Link } from "react-router-dom"; // Use Link from react-router-dom for navigation
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className=" bg-gradient-to-br from-white to-gray-300 text-gray-950 p-5 dark:bg-gradient-to-tr dark:from-black dark:to-gray-700 dark:text-white duration-200 ">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">TevaOnTime</h1>
          <p className="text-sm">A haven of love, peace, joy, food and drinks</p>
          <div className="flex items-center gap-2">
            <FaLocationDot />
            <a
              className="text-blue-600 hover:text-brightColor transition-all cursor-pointer dark:text-blue-400"
              href="https://www.google.com/maps/place/Teva+on+time/@-1.1620612,36.9654407,17z/data=!4m14!1m7!3m6!1s0x182f410022fd0503:0x2d1af75a369836d3!2sTeva+on+time!8m2!3d-1.1620612!4d36.9654407!16s%2Fg%2F11wpsgtxwd!3m5!1s0x182f410022fd0503:0x2d1af75a369836d3!8m2!3d-1.1620612!4d36.9654407!16s%2Fg%2F11wpsgtxwd?entry=ttu&g_ep=EgoyMDI1MDQyMS4wIKXMDSoASAFQAw%3D%3D" //  corrected href
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Location
            </a>
          </div>
        </div>
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Links</h1>
          <nav className="flex flex-col gap-2">
            <Link
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
              href="#" // Added href
            >
              Home
            </Link>
            <Link
              to="dishes"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
              href="#" // Added href
            >
              Dishes
            </Link>
            <Link
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
              href="#" // Added href
            >
              About
            </Link>
            <Link
              to="reviews"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-brightColor transition-all cursor-pointer"
              href="#" // Added href
            >
              Reviews
            </Link>
          </nav>
        </div>
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <a
              className="hover:text-brightColor transition-all cursor-pointer"
              href="mailto:tevaontime@gmail.com" // Changed to mailto:
            >
              tevaontime@gmail.com
            </a>
            <a
              className="hover:text-brightColor transition-all cursor-pointer"
              href="tel:0114409633"  // Changed to tel:
            >
              0114409633
            </a>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook style={{ color: "#3b5998" }} /></a>
              <a href="https://x.com/gbSKG257?t=2grn-XsFHi_GOpWO_HSTYA&s=08 " aria-label="Twitter"><FaTwitter style={{ color: "#1da1f2" }} /></a>
              <a href="https://www.instagram.com/invites/contact/?igsh=jbwwumbaz28a&utm_content=okuoail " aria-label="Instagram"><FaInstagram style={{ color: "#e4405f" }} /></a>
              <a href="https://www.tiktok.com/@samuelkamau205?_t=ZM-8tYM5G3tAPO&_r=1" aria-label="TikTok"><FaTiktok style={{ color: "#010101" }} /></a>
              <a href="https://wa.me/message/CVIX6VY5YDPYB1 " aria-label="WhatsApp"><FaWhatsapp style={{ color: "#25d366" }} /></a>
            </div>
          </nav>
        </div>
      </div>
      <div>
        <p className="text-center p-4">
          @copyright 2025 |All rights reserved
        </p>
        <p>Developed by Gachwe</p>
      </div>
    </div>
  );
};

export default Footer;

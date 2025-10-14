import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-white to-gray-200 text-gray-900 dark:bg-gradient-to-tr dark:from-gray-900 dark:to-gray-800 dark:text-gray-200 duration-200">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h1 className="font-bold text-2xl mb-3 text-blue-500 dark:text-blue-400">City-Shine</h1>
          <p className="text-sm mb-4">
            A haven of all your home electronics.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <FaLocationDot />
            <a
              className="text-blue-600 hover:underline dark:text-blue-400"
              href="https://www.google.com/maps/place/Teva+on+time/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Our Location
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h2 className="font-semibold text-blue-500 text-lg mb-3">Shop</h2>
          <nav className="flex flex-col gap-2 text-sm">
            <Link to="/products/:id" className="hover:text-blue-500">All Products</Link>
            <Link to="/new-arrivals" className="hover:text-blue-500">New Arrivals</Link>
            <Link to="/best-sellers" className="hover:text-blue-500">Best Sellers</Link>
            <Link to="/sale" className="hover:text-blue-500">On Sale</Link>
          </nav>
        </div>

       
        {/* Customer Service */}
<div>
  <h2 className="font-semibold  text-blue-500 text-lg mb-3">Customer Service</h2>
  <nav className="flex flex-col gap-2 text-sm">
    <Link to="/help-faq" className="hover:text-blue-500">Help Center</Link>
    <Link to="/return-policy" className="hover:text-blue-500">Returns & Exchanges</Link>
    <Link to="/privacy-policy" className="hover:text-blue-500">Privacy Policy</Link>
    <Link to="/terms-of-service" className="hover:text-blue-500">Terms of Service</Link>
  </nav>
</div>

        {/* Contact */}
        <div>
          <h2 className="font-semibold text-blue-500 text-lg mb-3">Contact Us</h2>
          <div className="flex flex-col gap-2 text-sm">
            <a href="mailto:cityshine254@gmail.com" className="hover:text-blue-500">
              cityshine254@gmail.com
            </a>
            <a href="tel:0114409633" className="hover:text-blue-500">
              011 440 9633
            </a>
            <div className="flex space-x-4 mt-4 text-xl">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:scale-110 transition"><FaFacebook /></a>
              <a href="https://x.com" aria-label="Twitter" className="hover:scale-110 transition"><FaTwitter /></a>
              <a href="https://www.instagram.com/cityshine_electronic?igsh=MW5kMHk0a2NkaDZwbg==" aria-label="Instagram" className="hover:scale-110 transition"><FaInstagram /></a>
              <a href="https://www.tiktok.com/@cityshine1?_t=ZM-8yqVN0WiBGP&_r=1" aria-label="TikTok" className="hover:scale-110 transition"><FaTiktok /></a>
              <a href="https://wa.me/message/CVIX6VY5YDPYB1" aria-label="WhatsApp" className="hover:scale-110 transition"><FaWhatsapp /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-300 dark:border-gray-700 text-center py-4 text-sm">
        <p>&copy; {new Date().getFullYear()}  City-Shine | All rights reserved</p>
        <p className="mt-1 text-gray-500">Developed by Gachwe</p>
      </div>
    </footer>
  );
};

export default Footer;

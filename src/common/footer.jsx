import React, { useEffect, useState } from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from 'axios';
import { uri } from '../constants/constants';
import { Link } from 'react-router-dom';
import Loader from './loader';
import Toaster from './toaster';

function footer() {

    const [footerData, setFooterData] = useState({})

    const [loading, setLoading]=useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchFooterData = async () => {
          try {
              const response = await axios.get(`${uri}/footer-info`);
              const data=response.data.data
              setFooterData(data);
          } catch (error) {
            Toaster(err.response.data.message,"error")
          }
          finally {
            setLoading(false)
          }
      };

      fetchFooterData();
      
    }, [])
    

    return (
      <>
      {loading?(<Loader></Loader>):(<>
        <footer className="bg-gray-900 text-white py-8 px-4 sm:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h2 className="text-xl font-bold">{footerData.name}</h2>
              <p className="text-gray-400 mt-2">
                {footerData.description}
              </p>
              <div className="flex space-x-4 mt-4">
                <a href={footerData.facebook} className="text-gray-400 hover:text-white">
                  {/* Facebook Icon */}
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href={footerData.twitter} className="text-gray-400 hover:text-white">
                  {/* Twitter Icon */}
                  <i className="fab fa-twitter"></i>
                </a>
                <a href={footerData.linkedin} className="text-gray-400 hover:text-white">
                  {/* LinkedIn Icon */}
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href={footerData.instagram} className="text-gray-400 hover:text-white">
                  {/* Instagram Icon */}
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
    
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white">About</Link>
                </li>
                <li>
                  <Link to="/packages" className="text-gray-400 hover:text-white">Pricing & Packages</Link>
                </li>
                <li>
                  <Link to="/contact-us" className="text-gray-400 hover:text-white">Contact</Link>
                </li>
              </ul>
            </div>
    
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center space-x-2">
                  <i className="fas fa-phone-alt"></i>
                  <span>{footerData.phone_no}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-envelope"></i>
                  <span>{footerData.email}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{footerData.address}</span>
                </li>
              </ul>
            </div>
          </div>
    
          {/* Copyright Section */}
          <div className="text-center text-gray-400 mt-8 border-t border-gray-700 pt-4">
            © {new Date().getFullYear()} {footerData.name}. All rights reserved.
          </div>
        </footer></>)}
        </>
      );
}

export default footer
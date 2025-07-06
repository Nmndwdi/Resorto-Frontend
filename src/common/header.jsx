import React from 'react'
import { useState, useEffect } from 'react'
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { uri } from '../constants/constants';
import Loader from './loader';
import Toaster from './toaster';

function header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [loading,setLoading]=useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isSmallScreen = window.innerWidth < 640; // Tailwind's `sm` breakpoint is 640px
            let scrollThreshold=200
            if(window.innerWidth<640) scrollThreshold=160
            else if(window.innerWidth<1200)  scrollThreshold=210
            else scrollThreshold=290
            setIsScrolled(window.scrollY > scrollThreshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [headerData, setHeaderData]=useState({})

    useEffect(() => {
        setLoading(true)
        const fetchHeaderData = async () => {
            try {
                const response = await axios.get(`${uri}/header-info`);
                const data=response.data.data
                setHeaderData(data);
            } catch (error) {
                Toaster(err.response.data.message,"error")
            }
            finally {
                setLoading(false)
            }
        };

        fetchHeaderData();
    }, []);
    

  return (
    
    <header>
        {loading?(<Loader></Loader>):(<>
        {/* navbar started */}
        <div>
            <div className={`sm:hidden fixed top-0 left-0 w-full bg-white shadow-md pb-1 flex justify-between z-50`}>
                <div className="flex flex-col space-y-1.5 p-2 w-8" onClick={() => setIsOpen(!isOpen)}>
                    <span className="w-7 h-[3px] bg-black"></span>
                    <span className="w-7 h-[3px] bg-black"></span>
                    <span className="w-7 h-[3px] bg-black"></span>
                </div>
                <div className={`${isScrolled ? "block" : "hidden"}`}>
                    <img className='w-15 h-10 object-contain' src={headerData.logo} alt="logo" />
                </div>
            </div>
            <div className={`fixed top-10 left-0 w-full p-4 bg-white/90 shadow-lg z-50
    ${isOpen ? "block" : "hidden"} sm:block sm:top-0 sm:p-0`}>
                <div className='sm:flex sm:items-center sm:justify-evenly sm:px-6 sm:py-3 sm:bg-white'>
                    <div className={`${isScrolled ? "sm:block" : "hidden"} hidden fixed left-0`}>
                        <img className='w-15 h-10 object-contain' src={headerData.logo} alt="logo" />
                    </div>
                    <Link to="/">
                        <div className='rounded hover:bg-gray-800 hover:text-white p-2 hover:text-2xl hover:italic duration-500' onClick={() => setIsOpen(!isOpen)}>Home</div>
                    </Link>
                    <Link to="/packages">
                        <div className='rounded hover:bg-gray-800 hover:text-white p-2 hover:text-2xl hover:italic duration-500' onClick={() => setIsOpen(!isOpen)}>Pricing & Packages</div>
                    </Link>
                    <Link to="/gallery">
                        <div className='rounded hover:bg-gray-800 hover:text-white p-2 hover:text-2xl hover:italic duration-500' onClick={() => setIsOpen(!isOpen)}>Gallery</div>
                    </Link>
                    <Link to="/reviews">
                        <div className='rounded hover:bg-gray-800 hover:text-white p-2 hover:text-2xl hover:italic duration-500' onClick={() => setIsOpen(!isOpen)}>Reviews</div>
                    </Link>
                    <Link to="/about">
                        <div className='rounded hover:bg-gray-800 hover:text-white p-2 hover:text-2xl hover:italic duration-500' onClick={() => setIsOpen(!isOpen)}>About</div>
                    </Link>
                    <Link to="/contact-us">
                        <div className='rounded hover:bg-gray-800 hover:text-white p-2 hover:text-2xl hover:italic duration-500' onClick={() => setIsOpen(!isOpen)}>Contact Us!</div>
                    </Link>
                </div>
            </div>
        </div>
        {/* navbar ended */}

        {/* logo started */}
        <div className='sm:flex sm:mt-10 sm:items-center sm:justify-around'>
            <div className='flex justify-center mt-2 sm:p-5'>
                <img className='lg:w-70 pt-10 w-50 h-50 lg:h-70 object-contain' src={headerData.logo} alt="logo" />
            </div>
            <div className="flex justify-center mt-5 sm:p-5">
                <h1 className="xl:text-5xl text-4xl font-bold italic font-[cursive] text-center text-gray-800 tracking-wide">
                    {headerData.title}
                </h1>
            </div>
            <div className="pl-2 text-lg mt-8 sm:p-5">
                <div className='flex flex-row sm:flex-col'>
                    <div className='flex flex-col flex-1'>
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-mobile"></i>
                            <span className=''>{headerData.phone_no}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <i className="fas fa-location-dot"></i>
                            <span className='whitespace-pre-wrap'>{headerData.address}</span>
                        </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg shadow-md sm:mt-3 mr-2 ml-2 sm:ml-0 flex-1">
                        <iframe
                        className="w-full h-20 border-0 rounded-lg shadow-lg"
                        loading="lazy"
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15537.311755276056!2d77.08997786032523!3d28.484848591700565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19305b9f7c19%3A0xdbfd70d4dfff72a6!2sPhase%202%20Metro%20Station!5e0!3m2!1sen!2sin!4v1742985200052!5m2!1sen!2sin">
                        </iframe>
                    </div>
                </div>
            </div>
        </div>

        <div className='mt-3'></div></>)}

    </header>
  )
}

export default header
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { uri } from '../../constants/constants'
import Loader from '../../common/loader'
import Toaster from '../../common/toaster'

function Contact() {

    const [contactData, setContactData]=useState({})

    const [loading,setLoading]=useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchContactData = async () => {
          try {
              const response = await axios.get(`${uri}/contact-info`);
              const data=response.data.data
              setContactData(data)
  
          } catch (error) {
            Toaster(err.response.data.message,"error")
          }
          finally {
            setLoading(false)
          }
      };

      fetchContactData();
      
    }, [])

  return (
    <>
        {loading?(<Loader></Loader>):(<>
        <div className="flex flex-col items-center justify-center h-80 sm:h-120 md:h-140 bg-gray-100">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="ml-2 text-lg text-gray-700 mb-4">Have questions? Chat with us on WhatsApp or give us a call!</p>

            {/* WhatsApp Button */}
            <a 
                href={`https://wa.me/${contactData.whatsApp_number}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 mb-4 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
            >
                Chat on WhatsApp
            </a>

            {/* Call Button */}
            <a 
                href={`tel:${contactData.calling_number}`} 
                className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
            >
                Call Us
            </a>
        </div></>)}
    </>
  )
}

export default Contact
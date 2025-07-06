import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { uri } from '../../constants/constants';
import Loader from '../../common/loader';
import Toaster from '../../common/toaster';

function About() {

  const [aboutData, setAboutData]=useState({})

  const [loading,setLoading]=useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchAboutData = async () => {
          try {
              const response = await axios.get(`${uri}/about-info`);
              const data=response.data.data
              setAboutData(data)
  
          } catch (error) {
            Toaster(err.response.data.message,"error")
          }
          finally {
            setLoading(false)
          }
      };

      fetchAboutData();
      
    }, [])

  return (
    <>
      {loading?(<Loader></Loader>):(<>
      <div className="flex flex-col ml-4 mr-4 sm:ml-8 sm:mr-8">
        <div className="mt-10 p-3 rounded-lg bg-gradient-to-br from-gray-0 to-gray-200 mb-10">
          <h2 className="font-semibold text-3xl mb-10 italic">{aboutData.about_heading}</h2>
          <p className="whitespace-pre-wrap text-gray-700 font-mono text-lg">{aboutData.about_description}</p>
        </div>
      </div></>)}
    </>
  )
}

export default About
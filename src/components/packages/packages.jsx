import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { uri } from '../../constants/constants';
import Loader from '../../common/loader';
import Toaster from '../../common/toaster';

function packages() {

    const [packageData, setPackageData]=useState({})

    const [loading,setLoading]=useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchPackageData = async () => {
            try {
                const response = await axios.get(`${uri}/pricing-info`);
                const data=response.data.data
                setPackageData(data);
            } catch (error) {
              Toaster(err.response.data.message,"error")
            }
            finally {
              setLoading(false)
            }
        };

        fetchPackageData();
    }, []);

    return (
      <>
        {loading?(<Loader></Loader>):(<>
        <div className="sm:ml-8 sm:mr-8 p-2 ml-2 mr-2">
          {/* <h1 className="text-4xl font-semibold text-center mb-6">Packages</h1> */}
    
          {packageData?.main_info?.map((category, index) => (
            <div key={index} className="mb-8 bg-gray-100 p-5 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                {category.heading}
              </h2>
    
              <div className="space-y-4">
                {category.content.map((item) => (
                  <div key={item._id} className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-2xl font-bold italic  text-gray-700">
                      {item.subheading}
                    </h3>
                    <p className="text-lg text-gray-700">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div></>)}
      </>
    );
}

export default packages
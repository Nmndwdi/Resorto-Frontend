import axios from "axios";
import React, { useEffect, useState } from "react";
import { uri } from "../../constants/constants";
import Loader from "../../common/loader";
import Toaster from "../../common/toaster";

function Home() {
  const [index, setIndex] = useState(0);

  const [delay,setDelay] = useState(3000)

  const [loading, setLoading]=useState(false)

  const nextSlide = () => {
    setIndex((index + 1) % n);
  };

  const prevSlide = () => {
    const newIndex = index === 0 ? n - 1 : index - 1;
    setIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, delay);

    return () => clearInterval(interval);
  },);

    const [n,setN]=useState(0)
    const [homeData, setHomeData]=useState({})
    useEffect(() => {
        setLoading(true)
        const fetchHomeData = async () => {
          try {
              const response = await axios.get(`${uri}/home-info`);
              const data=response.data.data
              setHomeData(data)
              setN(data.home_images.length)

          } catch (error) {
            Toaster(err.response.data.message,"error")
          }
          finally {
            setLoading(false)
          }
      };
      fetchHomeData();
      
    }, [])

  return (
    <>
      {loading?(<Loader></Loader>):(
      <><div className="h-80 sm:h-120 md:h-140 p-2 flex justify-center items-center" 
      // onMouseEnter={()=>{setDelay(1000000)}} onMouseLeave={()=>{setDelay(2000)}}
      >
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          {homeData?.home_images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="image"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`} />
          ))}
        </div>
        <button onClick={prevSlide} className="absolute left-5 p-2 bg-gray-800 text-white rounded-full">‹</button>
        <button onClick={nextSlide} className="absolute right-5 p-2 bg-gray-800 text-white rounded-full">›</button>
      </div>
      <div className="flex flex-col lg:flex-row ml-4 mr-4">
        {homeData?.event_options?.map((option, i) => (
          <div className={`m-2 p-2 rounded-lg flex-1 bg-gray-200`} key={i}>
            <h2 className="font-semibold text-3xl mb-3">{option.title}</h2>
            <p className="text-gray-700">{option.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col ml-4 mr-4">
        <div className={`m-2 p-3 border rounded-lg`}>
          <h2 className="font-semibold text-3xl mb-3 italic">{homeData.short_about_heading}</h2>
          <p className="whitespace-pre-wrap text-gray-700 font-mono text-lg">{homeData.short_about_description}</p>
        </div>
      </div>
      
      <div className="p-4 bg-gray-100 rounded-lg shadow-md m-10">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Get Directions</h2>
        <iframe
          className="w-full h-70 sm:h-100 border-0 rounded-lg shadow-lg"
          loading="lazy"
          allowFullScreen=""
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15537.311755276056!2d77.08997786032523!3d28.484848591700565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19305b9f7c19%3A0xdbfd70d4dfff72a6!2sPhase%202%20Metro%20Station!5e0!3m2!1sen!2sin!4v1742985200052!5m2!1sen!2sin">
        </iframe>
      </div></>)}
    </>
  );
}

export default Home;

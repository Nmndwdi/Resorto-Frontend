import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uri } from '../../constants/constants.js';
import { useNavigate } from "react-router-dom";
import { InfoCard } from './widgets/infoCard.jsx';
import LogoUploader from './widgets/logoUploader.jsx';
import HomeImageGallery from './widgets/homeImageGallery.jsx';
import EventOptionsManager from './widgets/eventOptionsManager.jsx';
import MainInfoManager from './widgets/mainInfoManager.jsx';
import GalleryManager from './widgets/galleryManager.jsx';
import ReviewManager from './widgets/reviewManager.jsx';
import Loader, { Loader2 } from '../../common/loader.jsx';
import Toaster from '../../common/toaster.jsx';

function Admin() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [loading2,setLoading2]=useState(false);

  useEffect(() => {
    setLoading(true)
    const validateToken = async () => {
      try {
        const response = await axios.post(`${uri}/api/v1/admin/validate-token`, {}, {
          withCredentials: true
        });

        if (response.status === 200) {
          
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const refreshResponse = await axios.post(`${uri}/api/v1/admin/refresh-access-token`, {}, {
              withCredentials: true, // again, only if using cookies
            });
  
            if (refreshResponse.status === 200) {
              
            } else {
              navigate("/admin/login");
            }
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);
            navigate("/admin/login");
          }
        } else {
          console.error("Token validation failed", error);
          navigate("/admin/login");
        }
      }
      finally {
        setLoading(false);
      }
    };
  
    validateToken();
  }, [])

  const logout = async () => {
    setLoading2(true)
    try {
      const res=await axios.post(`${uri}/api/v1/admin/logout`, {}, { withCredentials: true });
      alert("Logged out successfully");
      navigate("/admin/login");
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading2(false)
    }
  }
  
  return (
  <>
  {loading2?(<Loader2></Loader2>):(<></>)}
  {loading ? (
    <>
    <div className="h-screen flex items-center justify-center">
      <span className="text-gray-600 text-lg font-semibold">Loading Data...</span>
    </div>
    {/* <Loader></Loader> */}
    </>
  ) : (
    <>
      <div className="min-h-screen bg-gray-100">
        {/* Logout button */}
        <div className="flex justify-end p-4">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
  
        {/* InfoCard */}
        <InfoCard/>
        <LogoUploader></LogoUploader>
        <HomeImageGallery></HomeImageGallery>
        <EventOptionsManager></EventOptionsManager>
        <MainInfoManager></MainInfoManager>
        <GalleryManager></GalleryManager>
        <ReviewManager></ReviewManager>
      </div>
    </>)}
    </>
  );  
}
export default Admin
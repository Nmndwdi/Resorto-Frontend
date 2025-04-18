import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uri } from '../../../constants/constants';
import Loader, { Loader2 } from '../../../common/loader';
import Toaster from '../../../common/toaster';

const InfoCard = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading2,setLoading2]=useState(false)

  const [loading, setLoading]=useState(false)

  const [adminData, setAdminData]=useState({
    title: "",
    phone_no: "",
    address: "",
    short_about_heading: "",
    short_about_description: "",
    about_heading: "",
    about_description: "",
    name: "",
    description: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    twitter: "",
    email: "",
    whatsApp_number: "",
    calling_number: "",
  })

  const fetchAdminData = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${uri}/admin-data`);
        const data=response.data.data
        setAdminData({
          title: data.title || "",
          phone_no: data.phone_no || "",
          address: data.address || "",
          short_about_heading: data.short_about_heading || "",
          short_about_description: data.short_about_description || "",
          about_heading: data.about_heading || "",
          about_description: data.about_description || "",
          name: data.name || "",
          description: data.description || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          email: data.email || "",
          whatsApp_number: data.whatsApp_number || "",
          calling_number: data.calling_number || "",
        });

    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading(false)
    }
};

  useEffect(() => {
    fetchAdminData();
  }, [])

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
      const requiredFields = ["title", "phone_no", "address", "name", "calling_number", "whatsApp_number"];
    for (let field of requiredFields) {
      if (!adminData[field]) {
        alert(`${field.replace(/_/g, " ")} is required.`);
        return;
      }
    }
    
    setLoading2(true)
    try {
      const res = await axios.post(`${uri}/api/v1/admin/update-info`, adminData, {withCredentials: true});
      setEditMode(false);
      Toaster(res.data.message,"success")
      // fetchAdminData()
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading2(false)
    }
  };

  return (
    <>
    {loading2?(<Loader2></Loader2>):(<></>)}
    {loading?(<Loader></Loader>):(<>
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      {!editMode ? (
        <>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(adminData).map(([key, value]) => (
              <div key={key}>
                <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </>
      ) : (
        <>
          <form className="grid grid-cols-2 gap-4 text-sm">
            {Object.entries(adminData).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="capitalize text-gray-600 font-medium mb-1">{key.replace(/_/g, ' ')}:</label>
                <input
                  type="text"
                  name={key}
                  value={adminData[key]}
                  onChange={handleChange}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            ))}
          </form>
          <div className="mt-6 text-right">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-2"
            >
              Submit
            </button>
            <button
              onClick={() => {
                setAdminData(adminData);
                setEditMode(false);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div></>)}
    </>
  );
};

export {InfoCard}
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { uri } from '../../../constants/constants';
import Loader, { Loader2 } from '../../../common/loader';
import Toaster from '../../../common/toaster';

const LogoUploader = () => {
  const fileInputRef = useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [loading2, setloading2] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [loading, setLoading]=useState(false)

  const [logo,setLogo]=useState(null)

  const fetchLogoData = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${uri}/admin-data`);
        const data=response.data.data
        setLogo(data.logo || "")

    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading(false)
    }
};

useEffect(() => {
  fetchLogoData();
}, [])

  const handleLogoSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setLogoFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLogoSelect(file);
    }
  };

  const confirmUpdate = async () => {
    if (!logoFile) return;
    setloading2(true);
    setError('');
    setSuccessMessage('');

    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const res = await axios.post(`${uri}/api/v1/admin/update-logo`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(res.data.message || 'Logo updated successfully!');
      setPreviewImage(null);
      setLogoFile(null);
      fetchLogoData()
      Toaster(res.data.message,"success")
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating logo');
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  return (
    <>
      {loading2?(<Loader2></Loader2>):(<></>)}
      {loading?(<Loader></Loader>):(<>
      <div className="p-6 bg-white shadow-md rounded-xl max-w-md mx-auto mt-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Logo</h2>

        <div className="relative w-full max-w-xs mx-auto group border rounded-lg overflow-hidden shadow">
          <img
            src={logo}
            alt="Current Logo"
            className="w-full h-48 object-contain bg-white p-4"
          />
          <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition">
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm rounded"
            >
              Update
            </button>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>

        {loading2 && <p className="text-blue-500 text-center mt-4">Updating...</p>}
        {successMessage && <p className="text-green-600 text-center mt-2">{successMessage}</p>}
        {error && <p className="text-red-600 text-center mt-2">{error}</p>}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-semibold">Preview Updated Logo</h3>
            <img src={previewImage} alt="Preview Logo" className="w-full h-48 object-contain rounded bg-white" />
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setPreviewImage(null);
                  setLogoFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                  }
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </>)}
    </>
  );
};

export default LogoUploader;

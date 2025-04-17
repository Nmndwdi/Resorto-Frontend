import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { uri } from '../../../constants/constants';
import Loader, { Loader2 } from '../../../common/loader';
import Toaster from '../../../common/toaster';

const HomeImageGallery = () => {
  const fileInputRefs = useRef({});
  const [previewImage, setPreviewImage] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [loading2, setloading2] = useState(false);

  const [loading, setLoading] = useState(false); 
  const [images, setImages] = useState([]);

  const fetchHomeImages = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${uri}/admin-data`);
        const data=response.data.data
        setImages(data.home_images || []);
    } catch (err) {
      Toaster(err.response.data.message,"error")

    }
    finally {
      setLoading(false)
    }
};

useEffect(() => {
  fetchHomeImages();
}, [])

  const handleDelete = async (index) => {
    const confirm = window.confirm("Are you sure you want to delete this image?");
    if (!confirm) return;
    setloading2(true)
    try {
      const res=await axios.post(`${uri}/api/v1/admin/remove-from-home-images`, { index }, { withCredentials: true });
      fetchHomeImages()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setloading2(false)
    }
  };

  const handleUpdate = async (index, file) => {
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      setPreviewIndex(index);
    };
    reader.readAsDataURL(file);
  };

  const confirmUpdate = async () => {
    const fileInput = fileInputRefs.current[previewIndex];
    const file = fileInput?.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("index", previewIndex);

    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/update-in-home-images`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreviewImage(null);
      setPreviewIndex(null);
      fetchHomeImages()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleAddImages = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append("home_images", file);
    }

    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/add-in-home-images`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchHomeImages()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  return (
    <>
      {loading2?(<Loader2></Loader2>):(<></>)}
      {loading?(<Loader></Loader>):(<>
      <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Home Image Gallery</h2>
      {loading2 && <p className="text-blue-500 mb-4">Uploading...</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group border rounded-lg overflow-hidden shadow">
            <img
              src={img}
              alt={`Home ${index}`}
              className="w-full h-48 object-cover" />
            <div className="absolute top-2 right-2 flex space-x-2 opacity-50 group-hover:opacity-100 transition">
              <button
                onClick={() => fileInputRefs.current[index].click()}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 text-sm rounded"
              >
                Update
              </button>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={(el) => (fileInputRefs.current[index] = el)}
                onChange={(e) => handleUpdate(index, e.target.files[0])} />
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-sm rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Add Button */}
        <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer rounded-lg h-48 text-gray-500 text-sm font-medium">
          <span className="text-center">+ Add Image(s)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleAddImages} />
        </label>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full space-y-4 text-center">
            <h3 className="text-lg font-semibold">Preview Updated Image</h3>
            <img src={previewImage} alt="Preview" className="w-full h-48 object-cover rounded" />
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
                  setPreviewIndex(null);
                  if (fileInputRefs.current[previewIndex]) {
                    fileInputRefs.current[previewIndex].value = null;
                  }
                } }
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div></>)}
    </>
  );
};

export default HomeImageGallery;

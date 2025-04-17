import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {uri} from '../../../constants/constants.js'
import Loader, { Loader2 } from '../../../common/loader.jsx';
import Toaster from '../../../common/toaster.jsx';

const GalleryManager = () => {

  const [editingTitles, setEditingTitles] = useState({});
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [loading2, setloading2] = useState(false);
  const [expandedGalleryIndex, setExpandedGalleryIndex] = useState(null);
  const fileInputs = useRef({});

  const [loading, setLoading] = useState(false); 
  const [galleries, setGalleries] = useState([]);

  const fetchGalleries = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${uri}/admin-data`);
        const data=response.data.data
        setGalleries(data.gallery || []);

    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading(false)
    }
};

useEffect(() => {
  fetchGalleries();
}, [])

  const handleAddGallery = async () => {
    if (!newGalleryTitle.trim() || newGalleryImages.length === 0) {
      alert('Please provide a title and select images.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newGalleryTitle);
    newGalleryImages.forEach((img) => formData.append('images', img));

    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/add-gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setNewGalleryTitle('');
      setNewGalleryImages([]);

      // Reset the file input manually
      const input = document.getElementById('new-gallery-file');
      if (input) input.value = '';

      fetchGalleries()
      Toaster(res.data.message,"success")
      
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleDeleteGallery = async (index) => {
    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/remove-gallery`, { index }, { withCredentials: true });
      fetchGalleries()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleAddImages = async (index, files) => {
    const formData = new FormData();
    formData.append('index', index);
    Array.from(files).forEach((img) => formData.append('images', img));

    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/add-in-gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      fetchGalleries()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleRemoveImage = async (index, subIndex) => {
    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/remove-from-gallery`, { index, subIndex }, { withCredentials: true });
      fetchGalleries()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleUpdateTitle = async (index, newTitle) => {
    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/update-gallery-title`, { index, title: newTitle }, { withCredentials: true });
      fetchGalleries()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleUpdateImage = async (index, subIndex, file) => {
    const formData = new FormData();
    formData.append('index', index);
    formData.append('subIndex', subIndex);
    formData.append('image', file);

    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/update-in-gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      fetchGalleries()
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
      <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">📸 Gallery Manager</h2>

      {/* Add New Gallery */}
      <div className="mb-8 border border-gray-300 p-4 rounded-lg">
        <h4 className="text-lg font-medium mb-2">Add New Gallery</h4>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="text"
            value={newGalleryTitle}
            onChange={(e) => setNewGalleryTitle(e.target.value)}
            placeholder="New gallery title"
            className="border px-3 py-2 rounded w-full md:w-64" />
          <input
            id="new-gallery-file"
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setNewGalleryImages([...e.target.files])}
            className="w-full md:w-auto" />
          <button
            onClick={handleAddGallery}
            disabled={loading2}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Add Gallery
          </button>
        </div>

        {newGalleryImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {Array.from(newGalleryImages).map((img, idx) => (
              <div key={idx}>
                {img.type.startsWith('video') ? (
                  <video
                    src={URL.createObjectURL(img)}
                    controls
                    className="w-20 h-20 object-cover rounded" />
                ) : (
                  <img
                    src={URL.createObjectURL(img)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Thumbnails / Cards */}
      <div className="flex flex-wrap gap-6">
        {galleries.map((gallery, index) => {
          const isExpanded = expandedGalleryIndex === index;
          return (
            <div
              key={index}
              className={`border border-gray-400 rounded-lg shadow-sm p-4 ${isExpanded ? 'w-full' : 'w-48'}`}
            >
              {!isExpanded ? (
                <div>
                  {gallery.media?.[0]?.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={gallery.media?.[0]}
                      className="w-full h-32 object-cover rounded mb-2"
                      muted
                      controls={false}
                      preload="metadata"
                      onLoadedMetadata={(e) => e.target.currentTime = 0} />
                  ) : (
                    <img
                      src={gallery.media?.[0]}
                      alt="Thumbnail"
                      className="w-full h-32 object-cover rounded mb-2" />
                  )}
                  <h4 className="font-semibold text-center mb-2 truncate">{gallery.title}</h4>
                  <button
                    onClick={() => setExpandedGalleryIndex(index)}
                    className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-1/2">
                      <input
                        type="text"
                        value={editingTitles[index] ?? gallery.title}
                        onChange={(e) => setEditingTitles({ ...editingTitles, [index]: e.target.value })}
                        className="border px-3 py-2 rounded w-full" />
                      <button
                        onClick={() => {
                          const updatedTitle = editingTitles[index] ?? gallery.title;
                          handleUpdateTitle(index, updatedTitle);
                          setEditingTitles((prev) => {
                            const newState = { ...prev };
                            delete newState[index];
                            return newState;
                          });
                        } }
                        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                      >
                        Update Title
                      </button>

                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setExpandedGalleryIndex(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(index)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {gallery.media.map((img, subIndex) => (
                      <div key={subIndex} className="relative w-24">
                        {img.includes('/video/') ? (
                          <video
                            src={img}
                            controls
                            className="w-24 h-24 object-cover rounded" />
                        ) : (
                          <img
                            src={img}
                            alt={`Gallery ${index}`}
                            className="w-24 h-24 object-cover rounded" />
                        )}
                        <div className="flex justify-between mt-1">
                          <button
                            onClick={() => handleRemoveImage(index, subIndex)}
                            className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            ref={(el) => (fileInputs.current[`${index}-${subIndex}`] = el)}
                            className="hidden"
                            onChange={(e) => handleUpdateImage(index, subIndex, e.target.files[0])} />
                          <button
                            onClick={() => fileInputs.current[`${index}-${subIndex}`]?.click()}
                            className="text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleAddImages(index, e.target.files)} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div></>)}
    </>
  );
};

export default GalleryManager;

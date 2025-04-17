import axios from "axios";
import React, { useState,useEffect } from "react";
import { uri } from "../../constants/constants";
import Loader from "../../common/loader";
import Toaster from "../../common/toaster";

// let galleryData = [];

const isVideo = (url) => {
  return url.match(/\.(mp4|webm|ogg)$/i); // you can expand this if needed
};

// Image Popup Component

const ImagePopup = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
    {isVideo(imageUrl) ? (
      <video
        src={imageUrl}
        controls
        autoPlay
        className="max-w-[95vw] max-h-[90vh] object-contain"
      />
    ) : (
      <img
        src={imageUrl}
        alt="Full"
        className="max-w-[95vw] max-h-[90vh] object-contain"
      />
    )}
    <button
      onClick={onClose}
      className="absolute top-4 right-4 bg-white text-black p-2 rounded-full hover:bg-gray-200"
    >
      ✕
    </button>
  </div>
);

// Video & Image Media Renderer
const MediaItem = ({ src, onClick }) => {
  const [isVideo, setIsVideo] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const ext = src?.split('.').pop().toLowerCase();
    setIsVideo(['mp4', 'webm', 'ogg'].includes(ext));
    if (isVideo) setVideoLoading(true);
  }, [src]);

  return (
    <div className="relative w-full h-48 rounded-md overflow-hidden cursor-pointer">
      {isVideo ? (
        <>
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            controls
            onLoadedData={() => setVideoLoading(false)}
            className="w-full h-full object-cover"
            onClick={onClick}
          />
          {videoLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <img
          src={src}
          alt="Gallery"
          className="w-full h-full object-cover"
          onClick={onClick}
        />
      )}
    </div>
  );
};

// Gallery View Component (after clicking a playlist card)
const GalleryView = ({ gallery, onBack }) => {
  const [popupImage, setPopupImage] = useState(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Back to Gallery
      </button>
      <h2 className="text-3xl font-bold mb-4">{gallery.title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {gallery.media.map((src, idx) => (
        <MediaItem key={idx} src={src} onClick={() => setPopupImage(src)} />
      ))}
      </div>

      {popupImage && <ImagePopup imageUrl={popupImage} onClose={() => setPopupImage(null)} />}
    </div>
  );
};

// Playlist Page Component
const GalleryList = ({ galleries, onSelect }) => (
  <div className="p-6 mx-auto">
    {/* <h1 className="text-3xl font-bold mb-6 text-center">Gallery Playlists</h1> */}
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {galleries?.map((g) => (
        <div
          key={g._id}
          className="cursor-pointer bg-white rounded-lg shadow hover:shadow-md transition"
          onClick={() => onSelect(g)}
        >
          <MediaItem src={g.media[0]} />
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800">{g.title}</h2>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Main App
export default function Gallery() {
  const [selectedGallery, setSelectedGallery] = useState(null);

    const [galleryData, setGalleryData]=useState({})

    const [loading,setLoading]=useState(false)

      useEffect(() => {
          setLoading(true)
          const fetchGalleryData = async () => {
            try {
                const response = await axios.get(`${uri}/gallery-info`);
                const data=response.data.data
                setGalleryData(data)
                // galleryData=data.gallery
            } catch (error) {
              Toaster(err.response.data.message,"error")
            }
            finally {
              setLoading(false)
            }
        };
  
        fetchGalleryData();
        
      }, [])

  return (
    <>
      {loading?(<Loader></Loader>):(<>
      <div className="bg-gray-100">
        {!selectedGallery ? (
          <GalleryList galleries={galleryData.gallery} onSelect={setSelectedGallery} />
        ) : (
          <GalleryView gallery={selectedGallery} onBack={() => setSelectedGallery(null)} />
        )}
      </div></>)}
    </>
  );
}

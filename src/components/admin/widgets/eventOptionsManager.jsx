import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { uri } from '../../../constants/constants.js';
import Loader, { Loader2 } from '../../../common/loader.jsx';
import Toaster from '../../../common/toaster.jsx';

const EventOptionsManager = () => {
  
  const [newOption, setNewOption] = useState({ title: '', description: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({ title: '', description: '' });
  const [loading2, setloading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventOptions, setEventOptions] = useState([]);

  const fetchEventOptions = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${uri}/admin-data`);
        const data=response.data.data
        setEventOptions(data.event_options || []);

    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading(false)
    }
};

  useEffect(() => {
    fetchEventOptions();
  }, [])

  const handleAdd = async () => {
    const { title, description } = newOption;
    if (!title && !description) {
      alert("At least one of Title or Description is required.");
      return;
    }
    setloading2(true);
    try {
      const res=await axios.post(`${uri}/api/v1/admin/add-event-option`, { title, description }, { withCredentials: true });
      setNewOption({ title: '', description: '' });
      fetchEventOptions()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleDelete = async (index) => {
    const confirm = window.confirm("Are you sure you want to delete this event option?");
    if (!confirm) return;

    setloading2(true);
    try {
      const res=await axios.post(`${uri}/api/v1/admin/remove-event-option`, { index }, { withCredentials: true });
      fetchEventOptions()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditData(eventOptions[index]);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditData({ title: '', description: '' });
  };

  const confirmEdit = async () => {
    const { title, description } = editData;
    if (!title && !description) {
      alert("At least one of Title or Description is required.");
      return;
    }

    setloading2(true);
    try {
      const res=await axios.post(`${uri}/api/v1/admin/update-event-option`, {
        index: editingIndex,
        title,
        description
      }, { withCredentials: true });

      setEditingIndex(null);
      fetchEventOptions()
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
    <div className="p-6 bg-white rounded shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Manage Event Options</h2>

      {/* Add new */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Title"
          value={newOption.title}
          onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={newOption.description}
          onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleAdd}
          disabled={loading2}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Option
        </button>
      </div>

      {/* List all options */}
      <div className="divide-y">
        {eventOptions.map((opt, index) => (
          <div key={index} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            {editingIndex === index ? (
              <div className="flex flex-col gap-2 w-full md:flex-row md:items-center">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="border px-3 py-2 rounded flex-1"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="border px-3 py-2 rounded flex-1"
                  placeholder="Description"
                />
                <div className="flex gap-2">
                  <button onClick={confirmEdit} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={cancelEdit} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-semibold">{opt.title || <em>No Title</em>}</p>
                  <p className="text-gray-600">{opt.description || <em>No Description</em>}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEditing(index)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(index)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div></>)}
    </>
  );
};

export default EventOptionsManager;

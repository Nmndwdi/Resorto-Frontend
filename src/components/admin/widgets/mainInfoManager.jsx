import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { uri } from '../../../constants/constants';
import Loader, {Loader2} from '../../../common/loader'
import Toaster from '../../../common/toaster';

const MainInfoManager = () => {
  
  const [newBlock, setNewBlock] = useState({
    heading: '',
    content: [{ subheading: '', description: '' }],
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editBlock, setEditBlock] = useState({ heading: '', content: [] });
  const [loading2, setloading2] = useState(false);

  const [loading, setLoading]=useState(false)

  const [mainInfo, setMainInfo] = useState([]);

  const fetchMainInfo = async () => {
    setLoading(true)
    try {
        const response = await axios.get(`${uri}/admin-data`);
        const data=response.data.data
        setMainInfo(data.main_info || []);

    } catch (err) {
      Toaster(err.response.data.message,"error")
    }
    finally {
      setLoading(false)
    }
};

useEffect(() => {
  fetchMainInfo();
}, [])

  const handleAddContentField = () => {
    setNewBlock(prev => ({
      ...prev,
      content: [...prev.content, { subheading: '', description: '' }]
    }));
  };

  const handleRemoveContentField = (index) => {
    const updated = [...newBlock.content];
    updated.splice(index, 1);
    setNewBlock({ ...newBlock, content: updated });
  };

  const handleNewBlockChange = (index, key, value) => {
    const updatedContent = [...newBlock.content];
    updatedContent[index][key] = value;
    setNewBlock({ ...newBlock, content: updatedContent });
  };

  const handleAddBlock = async () => {
    const filteredContent = newBlock.content.filter(
      (item) => item.subheading.trim() !== '' || item.description.trim() !== ''
    );
  
    if (!newBlock.heading && filteredContent.length === 0) {
      alert("At least heading or one valid subcontent is required");
      return;
    }
  
    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/add-main-info`, {
        heading: newBlock.heading,
        content: filteredContent
      }, { withCredentials: true });
  
      setNewBlock({ heading: '', content: [{ subheading: '', description: '' }] });
      fetchMainInfo()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const handleDeleteBlock = async (index) => {
    if (!window.confirm("Are you sure you want to delete this block?")) return;

    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/remove-main-info`, { index }, { withCredentials: true });
      fetchMainInfo()
      Toaster(res.data.message,"success")
    } catch (err) {
      Toaster(err.response.data.message,"error")
    } finally {
      setloading2(false);
    }
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditBlock(JSON.parse(JSON.stringify(mainInfo[index])));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditBlock({ heading: '', content: [] });
  };

  const handleEditContentChange = (index, key, value) => {
    const updated = [...editBlock.content];
    updated[index][key] = value;
    setEditBlock({ ...editBlock, content: updated });
  };

  const handleRemoveEditContentField = (index) => {
    const updated = [...editBlock.content];
    updated.splice(index, 1);
    setEditBlock({ ...editBlock, content: updated });
  };

  const handleAddEditContentField = () => {
    setEditBlock(prev => ({
      ...prev,
      content: [...prev.content, { subheading: '', description: '' }]
    }));
  };

  const handleSaveEdit = async () => {
    const filteredContent = editBlock.content.filter(
      (item) => item.subheading.trim() !== '' || item.description.trim() !== ''
    );
  
    if (!editBlock.heading && filteredContent.length === 0) {
      alert("At least heading or one valid subcontent is required");
      return;
    }
  
    try {
      setloading2(true);
      const res=await axios.post(`${uri}/api/v1/admin/update-main-info`, {
        index: editingIndex,
        heading: editBlock.heading,
        content: filteredContent
      }, { withCredentials: true });
  
      cancelEdit();
      fetchMainInfo()
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
      <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold">Manage Main Info</h2>

      {/* Add New */}
      <div className="space-y-3 border border-gray-200 p-4 rounded">
        <input
          type="text"
          value={newBlock.heading}
          onChange={(e) => setNewBlock({ ...newBlock, heading: e.target.value })}
          placeholder="Heading"
          className="w-full border px-3 py-2 rounded" />
        {newBlock.content.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 relative border p-3 rounded">
            <input
              type="text"
              placeholder="Subheading"
              value={item.subheading}
              onChange={(e) => handleNewBlockChange(index, 'subheading', e.target.value)}
              className="border px-3 py-2 rounded" />
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => handleNewBlockChange(index, 'description', e.target.value)}
              className="border px-3 py-2 rounded" />
            {newBlock.content.length > 1 && (
              <button
                className="absolute top-1 right-1 text-red-500 text-sm"
                onClick={() => handleRemoveContentField(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <button
            onClick={handleAddContentField}
            className="text-blue-600 underline"
          >
            + Add More Subcontent
          </button>
          <button
            onClick={handleAddBlock}
            disabled={loading2}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Block
          </button>
        </div>
      </div>

      {/* List */}
      <div className="divide-y">
        {mainInfo.map((block, index) => (
          <div key={index} className="py-4 space-y-2">
            {editingIndex === index ? (
              <div className="space-y-3 border border-yellow-200 p-4 rounded">
                <input
                  type="text"
                  value={editBlock.heading}
                  onChange={(e) => setEditBlock({ ...editBlock, heading: e.target.value })}
                  className="border px-3 py-2 rounded w-full" />
                {editBlock.content.map((c, i) => (
                  <div key={i} className="flex flex-col gap-2 relative border p-3 rounded">
                    <input
                      type="text"
                      value={c.subheading}
                      onChange={(e) => handleEditContentChange(i, 'subheading', e.target.value)}
                      placeholder="Subheading"
                      className="border px-3 py-2 rounded" />
                    <input
                      type="text"
                      value={c.description}
                      onChange={(e) => handleEditContentChange(i, 'description', e.target.value)}
                      placeholder="Description"
                      className="border px-3 py-2 rounded" />
                    {editBlock.content.length > 1 && (
                      <button
                        className="absolute top-1 right-1 text-red-500 text-sm"
                        onClick={() => handleRemoveEditContentField(i)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddEditContentField}
                  className="text-blue-600 underline"
                >
                  + Add More Subcontent
                </button>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-semibold">{block.heading || <em>No Heading</em>}</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {block.content.map((c, i) => (
                      <li key={i}>
                        <strong>{c.subheading}</strong>: {c.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEdit(index)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlock(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
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

export default MainInfoManager;

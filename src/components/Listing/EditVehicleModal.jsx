import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../config/firebaseConfig';
import { MdOutlineFileUpload } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";

const EditVehicleModal = ({ isEditOpen, setIsEditOpen, vehicleId, onSuccess }) => {
  if (!isEditOpen) return null;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    year: '',
    pricePerDay: '',
    brand: '',
    cchp: '',
    fuelType: '',
    transmissionType: '',
    vehicleType: '',
    location: ''
  });
  const [images, setImages] = useState(['', '', '', '']);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const vehicleRef = doc(db, 'vehicles', vehicleId);
        const vehicleSnap = await getDoc(vehicleRef);
        
        if (vehicleSnap.exists()) {
          const vehicleData = vehicleSnap.data();
          setFormData({
            name: vehicleData.name || '',
            model: vehicleData.model || '',
            year: vehicleData.year || '',
            pricePerDay: vehicleData.pricePerDay || '',
            brand: vehicleData.brand || '',
            cchp: vehicleData.cchp || '',
            fuelType: vehicleData.fuelType || '',
            transmissionType: vehicleData.transmissionType || '',
            vehicleType: vehicleData.vehicleType || '',
            location: vehicleData.location || ''
          });
          setImages(vehicleData.images || ['', '', '', '']);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Error loading vehicle details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (index, file) => {
    if (!file) return;

    const storageRef = ref(storage, `vehicleImages/${Date.now()}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const updatedImages = [...images];
      updatedImages[index] = downloadURL;
      setImages(updatedImages);

      // Store new image for later deletion if needed
      setNewImages(prev => [...prev, { url: downloadURL, ref: storageRef }]);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Image upload failed. Please try again.');
    }
  };

  const handleRemoveImage = async (index) => {
    const updatedImages = [...images];
    const imageToRemove = updatedImages[index];
    
    // If it's a new image, delete it from storage
    const newImage = newImages.find(img => img.url === imageToRemove);
    if (newImage) {
      try {
        await deleteObject(newImage.ref);
        setNewImages(prev => prev.filter(img => img.url !== imageToRemove));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    updatedImages[index] = '';
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const vehicleRef = doc(db, 'vehicles', vehicleId);
      await updateDoc(vehicleRef, {
        ...formData,
        images: images.filter(img => img !== ''),
        updatedAt: new Date()
      });

      toast.success('Vehicle updated successfully!');
      setIsEditOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Failed to update vehicle. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E60000]"></div>
      </div>
    );
  }

  const imageLabels = ["Front", "Side 1", "Side 2", "Back"];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="bg-white p-12 rounded-xl shadow-lg w-7xl font-inter flex flex-col relative animate-fade-in">
        <button
          onClick={() => setIsEditOpen(false)}
          className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-black"
        >
          ✕
        </button>
        <div className="w-full h-auto flex flex-row gap-10">
          <div className="w-full flex flex-col items-center gap-5">
            {/* First (main) image */}
            <div className="w-full max-w-lg h-80 border p-2 relative border-black rounded-lg">
              <span className="text-sm font-medium mb-1 absolute top-5 left-5 block">
                {imageLabels[0]}
              </span>
              {images[0] ? (
                <div className="relative w-full h-full">
                  <img
                    src={images[0]}
                    alt="Uploaded 1"
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(0)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-800"
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-400 rounded-md">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(0, e.target.files[0])}
                  />
                  <MdOutlineFileUpload className="text-2xl text-gray-500" />
                </label>
              )}
            </div>

            {/* Other images */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              {[1, 2, 3].map((index) => (
                <div key={index} className="h-40 border p-2 relative border-black rounded-lg">
                  <span className="text-sm absolute top-5 left-5 font-medium mb-1 block">
                    {imageLabels[index]}
                  </span>
                  {images[index] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={images[index]}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-800"
                        title="Remove Image"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-400 rounded-md">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(index, e.target.files[0])}
                      />
                      <MdOutlineFileUpload className="text-2xl text-gray-500" />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-auto flex flex-col rounded-lg">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Vehicle Brand */}
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Vehicle Brand</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Honda">Honda</option>
                <option value="KYMCO">KYMCO</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Toyota">Toyota</option>
                <option value="Subaru">Subaru</option>
                <option value="Mitsubishi">Mitsubishi</option>
                <option value="Nissan">Nissan</option>
              </select>

              {/* Vehicle Name */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Vehicle Name"
                required
                className="border p-2 rounded"
              />

              {/* Model */}
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Vehicle Model"
                required
                className="border p-2 rounded"
              />

              <input
                min={0}
                type="number"
                name="cchp"
                value={formData.cchp}
                onChange={handleChange}
                placeholder="Vehicle CC or Horsepower"
                required
                className="border p-2 rounded"
              />

              {/* Vehicle Type */}
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Vehicle Type</option>
                <option value="2 Wheels">2 Wheels</option>
                <option value="4 Wheels">4 Wheels</option>
              </select>

              {/* Fuel Type */}
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Fuel Type</option>
                <option value="Gas">Gas</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>

              {/* Transmission Type */}
              <select
                name="transmissionType"
                value={formData.transmissionType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Transmission Type</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>

              {/* Price Per Day */}
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                placeholder="Price Per Day"
                required
                className="border p-2 rounded"
              />

              {/* Location */}
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
                className="border p-2 rounded"
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="bg-[#141414] text-white p-2 rounded duration-300 hover:bg-[#E60000] disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditVehicleModal; 
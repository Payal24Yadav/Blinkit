import React, { useState } from "react";
import { IoClose, IoCloudUploadOutline } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id:data._id,
    name: data.name,
    image: data.image,
    category: data.category,
  });
  const [imageLoading, setImageLoading] = useState(false);

  const allCategory = useSelector((state) => state.product.allCategory);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSubCategoryImage = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      setImageLoading(true);
      const response = await uploadImage(file);
      const { data: ImageResponse } = response;

      if (ImageResponse.success) {
        setSubCategoryData((prev) => ({
          ...prev,
          image: ImageResponse.data.url,
        }));
        toast.success(ImageResponse.message);
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveCategorySelected = (categoryId) => {
    setSubCategoryData((prev) => ({
      ...prev,
      category: prev.category.filter((el) => el._id !== categoryId),
    }));
  };

  const handleSubmitSubCategory = async (e) => {
    e.preventDefault(); // Prevent page refresh
    
    // Basic Validation
    if(!subCategoryData.name || !subCategoryData.image || subCategoryData.category.length === 0) {
        toast.error("Please fill all fields");
        return;
    }

    try {
      const response = await Axios({
        ...SummaryApi.updateSubCategory,
        data: subCategoryData,
      });
      
      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) close();
        if(fetchData){
            fetchData()
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#FDFCF0] border border-stone-200 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white/50">
          <h1 className="text-2xl font-black text-stone-900 tracking-tighter">
            Edit Sub Category<span className="text-amber-500">.</span>
          </h1>
          <button
            onClick={close}
            className="p-2 hover:bg-amber-100 rounded-full text-stone-600 transition-all hover:rotate-90"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmitSubCategory}>
          {/* Sub Category Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">
              Sub Category Name
            </label>
            <input
              id="name"
              name="name"
              required
              placeholder="e.g. Full Cream Milk"
              value={subCategoryData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-stone-800"
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">
              Upload Layout
            </label>
            <div className="relative group">
              <label
                htmlFor="uploadSubCategoryImage"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50/50 hover:bg-amber-50/50 hover:border-amber-400 transition-all cursor-pointer overflow-hidden"
              >
                {imageLoading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-xs font-bold text-amber-600">Uploading...</p>
                  </div>
                ) : subCategoryData.image ? (
                  <img
                    alt="subCategory"
                    src={subCategoryData.image}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <div className="flex flex-col items-center text-stone-400 group-hover:text-amber-500">
                    <IoCloudUploadOutline size={40} className="mb-2" />
                    <p className="text-sm font-bold">Drop image or click to browse</p>
                  </div>
                )}
                <input
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  onChange={handleUploadSubCategoryImage}
                />
              </label>
            </div>
          </div>

          {/* Category Select Dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-stone-500 ml-1">
              Select Category
            </label>
            
            {/* Display Selected Categories as Pills */}
            <div className="flex flex-wrap gap-2 mb-2">
                {subCategoryData.category.map((cat) => (
                    <div 
                        key={cat._id} 
                        className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg border border-amber-200 text-sm font-bold"
                    >
                        {cat.name}
                        <IoClose 
                            className="cursor-pointer hover:text-red-500" 
                            onClick={() => handleRemoveCategorySelected(cat._id)} 
                        />
                    </div>
                ))}
            </div>

            <div className="relative">
              <select
                className="w-full appearance-none px-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-stone-700 cursor-pointer"
                value="" // Reset to placeholder after selection
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find((el) => el._id === value);
                  
                  // Check if already added
                  const isAlreadyAdded = subCategoryData.category.some(el => el._id === value);
                  
                  if(categoryDetails && !isAlreadyAdded) {
                      setSubCategoryData((prev) => ({
                        ...prev,
                        category: [...prev.category, categoryDetails],
                      }));
                  }
                }}
              >
                <option value="" disabled>Select a main category</option>
                {allCategory.map((category) => (
                  <option value={category._id} key={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={imageLoading}
            className="w-full py-4 bg-amber-500 hover:bg-stone-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-stone-900/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {imageLoading ? "Processing..." : "Add Sub Category"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;
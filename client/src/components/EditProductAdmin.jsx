import React, { useState } from "react";
import { IoCloudUploadOutline, IoClose, IoAddCircleOutline } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import ViewImage from "../components/ViewImage";
import { useSelector } from "react-redux";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const EditProductAdmin = ({ close, data: propsData, fetchProductData }) => {
  const [data, setData] = useState({
  _id: propsData._id,
  name: propsData.name || "",
  image: propsData.image || [],
  category: propsData.category || [],
  subCategory: propsData.subCategory || [],
  unit: propsData.unit || "",   // ✅ FIX
  stock: propsData.stock || 0,
  price: propsData.price || 0,
  discount: propsData.discount || 0,
  description: propsData.description || "",
  more_details: propsData.more_details || {},
});

  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setImageLoading(true);
      const response = await uploadImage(file);
      const imageUrl = response.data.data.url;
      setData((prev) => ({ ...prev, image: [...prev.image, imageUrl] }));
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setData((prev) => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
  };

  const handleRemoveCategory = (index) => {
    const updated = [...data.category];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, category: updated }));
  };

  const handleRemoveSubCategory = (index) => {
    const updated = [...data.subCategory];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, subCategory: updated }));
  };

  const handleAddField = () => {
    if(!fieldName) return;
    setData((prev) => ({ ...prev, more_details: { ...prev.more_details, [fieldName]: "" } }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateProductDetails,
        data: data,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        successAlert(responseData.message);
        if (close) close();
        if (fetchProductData) fetchProductData();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-50 w-full max-w-5xl rounded-[2.5rem] p-6 md:p-10 relative shadow-2xl overflow-y-auto max-h-[95vh] no-scrollbar">
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-700 tracking-tight">Edit Product</h1>
            <p className="text-[11px] text-amber-600/60 uppercase tracking-[0.2em] font-black">Admin Inventory Panel</p>
          </div>
          <button 
            onClick={close} 
            className="p-2 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-all border border-stone-100"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          
          {/* Left Column: Core Info */}
          <div className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Product Name</label>
              <input 
                name="name" 
                type="text" 
                value={data.name} 
                onChange={handleChange} 
                className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 text-sm font-bold text-slate-700 transition-all" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Description</label>
              <textarea 
                name="description" 
                rows={4} 
                value={data.description} 
                onChange={handleChange} 
                className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 text-sm font-medium text-slate-600 resize-none transition-all leading-relaxed" 
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Price (₹)</label>
                <input name="price" type="number" value={data.price} onChange={handleChange} className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none focus:border-amber-400 text-sm font-black text-slate-800" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Discount (%)</label>
                <input name="discount" type="number" value={data.discount} onChange={handleChange} className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none focus:border-amber-400 text-sm font-black text-amber-600" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Stock Quantity</label>
                <input name="stock" type="number" value={data.stock} onChange={handleChange} className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none focus:border-amber-400 text-sm font-black text-slate-800" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Unit (e.g. kg, pc)</label>
                <input name="unit" type="text" value={data.unit} onChange={handleChange} className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none focus:border-amber-400 text-sm font-black text-slate-600" />
              </div>
            </div>
          </div>

          {/* Right Column: Media & Categories */}
          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest mb-3 block ml-1">Product Media</label>
              <div className="flex flex-wrap gap-3 p-4 bg-white rounded-[2rem] border border-stone-100 shadow-inner">
                <label className="w-16 h-16 border-2 border-dashed border-amber-200 rounded-2xl flex flex-col items-center justify-center bg-amber-50/30 hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer group">
                  {imageLoading ? (
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IoCloudUploadOutline size={20} className="text-amber-400 group-hover:scale-110 transition-transform" />
                  )}
                  <input onChange={handleUploadImage} type="file" className="hidden" accept="image/*" />
                </label>
                {data.image.map((img, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-1xl overflow-hidden border border-stone-100 bg-white group shadow-sm">
                    <img src={img} alt="p" onClick={() => setViewImageURL(img)} className="w-full h-full object-contain p-1 cursor-zoom-in" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IoClose size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Category</label>
              <select 
                className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none text-sm font-bold text-slate-700" 
                value={selectCategory} 
                onChange={(e) => {
                  const category = allCategory.find((el) => el._id === e.target.value);
                  if (category) setData((prev) => ({ ...prev, category: [...prev.category, category] }));
                  setSelectCategory("");
                }}
              >
                <option value="">Choose Category</option>
                {allCategory.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.category.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase border border-amber-200 shadow-sm">
                    {c.name} <IoClose className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveCategory(i)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest ml-1">Sub Category</label>
              <select 
                className="bg-white p-3.5 border border-stone-200 rounded-2xl outline-none text-sm font-bold text-slate-700" 
                value={selectSubCategory} 
                onChange={(e) => {
                  const sub = allSubCategory.find((el) => el._id === e.target.value);
                  if (sub) setData((prev) => ({ ...prev, subCategory: [...prev.subCategory, sub] }));
                  setSelectSubCategory("");
                }}
              >
                <option value="">Choose Sub Category</option>
                {allSubCategory.map((c, i) => <option key={i} value={c._id}>{c.name}</option>)}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.subCategory.map((c, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black flex items-center gap-2 uppercase border border-slate-200 shadow-sm">
                    {c.name} <IoClose className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveSubCategory(i)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => setOpenAddField(true)} 
                className="w-50 border-2 border-dashed border-amber-200 text-amber-600/60 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <IoAddCircleOutline size={18} /> Add Custom Specs
              </button>
              
              <div className="mt-4 grid grid-cols-1 gap-4">
                {Object.keys(data.more_details).map((k) => (
                  <div key={k} className="flex flex-col gap-1 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm relative">
                    <label className="text-[9px] font-black text-amber-600/50 uppercase tracking-widest ml-1">{k}</label>
                    <input 
                      type="text" 
                      value={data.more_details[k]} 
                      onChange={(e) => setData(prev => ({ ...prev, more_details: { ...prev.more_details, [k]: e.target.value } }))} 
                      className="w-full bg-transparent border-none px-1 outline-none text-xs font-bold text-slate-700" 
                    />
                    <button 
                        type="button"
                        onClick={() => {
                            const updatedDetails = {...data.more_details};
                            delete updatedDetails[k];
                            setData(prev => ({...prev, more_details: updatedDetails}))
                        }}
                        className="absolute top-2 right-2 text-stone-300 hover:text-red-500"
                    >
                        <IoClose size={14}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6 border-t border-stone-200 flex justify-center">
            <button 
              type="submit" 
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-white px-16 py-4 rounded-[1.5rem] text-sm font-black transition-all shadow-xl shadow-amber-200/50 uppercase tracking-widest active:scale-95"
            >
              Update Product Details
            </button>
          </div>
        </form>
      </div>

      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}
      {openAddField && (
        <AddFieldComponent 
          close={() => setOpenAddField(false)} 
          value={fieldName} 
          onChange={(e) => setFieldName(e.target.value)} 
          submit={handleAddField} 
        />
      )}
    </section>
  );
};

export default EditProductAdmin;
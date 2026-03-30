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

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "", image: [], category: [], subCategory: [],
    unit: "", stock: "", price: "", discount: "",
    description: "", more_details: {},
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [ViewImageURL, setViewImageURL] = useState("");
  const allCategory = useSelector(state => state.product.allCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const allSubCategory = useSelector(state => state.product.allSubCategory);
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
    } catch (error) { console.error(error); } finally { setImageLoading(false); }
  };

  const handleRemoveImage = (index) => {
    setData((prev) => ({ ...prev, image: prev.image.filter((_, i) => i !== index) }));
  };

  const handleRemoveCategory = (index) => {
    const updated = [...data.category];
    updated.splice(index, 1);
    setData(prev => ({ ...prev, category: updated }));
  };

  const handleRemoveSubCategory = (index) => {
    const updated = [...data.subCategory];
    updated.splice(index, 1);
    setData(prev => ({ ...prev, subCategory: updated }));
  };

  const handleAddField = () => {
    setData(prev => ({ ...prev, more_details: { ...prev.more_details, [fieldName]: "" } }));
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try{
      const response= await Axios({
        ...SummaryApi.createProduct,
        data: data
      })

      const {data: responseData}= response

      if(responseData.success){

        successAlert(responseData.message)
        setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })
      }
    } catch(error){
      AxiosToastError(error)
    }
    
  }

  return (
    <section className="p-3 md:p-6 bg-stone-50 min-h-screen">
      {/* Container - Removed White Background, Shadow, and Border */}
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-6 border-b border-stone-200 pb-3 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-stone-800">Upload Product</h1>
            <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Inventory Management</p>
          </div>
         
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Product Name</label>
              <input name="name" type="text" placeholder="Enter name" value={data.name} onChange={handleChange} className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-medium" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Description</label>
              <textarea name="description" rows={3} placeholder="Details..." value={data.description} onChange={handleChange} className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm resize-none font-medium" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Price (₹)</label>
                <input name="price" type="number" value={data.price} onChange={handleChange} className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-bold" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Discount (%)</label>
                <input name="discount" type="number" value={data.discount} onChange={handleChange} className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-bold" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Stock</label>
                <input name="stock" type="number" value={data.stock} onChange={handleChange} className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-bold" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Unit</label>
                <input name="unit" type="text" placeholder="kg/pc" value={data.unit} onChange={handleChange} className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-bold" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest mb-2 block">Images</label>
              <div className="flex flex-wrap gap-2 p-2 bg-stone-100/50 rounded-xl border border-stone-200">
                <label className="w-14 h-14 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-amber-50 hover:border-amber-300 transition-all cursor-pointer">
                  {imageLoading ? <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /> : <IoCloudUploadOutline size={18} className="text-stone-300" />}
                  <input onChange={handleUploadImage} type="file" className="hidden" accept="image/*" />
                </label>
                {data.image.map((img, index) => (
                  <div key={index} className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-200 bg-white">
                    <img src={img} alt="p" onClick={() => setViewImageURL(img)} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5"><IoClose size={10}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Category</label>
              <select className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none text-sm font-medium" value={selectCategory} onChange={(e) => {
                const category = allCategory.find(el => el._id === e.target.value);
                if(category) setData(prev => ({...prev, category: [...prev.category, category._id]}));
                setSelectCategory("");
              }}>
                <option value="">Choose Category</option>
                {allCategory.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.category.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[9px] font-black flex items-center gap-1 uppercase border border-amber-200">
                    {c.name} <IoClose className="cursor-pointer" onClick={() => handleRemoveCategory(i)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-black text-stone-400 tracking-widest">Sub Category</label>
              <select className="bg-stone-100/50 p-2.5 border border-stone-200 rounded-xl outline-none text-sm font-medium" value={selectSubCategory} onChange={(e) => {
                const sub = allSubCategory.find(el => el._id === e.target.value);
                if(sub) setData(prev => ({...prev, subCategory: [...prev.subCategory, sub._id]}));
                setSelectSubCategory("");
              }}>
                <option value="">Choose Sub Category</option>
                {allSubCategory.map((c, i) => <option key={i} value={c._id}>{c.name}</option>)}
              </select>
              <div className="flex flex-wrap gap-1 mt-1">
                {data.subCategory.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 bg-stone-200/50 text-stone-700 rounded-md text-[9px] font-black flex items-center gap-1 uppercase border border-stone-200">
                    {c.name} <IoClose className="cursor-pointer" onClick={() => handleRemoveSubCategory(i)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button type="button" onClick={() => setOpenAddField(true)} className="w-full border-2 border-dashed border-stone-200 text-stone-400 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-amber-300 hover:text-amber-500 transition-all flex items-center justify-center gap-2">
                <IoAddCircleOutline size={16}/> Add Fields
              </button>
              <div className="mt-3 space-y-2">
                {Object.keys(data.more_details).map((k) => (
                  <div key={k} className="flex flex-col gap-1">
                    <label className="text-[9px] font-black text-stone-400 uppercase tracking-tighter ml-1">{k}</label>
                    <input type="text" value={data.more_details[k]} onChange={(e) => setData(prev => ({ ...prev, more_details: { ...prev.more_details, [k]: e.target.value } }))} className="w-full bg-transparent border-b border-stone-200 px-2 py-1 outline-none focus:border-amber-400 text-xs font-bold" />
                  </div>
                ))}
              </div>
            </div>
          </div>
           <button 
             type="submit"
           className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-100 uppercase tracking-widest">
            Submit
          </button>
        </form>
      </div>

      {ViewImageURL && <ViewImage url={ViewImageURL} close={() => setViewImageURL("")} />}
      {openAddField && (
        <AddFieldComponent close={() => setOpenAddField(false)} value={fieldName} onChange={(e) => setFieldName(e.target.value)} submit={handleAddField} />
      )}
    </section>
  );
};

export default UploadProduct;
import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Added icons
import { IoClose } from 'react-icons/io5';
import AxiosToastError from '../utils/AxiosToastError';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
const ProductCardAdmin = ({data, fetchProductData}) => {
  const [editOpen , setEditOpen]= useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleDeleteCancel=()=>{
    setOpenDelete(false)
  }
  const handleDelete=async()=>{
    try{
      const response = await Axios({
        ...SummaryApi.deleteProduct,
        data:{
          _id: data._id
        }
      })
      const {data: responseData}= response
      if(responseData.success){
        toast.success(responseData.message)
        if(fetchProductData){
          fetchProductData()
        }
        setOpenDelete(false)
      }
    } catch(error){
      AxiosToastError(error)
    }
  }
  return (
    <div className="group bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-amber-400 transition-all duration-300">
      {/* Image Container */}
      <div className="aspect-square bg-stone-50 border-b border-stone-100 p- overflow-hidden">
        <img 
          src={data?.image[0]} 
          alt={data?.name} 
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      {/* Info Content */}
      <div className="p-3 space-y-2">
        <p className="text-xs font-bold text-stone-800 truncate" title={data?.name}>
          {data?.name}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[9px] font-black uppercase border border-amber-200">
            {data?.unit}
          </span>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">
            Stock: {data?.stock || 0}
          </span>
        </div>
      </div>
      {/* Action Buttons: Clean & Balanced */}
      <div className="p-3 bg-stone-50/50 flex items-center gap-2 border-t border-stone-100">
        <button 
          onClick={() => setEditOpen(true)}
          className='flex-1 flex items-center justify-center gap-2 bg-white text-amber-600 py-2.5 rounded-xl text-xs font-black border border-amber-200 hover:bg-amber-500 hover:text-white transition-all shadow-sm active:scale-95'
        >
          <FaEdit size={14}/> EDIT
        </button>
        
        <button 
        onClick={()=>setOpenDelete(true)}
        className='flex-1 flex items-center justify-center gap-2 bg-white text-red-500 py-2.5 rounded-xl text-xs font-black border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95'>
          <FaTrashAlt size={12}/> DELETE
        </button>
      </div>
      {
        editOpen && (
          <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=> setEditOpen(false)}/>
        )
      }

    {
  openDelete && (
    <section className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-amber-50 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-slate-700 tracking-tight">
            Permanent Delete?
          </h3>
          <button 
            onClick={() => setOpenDelete(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <IoClose size={24}/>
          </button>
        </div>

        {/* Body Text */}
        <div className="mb-8">
          <p className="text-slate-500 font-medium leading-relaxed">
            Are you sure you want to delete this product? This action <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">cannot</span> be undone.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDeleteCancel}
            className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleDelete}
            className="flex-1 px-6 py-3.5 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            Delete Now
          </button>
        </div>

      </div>
    </section>
  )
}
    </div>
  )
}

export default ProductCardAdmin
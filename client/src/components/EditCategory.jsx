
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import uploadImage from '../utils/UploadImage';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';


const EditCategory = ({close, fetchData, data:CategoryData}) => {
   const [data, setData] = useState({ 
    _id:CategoryData._id,
    name: CategoryData.name,
     image: CategoryData.image });

    const [loading, setLoading] = useState(false);
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadCategoryImage =async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const response=await uploadImage(file)
        const{data:ImageResponse}=response
        setData((prev)=>{
            return {
                ...prev,
                image:ImageResponse.data.url
            }
        })
        console.log(response);
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
       try{
        setLoading(true);
        const response = await Axios({
            ...SummaryApi.updateCategory,
            data:data
        })
        const {data:responseData} =response;
        if(responseData.success){
            toast.success(responseData.message);
            fetchData(); 
            close();
        }
       } catch(err){
        AxiosToastError(err);
       }finally{
        setLoading(false);
       }
        
    };
  return (
         <section className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
             <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
                 <div className="flex items-center justify-between p-4 border-b border-stone-100">
                     <h1 className="font-bold text-stone-800">Upload Category</h1>
                     <button onClick={close} className="p-1 hover:bg-stone-100 rounded-full text-stone-600">
                         <IoClose size={24} />
                     </button>
                 </div>
 
                 <form onSubmit={handleSubmit} className="p-5 space-y-4">
                     <div>
                         <label className="text-sm font-medium text-stone-700">Name</label>
                         <input 
                             type="text"
                             name="name"
                             value={data.name}
                             onChange={handleOnChange}
                             placeholder='Enter category name'
                             className="w-full mt-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                             required
                         />
                     </div>
 
                     <div>
                         <label className="text-sm font-medium text-stone-700">Category Image</label>
                         <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 rounded-lg p-4 bg-stone-50 hover:bg-amber-50/30 transition-colors">
                             {data.image ? (
                                 <img src={data.image} alt="preview" className="w-full h-32 object-contain rounded-md mb-2" />
                             ) : (
                                 <p className="text-xs text-stone-400 mb-2">No image selected</p>
                             )}
                             <input 
                                 type="file" 
                                 accept="image/*" 
                                 onChange={handleUploadCategoryImage}
                                 className="text-xs text-stone-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 cursor-pointer"
                             />
                         </div>
                     </div>
 
                     <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md transition-all">
                         {loading ? "Updating..." : "Upload Category"}
                     </button>
                 </form>
             </div>
         </section>
     );
}

export default EditCategory
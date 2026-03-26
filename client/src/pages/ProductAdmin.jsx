import React, { useEffect, useState } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import ProductCardAdmin from '../components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5"; // Added for theme consistency

const ProductAdmin = () => {
  const [productData,setProductData] = useState([])
  const [page,setPage] = useState(1)
  const [loading,setLoading] = useState(false)
  const [totalPageCount,setTotalPageCount] = useState(1)
  const [search,setSearch] = useState("")
  
  const fetchProductData = async()=>{
    try {
        setLoading(true)
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
              limit : 12,
              search : search 
           }
        })

        const { data : responseData } = response 

        if(responseData.success){
          setTotalPageCount(responseData.totalNoPage)
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page !== totalPageCount){
      setPage(preve => preve + 1)
    }
  }
  const handlePrevious = ()=>{
    if(page > 1){
      setPage(preve => preve - 1)
    }
  }

  const handleOnChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }

  useEffect(()=>{
    let flag = true 

    const interval = setTimeout(() => {
      if(flag){
        fetchProductData()
        flag = false
      }
    }, 300);

    return ()=>{
      clearTimeout(interval)
    }
  },[search])
   
  return (
    <section className="p-3 md:p-6 bg-stone-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header - Matching your UploadProduct Style */}
        <div className="mb-6 border-b border-stone-200 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-800">Product List</h1>
            <p className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Inventory Management</p>
          </div>

          <div className="relative w-full md:w-72">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16}/>
            <input 
              type="text" 
              placeholder="Search inventory..." 
              value={search}
              onChange={handleOnChange}
              className="w-full bg-stone-100/50 pl-10 pr-4 py-2 border border-stone-200 rounded-xl outline-none focus:border-amber-400 text-sm font-medium transition-all"
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <Loading/>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {productData.map((p, index) => (
            <ProductCardAdmin key={p._id || index} data={p} fetchProductData={fetchProductData}/>
          ))}
        </div>

        {/* Pagination - Stone Theme */}
        <div className="mt-10 flex items-center justify-center gap-6 border-t border-stone-200 pt-6">
          <button 
            onClick={handlePrevious} 
            disabled={page === 1}
            className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-500 disabled:opacity-30 transition-all"
          >
            Previous
          </button>
          <span className="text-[12px] font-bold text-stone-800 bg-white px-4 py-1 rounded-full border border-stone-200 shadow-sm">
            {page} <span className="text-stone-300 mx-1">/</span> {totalPageCount}
          </span>
          <button 
            onClick={handleNext} 
            disabled={page === totalPageCount}
            className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-amber-500 disabled:opacity-30 transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductAdmin
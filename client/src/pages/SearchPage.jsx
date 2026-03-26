import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading';
import CardProduct from '../components/CardProduct'; // ✅ Product Card import
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useLocation } from 'react-router-dom'; // ✅ Query nikalne ke liye

const SearchPage = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  
  const params = useLocation()
  const searchText = new URLSearchParams(params?.search).get("q") // ✅ URL se search text nikalna

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText || "", // ✅ Dynamic search text
          page: page
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page === 1) {
          setData(responseData.data)
        } else {
          setData((prev) => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Jab bhi search text badle, page 1 kar do aur naya data lao
  useEffect(() => {
    setPage(1)
    setData([]) // Clear old data
  }, [searchText])

  useEffect(() => {
    fetchData()
  }, [page, searchText])

  // ✅ Infinite Scroll Logic (Optionally use this or a "Load More" button)
  const handleScroll = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2 && !loading && page < totalPage) {
        setPage(prev => prev + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading])

  return (
    <section className='bg-white min-h-[80vh]'>
      <div className='container mx-auto p-4'>
        {/* Result Summary */}
        <div className='flex items-center gap-2 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100'>
          <h2 className='font-black text-slate-800 tracking-tight'>Search Results:</h2>
          <span className='bg-amber-500 text-white px-3 py-0.5 rounded-full text-xs font-bold'>
            {data.length}
          </span>
          {searchText && (
            <p className='text-sm text-slate-500 font-medium italic'>for "{searchText}"</p>
          )}
        </div>

        {/* Grid Layout */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
          {
            data.map((p, index) => (
              <CardProduct 
                data={p} 
                key={p._id + "searchProduct" + index} 
              />
            ))
          }

          {/* Skeletons while loading */}
          {
            loading && (
              loadingArrayCard.map((_, index) => (
                <CardLoading key={"loadingsearchpage" + index} />
              ))
            )
          }
        </div>

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className='flex flex-col items-center justify-center py-20 text-center'>
            <p className='text-lg font-bold text-slate-400'>No products found.</p>
            <p className='text-sm text-slate-300'>Try searching for something else!</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage
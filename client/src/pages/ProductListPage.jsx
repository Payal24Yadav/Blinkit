import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams, useNavigate } from 'react-router-dom' // Added useNavigate for dynamic clicks
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { validateURLConvert } from '../utils/valideURLConvert'

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const navigate = useNavigate()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])

  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")

  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]

  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductdata()
  }, [params])

  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  return (
    <section className="bg-white">
      {/* flex class use ki hai taaki left aur right chipak kar sahi position pe rahein */}
      <div className="flex items-start">
        
        {/* Left Sidebar - Width fixed rakhi hai taaki layout na bigde */}
        <div className="w-[90px] md:w-[240px] lg:w-[280px] sticky top-20 h-[calc(100vh-80px)] border-r border-stone-100 overflow-y-auto no-scrollbar bg-stone-50/50 flex-shrink-0">
          {DisplaySubCatory.map((s, index) => {
            const isActive = subCategoryId === s._id
            const link = `/${validateURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${validateURLConvert(s.name)}-${s._id}`

            return (
              <Link
                to={link}
                key={s._id + "sidebar"}
                className={`flex flex-col md:flex-row items-center gap-2 p-3 transition-all relative group ${
                  isActive 
                  ? "bg-white border-r-4 border-amber-500 shadow-sm" 
                  : "hover:bg-stone-100"
                }`}
              >
                <div className={`w-12 h-12 md:w-10 md:h-10 rounded-lg overflow-hidden border bg-white flex-shrink-0 ${isActive ? "border-amber-200" : "border-stone-100"}`}>
                  <img src={s.image} alt={s.name} className="w-full h-full object-contain p-1" />
                </div>
                <p className={`text-[10px] md:text-sm text-center md:text-left font-bold leading-tight ${isActive ? "text-amber-600" : "text-stone-500"}`}>
                  {s.name}
                </p>
              </Link>
            )
          })}
        </div>

        {/* Right Content - flex-1 ka matlab hai bachi hui poori jagah iski hai */}
        <div className="flex-1 p-4 md:p-6 min-h-screen">
          <div className="flex items-center justify-between mb-6 sticky top-20 bg-white/80 backdrop-blur-md z-10 py-2 border-b border-stone-100">
            <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs md:text-base px-2">
              {subCategoryName} <span className="text-stone-300 font-medium ml-2">({data.length})</span>
            </h3>
          </div>

          {/* Product Grid - Automatically adjusts columns based on available space */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2">
            {data.map((p, index) => (
              <CardProduct
                data={p}
                key={p._id + "productSubCategory" + index}
              />
            ))}
          </div>

          {/* Loading & Empty State */}
          {loading && (
            <div className="flex justify-center my-10">
              <Loading />
            </div>
          )}
          
          {!loading && data.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <img src="/images/empty-cart.png" className="w-32" alt="empty" />
                <p className="font-bold text-stone-500 mt-4">No products found in this category</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ProductListPage
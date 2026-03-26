import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { validateURLConvert } from "../utils/valideURLConvert";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingCardNumber = new Array(6).fill(null);
  const containerRef = useRef();
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  
  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };

  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const handleRedirectProductListpage = () => {
   

   if (!subCategoryData.length) return "/";
    
    const subcategory = subCategoryData.find((sub) => 
      sub.category.some((c) => c._id === id)
    );

    if (!subcategory) return "/";

    return `/${validateURLConvert(name)}-${id}/${validateURLConvert(subcategory?.name)}-${subcategory?._id}`;
  };

  return (
    <div className="container mx-auto px-4 my-8 relative group">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="font-bold text-stone-800 md:text-xl tracking-tight">
          {name}
        </h3>
        <Link to={handleRedirectProductListpage()} className="text-amber-600 hover:text-amber-700 text-sm font-black uppercase tracking-widest transition-all">
          See all
        </Link>
      </div>

      <div className="relative" ref={containerRef}>
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4">
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading key={"CategorywiseProductDisplay123" + index} />
            ))}
          {data.map((p, index) => (
            <CardProduct
              data={p}
              key={p._id + "CategorywiseProductDisplay" + index}
            />
          ))}
        </div>

        {/* Navigation Buttons - Appear on hover */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full left-0 hidden lg:flex justify-between pointer-events-none px-2">
          <button
            onClick={handleScrollLeft}
            className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-stone-100 pointer-events-auto hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-all opacity-0 group-hover:opacity-100 -ml-5"
          >
            <FaAngleLeft size={20} />
          </button>
          <button
            onClick={handleScrollRight}
            className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center border border-stone-100 pointer-events-auto hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-all opacity-0 group-hover:opacity-100 -mr-5"
          >
            <FaAngleRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;

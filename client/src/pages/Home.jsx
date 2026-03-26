import React from "react";
import { useSelector } from "react-redux";
import { validateURLConvert } from "../utils/valideURLConvert";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    console.log(id, cat);

    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });
      return filterData ? true : null;
    });
console.log(subcategory);

    const url = `/${validateURLConvert(cat)}-${id}/${validateURLConvert(subcategory.name)}-${subcategory._id}`;
    navigate(url);
    console.log(url);
  };

  return (
    <section className="bg-stone-30 min-h-screen">
      {/* Banner Section - Increased Height and adjusted for full visibility */}
      <div className="container mx-auto px-4 mt-4">
        <div className="w-full h-[400px] md:h-[650px] rounded-2xl overflow-hidden shadow-sm">
          <img
            src="/images/blinkitbanner.png"
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
     {/* Category Section */}
      <div className="container mx-auto px-4 mt-8 relative z-30">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-800 bg-white px-5 py-2.5 rounded-full border border-stone-200 shadow-sm">
            Shop By Category
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
          {loadingCategory
            ? new Array(20).fill(null).map((_, index) => (
                <div key={index + "loadingcategory"} className="min-w-[90px] md:min-w-[110px] animate-pulse">
                  <div className="w-full aspect-square bg-stone-200 rounded-full border-4 border-white shadow-sm"></div>
                  <div className="h-2.5 bg-stone-200 mt-4 rounded-full w-2/3 mx-auto"></div>
                </div>
              ))
            : categoryData.map((cat, index) => (
                <div
                  key={cat._id + "displayCategory" || index}
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                  className="group cursor-pointer min-w-[90px] md:min-w-[110px] text-center"
                >
                  <div className="w-full aspect-square bg-white rounded-full border-2 border-transparent group-hover:border-amber-400 p-1.5 transition-all duration-300 shadow-sm overflow-hidden">
                    <div className="w-full h-full rounded-full overflow-hidden bg-stone-100 flex items-center justify-center">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-tight text-stone-500 group-hover:text-amber-600 transition-colors truncate px-1">
                    {cat.name}
                  </p>
                </div>
              ))}
        </div>
      </div>

      {/* Display category product list */}
      <div className="space-y-4">
        {categoryData.map((c, index) => (
          <CategoryWiseProductDisplay key={c?._id + "CategorywiseProduct"} id={c?._id} name={c?.name} />
        ))}
      </div>
    </section>
  );
};

export default Home;

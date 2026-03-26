import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { DisplayPriceInRupees } from "../utils/DisplayPriceRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import AddToCartButton from "../components/AddToCartButton";

const ProductDisplayPage = () => {
  const params = useParams();

  const productId = params?.product?.split("-")?.slice(-1)[0];
  const [data, setData] = useState({
    name: "",
    image: [],
    unit: "",
    price: 0,
    stock: 0,
    discount: 0,
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);

  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
        if (responseData.data.image.length > 0) {
          setImage(0);
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* LEFT SIDE: Image Gallery */}
        <div className="space-y-4">
          <div className="relative h-[400px] lg:h-[550px] w-full bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden flex items-center justify-center p-6">
            <img
              src={data.image[image]}
              className="h-full w-full object-scale-down transition-transform duration-500 hover:scale-110 cursor-zoom-in"
              alt={data.name}
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="relative flex items-center group">
            <button
              onClick={handleScrollLeft}
              className="absolute left-0 z-10 bg-white/90 p-2 rounded-full shadow-md text-amber-600 hover:bg-amber-500 hover:text-white transition-all border border-amber-100"
            >
              <FaAngleLeft size={20} />
            </button>

            <div
              ref={imageContainer}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-10"
            >
              {data.image.map((img, index) => (
                <div
                  key={img + index + "point"}
                  className={`min-w-[85px] h-[85px] rounded-xl border-2 transition-all duration-300 cursor-pointer p-2 bg-white shadow-sm ${image === index ? "border-amber-500 ring-2 ring-amber-100" : "border-gray-100 hover:border-amber-200"}`}
                  onClick={() => setImage(index)}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-scale-down"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleScrollRight}
              className="absolute right-0 z-10 bg-white/90 p-2 rounded-full shadow-md text-amber-600 hover:bg-amber-500 hover:text-white transition-all border border-amber-100"
            >
              <FaAngleRight size={20} />
            </button>
          </div>

          <div className="space-y-6 mt-8">
            {/* Description Section */}
            <div className="bg-stone-50/50 p-4 rounded-2xl border border-stone-100">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2 border-b border-stone-200 pb-2 w-fit">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {data.description ||
                  "No description available for this product."}
              </p>
            </div>

            {/* Custom Specs / More Details Section */}
            {data?.more_details &&
              Object.keys(data?.more_details).length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest px-1">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.keys(data?.more_details).map((element, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-xl shadow-sm hover:border-amber-200 transition-colors"
                      >
                        <span className="text-[11px] font-black text-stone-400 uppercase tracking-wider">
                          {element}
                        </span>
                        <span className="text-xs font-bold text-slate-700 bg-stone-50 px-3 py-1 rounded-lg border border-stone-50">
                          {data?.more_details[element]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* RIGHT SIDE: Product Info */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-black tracking-tighter uppercase border border-amber-200">
              ⚡ 10 Min Delivery
            </span>
            <h1 className="text-3xl lg:text-2xl font-black text-slate-800 mt-4 leading-[1.1]">
              {data.name}
            </h1>
            <p className="text-lg font-semibold text-slate-400 mt-2 italic tracking-wide">
              {data.unit}
            </p>
          </div>

          <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">
              Special Price
            </p>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  {/* Discounted Price */}
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">
                    {DisplayPriceInRupees(
                      pricewithDiscount(data.price, data.discount),
                    )}
                  </div>

                  {/* Original Price */}
                  {data.discount > 0 && (
                    <span className="text-sm font-bold text-slate-400 line-through">
                      {DisplayPriceInRupees(data.price)}
                    </span>
                  )}
                </div>

                {/* Discount Badge */}
                {data.discount > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-lg w-fit uppercase">
                    {data.discount}% OFF
                  </span>
                )}
              </div>

              {/* Action Area: Handled entirely by AddToCartButton or Out of Stock label */}
              <div className="min-w-[150px]">
                {data.stock === 0 ? (
                  <div className="px-6 py-3 rounded-2xl font-black text-lg bg-red-100 text-red-600 text-center uppercase border border-red-200">
                    Out of Stock
                  </div>
                ) : (
                  /* NO OUTER BUTTON HERE - AddToCartButton handles its own clicks */
                  <AddToCartButton data={data} />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-black text-amber-900/80 flex items-center gap-2">
              Why shop from Blinkit?
            </h2>

            {/* Features List */}
            <div className="grid gap-6">
              <div className="flex gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-amber-50 group-hover:bg-amber-500 transition-colors">
                  <img
                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/10_minute_delivery.png"
                    className="w-10 h-10 object-contain"
                    alt="perk"
                  />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    Superfast Delivery
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Get your items in minutes at your doorstep from dark stores
                    near you.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-amber-50 group-hover:bg-amber-500 transition-colors">
                  <img
                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Best_Prices_Offers.png"
                    className="w-10 h-10 object-contain"
                    alt="perk"
                  />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    Best Prices & Offers
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Directly from manufacturers to ensure you get the best
                    value.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-amber-50 group-hover:bg-amber-500 transition-colors">
                  <img
                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Wide_Assortment.png"
                    className="w-10 h-10 object-contain"
                    alt="perk"
                  />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-base">
                    Wide Assortment
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    5000+ products across food, household, and personal care
                    categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplayPage;

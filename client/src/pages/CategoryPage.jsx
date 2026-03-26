import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import EditCategory from "../components/EditCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });

  const allCategory=useSelector(state=> state.product.allCategory)

  useEffect(()=>{
    setCategoryData(allCategory)
  },[allCategory])
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...SummaryApi.getCategory });
      const { data: responseData } = response;
      if (responseData.success || responseData.succcess) {
        setCategoryData(responseData.data);
      }
    } catch (err) {
      AxiosToastError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleDeleteCategory= async()=>{
    try{
        const response=await Axios({
            ...SummaryApi.deleteCategory,
            data: deleteCategory
        })
        const {data: responseData}= response

        if(responseData.success){
            toast.success(responseData.message)
            fetchCategory()
            setOpenConfirmBoxDelete(false)
        }
    } catch(error){
        AxiosToastError(error)
    }
  }
  return (
    <section className="p-6 bg-stone-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mb-8">
        <div>
          <h2 className="font-extrabold text-stone-800 text-2xl tracking-tight">
            Category Dashboard
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Manage your {categoryData.length} categories
          </p>
        </div>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-100 active:scale-95"
        >
          + Add Category
        </button>
      </div>

      {/* Display Categories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-60 bg-stone-200 animate-pulse rounded-3xl"
            ></div>
          ))}
        </div>
      ) : (
        /* Grid adjustment for wider cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoryData.length > 0 ? (
            categoryData.map((category) => (
              <div
                key={category._id}
                className="group bg-white border border-stone-200 rounded-[1.5rem] p-4 transition-all duration-300 hover:shadow-xl flex flex-col w-full"
              >
                {/* Image Box - Full Width & Height Balanced */}
                <div className="w-full h-48 bg-stone-50 rounded-xl overflow-hidden flex items-center justify-center relative group-hover:bg-white transition-colors">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-scale-down p-2 transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content Section */}
                <div className="mt-4 flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-stone-800 capitalize truncate text-center">
                    {category.name}
                  </h3>

                  {/* Action Buttons - Proper Spacing, No Clipping */}
                  <div className="flex items-center gap-3 w-full pb-2">
                    <button
                      onClick={() => {
                        setOpenEdit(true);
                        setEditData(category);
                      }}
                      className="flex-1 py-2 bg-green-50 hover:bg-green-600 text-green-600 hover:text-white font-bold rounded-lg text-sm transition-all border border-green-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setOpenConfirmBoxDelete(true);
                       setDeleteCategory({ _id: category._id })
                      }}
                      className="flex-1 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-lg text-sm transition-all border border-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-stone-200">
              <p className="text-stone-400 font-bold text-lg">
                No Categories Found
              </p>
            </div>
          )}
        </div>
      )}

      {openUploadCategory && (
        <UploadCategoryModel
          close={() => setOpenUploadCategory(false)}
          fetchData={fetchCategory}
        />
      )}
      {openEdit && (
        <EditCategory
          data={editData}
          fetchData={fetchCategory}
          close={() => setOpenEdit(false)}
        />
      )}
      {openConfirmBoxDelete && (
        <ConfirmBox
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
          close={() => setOpenConfirmBoxDelete(false)}
        />
      )}
    </section>
  );
};

export default CategoryPage;

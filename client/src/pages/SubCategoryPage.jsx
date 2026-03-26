import React from "react";
import { useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useEffect } from "react";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { LuPencil } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import EditSubCategory from "../components/EditSubCategory";
import ConfirmBox from "../components/ConfirmBox";
import toast from "react-hot-toast";
const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);

  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);

  const [imageURL, setImageURL] = useState("");
  const columnHelper = createColumnHelper();

  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });
  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id: "",
  });

  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setdata(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const column = [
    columnHelper.accessor("name", {
      header: "Sub Category",
      cell: ({ row }) => (
        <span className="font-bold text-stone-800">{row.original.name}</span>
      ),
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <img
            src={row.original.image}
            alt={row.original.name}
            onClick={() => {
              setImageURL(row.original.image);
            }}
            className="w-14 h-14 object-contain bg-white rounded-xl border border-stone-100 p-1 shadow-sm"
          />
        </div>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.category.map((cat) => (
            <span
              key={cat._id + "table"}
              className="text-[10px] uppercase tracking-wider font-black px-2 py-1 bg-stone-100 text-stone-600 rounded-md"
            >
              {cat.name}
            </span>
          ))}
        </div>
      ),
    }),
    // Action Column placeholder
    columnHelper.accessor("_id", {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            {/* Edit Button */}
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-all shadow-sm active:scale-90"
              title="Edit Sub Category"
            >
              <LuPencil size={18} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true);
                setDeleteSubCategory( {_id:row.original._id});
              }}
              className="p-2 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-sm active:scale-90 border border-red-100"
              title="Delete Sub Category"
            >
              <MdDelete size={20} />
            </button>
          </div>
        );
      },
    }),
  ];
  const handleDeleteSubCategory=async()=>{
    try{
      const response=await Axios({
        ...SummaryApi.deleteSubCategory,
        data:deleteSubCategory
      })
      const {data: responseData}= response

      if(responseData.success){
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({_id:""})
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
            Sub Category Dashboard
          </h2>
        </div>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-100 active:scale-95"
        >
          + Add SubCategory
        </button>
      </div>

      <div>
        <DisplayTable data={data} column={column} />
      </div>
      {openAddSubCategory && (
        <UploadSubCategoryModel close={() => setOpenAddSubCategory(false)} 
        fetchData={fetchSubCategory}
        />
      )}

      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}
      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}
      {openDeleteConfirmBox && (
        <ConfirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;

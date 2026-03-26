import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete, MdEdit } from "react-icons/md";
import EditAddressDetails from "../components/EditAddressDetails";
import { FiMapPin, FiPlus } from "react-icons/fi";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);

  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    console.log("DELETE CLICKED ID:", id); // 👈 add this
    try {
      const response = await Axios({
        ...SummaryApi.disableAddress,
        data: {
          _id: id,
        },
      });
       console.log("DELETE RESPONSE:", response); // 👈 add this
      if (response.data.success) {
        toast.success("Address Remove");
        if (fetchAddress) {
           await fetchAddress(); 
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
          <FiMapPin className="text-amber-500" />
          Your Addresses
        </h2>

        <button
          onClick={() => setOpenAddress(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
        >
          <FiPlus /> Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
        {addressList && addressList.length > 0 ? (
          addressList.map((address) => {
            return (
              <div
                key={address._id}
                className="flex justify-between items-start p-4 rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-sm hover:shadow-md transition"
              >
                {/* left */}
                <div className="flex gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <FiMapPin />
                  </div>

                  <div className="flex flex-col text-sm">
                    <p className="font-bold text-stone-800">
                      {address.address_line}
                    </p>

                    <p className="text-stone-600">
                      {address.city}, {address.state}
                    </p>

                    <p className="text-stone-500 text-xs">{address.country}</p>

                    <p className="mt-1 text-xs font-semibold text-amber-700">
                      📞 {address.mobile}
                    </p>
                  </div>
                </div>

                {/* edit button */}
                <div className="flex gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setOpenEdit(true);
                      setEditData(address);
                    }}
                    className="text-amber-600 hover:bg-amber-100 p-2 rounded-full transition"
                  >
                    <MdEdit size={18} />
                  </button>

                  {/* Delete */}
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents triggering any parent clicks
                      if (
                        window.confirm(
                          "Are you sure you want to remove this address?",
                        )
                      ) {
                        handleDisableAddress(address._id);
                      }
                    }}
                    className="group relative text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all border border-transparent hover:border-red-100"
                    title="Remove Address"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            onClick={() => setOpenAddress(true)}
            className="border border-dashed border-amber-300 rounded-xl p-10 text-center cursor-pointer hover:bg-amber-50 transition"
          >
            <FiMapPin size={40} className="mx-auto text-amber-300 mb-3" />
            <p className="font-semibold text-stone-600">No address added</p>
            <p className="text-xs text-stone-400 mt-1">
              Click to add your first address
            </p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {/* Edit Modal */}
      {openEdit && (
        <EditAddressDetails
          close={() => setOpenEdit(false)}
          data={editData} //  IMPORTANT
        />
      )}
    </section>
  );
};

export default Address;

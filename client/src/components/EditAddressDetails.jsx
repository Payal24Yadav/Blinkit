
import React from 'react';
import { useForm } from 'react-hook-form'; // Added missing import
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import { IoClose } from "react-icons/io5"; // Optional: for a close icon
import { useGlobalContext } from '../provider/GlobalProvider';

const EditAddressDetails = ({ close, data }) => {
    const { register, handleSubmit, reset } = useForm({
  defaultValues: {
    _id: data?._id,
    userId: data?.userId,
    address_line: data?.address_line,
    city: data?.city,
    state: data?.state,
    country: data?.country,
    pincode: data?.pincode,
    mobile: data?.mobile,
  },
});

    const {fetchAddress}=useGlobalContext()

    const onSubmit = async (data) => {
        try {
            const response = await Axios({
                ...SummaryApi.updateAddress,
                data: {
                      _id: data._id,
                    address_line: data.address_line,
                    city: data.city,
                    state: data.state,
                    country: data.country,
                    pincode: data.pincode,
                    mobile: data.mobile,
                }
            });

            const { data: responseData } = response;
            if (responseData.success) {
                toast.success(responseData.message);
                if (close) {
                    close();
                    reset();
                    fetchAddress()
                }
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="fixed inset-0 bg-black/40 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border-t-4 border-amber-500">
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-amber-50">
                   <h2>Edit Address</h2>
                    <button onClick={close} className="text-amber-700 hover:bg-amber-200 p-1 rounded-full transition-colors">
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 grid grid-cols-1 gap-4">
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-amber-800" htmlFor="addressline">Address Line</label>
                        <input 
                            className="p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                            type="text" id='addressline' {...register("address_line", { required: true })} 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-amber-800" htmlFor="city">City</label>
                            <input 
                                className="p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                                type="text" id='city' {...register("city", { required: true })} 
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-amber-800" htmlFor="state">State</label>
                            <input 
                                className="p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                                type="text" id='state' {...register("state", { required: true })} 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-amber-800" htmlFor="pincode">Pincode</label>
                            <input 
                                className="p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                                type="text" id='pincode' {...register("pincode", { required: true })} 
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-amber-800" htmlFor="country">Country</label>
                            <input 
                                className="p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                                type="text" id='country' {...register("country", { required: true })} 
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-amber-800" htmlFor="mobile">Mobile No.</label>
                        <input 
                            className="p-2 border border-amber-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30"
                            type="text" id='mobile' {...register("mobile", { required: true })} 
                        />
                    </div>

                    <button 
                        type='submit' 
                        className="mt-4 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-md transition-all shadow-md active:scale-95"
                    >
                        Submit Address
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditAddressDetails;
import React from 'react'
import { useSelector } from 'react-redux'

const MyOrder = () => {
  // Redux se data nikaal rahe hain
  const orderList = useSelector(state => state.orders.order)
  
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="font-bold text-xl mb-4">My Orders ({orderList?.length})</h2>
      
      {/* Agar order list empty hai toh placeholder dikhao */}
      {(!orderList || orderList.length === 0) ? (
        <p>No orders found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orderList.map((item, index) => (
            <div key={item._id || index} className="border p-4 rounded-lg bg-white shadow-sm flex gap-4 items-center">
              
              {/* Product Image (Pehli image uthayi hai) */}
              <img 
                src={item.product_details?.image[0]} 
                alt={item.product_details?.name} 
                className="w-20 h-20 object-scale-down bg-gray-100 rounded"
              />

              {/* Order Info */}
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-mono">Order ID: {item.orderId}</p>
                <h3 className="font-semibold text-lg">{item.product_details?.name}</h3>
                <p className="text-green-600 font-bold">₹{item.totalAmt}</p>
                <p className="text-xs text-blue-500 mt-1">{item.payment_status}</p>
              </div>

              {/* Status */}
              <div className="text-right">
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrder
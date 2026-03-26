import React from 'react'
import { useSelector } from 'react-redux'
import isAdmin from '../utils/isAdmin'
import { FiShieldOff } from 'react-icons/fi'

const AdminPermission = ({ children }) => {
  const user = useSelector(state => state.user)

  return (
    <>
      {isAdmin(user?.role) ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <FiShieldOff className="text-amber-500/20 text-8xl mb-4" />
          
          <h1 className="text-3xl font-black text-stone-900 tracking-tighter">
            Access Denied<span className="text-amber-500">.</span>
          </h1>
          
          <p className="mt-2 text-stone-500 font-medium max-w-sm">
            This area is reserved for administrators only. Please contact support if you believe this is an error.
          </p>
          
          <div className="mt-8 flex items-center gap-2">
            <span className="h-[1px] w-8 bg-stone-200"></span>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">BlinkIT Admin Gate</span>
            <span className="h-[1px] w-8 bg-stone-200"></span>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminPermission
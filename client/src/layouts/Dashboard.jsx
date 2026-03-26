import React from 'react'
import UserMenu from '../components/UserMenu'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const user=useSelector(state=>state.user)

  console.log("User Dashboard",user);
  
  return (
    <section className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Sidebar */}
          <div className="md:w-64 w-full bg-white shadow-sm rounded-xl border border-stone-200">
            <UserMenu />
          </div>

          {/* Right Content */}
          <div className="flex-1 bg-white shadow-sm rounded-xl border border-stone-200 p-6">
            <Outlet />
          </div>

        </div>

      </div>
    </section>
  )
}

export default Dashboard
import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({ url, close }) => {
  return (
    <div className='fixed inset-0 z-[200] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm'>
        
        <div className='relative max-w-4xl w-full h-[80vh] bg-[#FDFCF0] rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center border border-stone-200'>
            
            {/* Close Button - Floating Style */}
            <button 
                onClick={close}
                className='absolute top-4 right-4 p-2 bg-white/80 hover:bg-amber-500 hover:text-white text-stone-600 rounded-full transition-all shadow-lg z-10'
            >
                <IoClose size={28}/>
            </button>

            {/* Image Container */}
            <div className='w-full h-full p-6 flex items-center justify-center'>
                <img 
                    src={url}
                    alt='Full Screen View'
                    className='max-w-full max-h-full object-contain rounded-xl' 
                />
            </div>

            {/* Bottom Tag - Matches your theme */}
            <div className='absolute bottom-0 left-0 right-0 py-3 bg-white/50 border-t border-stone-100 text-center'>
                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-stone-400'>
                    Image Preview <span className='text-amber-500'>.</span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default ViewImage
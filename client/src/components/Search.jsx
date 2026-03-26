import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FiSearch, FiMic } from 'react-icons/fi';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const params= useLocation()
const searchText = params.search.slice(3)

  useEffect(() => {
    const isSearch = location.pathname === '/search';
    setIsSearchPage(isSearch);
  }, [location]);

  const handleSearchClick = () => {
    if (!isSearchPage) {
      navigate('/search');
    }
  };

  const handleOnChange=(e)=>{
    const value= e.target.value;
    console.log(value);
    const url =`/search?q=${value}`
    navigate(url)
    
  }

  return (
    <div 
      className={`relative w-full group transition-all duration-300 ${!isSearchPage ? 'cursor-pointer' : ''}`} 
      onClick={handleSearchClick}
    >
      {/* Glow Effect: Soft Gold/Cream Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-200 to-amber-400 rounded-xl blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
      
      {/* Background: Cream (#FDFCF0) | Border: Warm Gray */}
      <div className="relative flex items-center bg-[#FDFCF0] border border-stone-200 rounded-xl px-4 py-2.5 shadow-sm group-focus-within:border-amber-400 group-focus-within:bg-white transition-all">
        
        {/* Search Icon: Deep Grey/Brown for contrast */}
        <FiSearch className="text-stone-500 text-lg min-w-[20px] group-focus-within:text-amber-600" />

        <div className="relative flex-1 ml-3 h-6 flex items-center">
          
          {isSearchPage ? (
            /* --- SEARCH PAGE CODE --- */
            <input
              type="text"
              autoFocus
              defaultValue={searchText}
              className="w-full bg-transparent border-none outline-none text-stone-800 text-sm placeholder-stone-400"
              placeholder="Search for atta, dal and more"
              onChange={handleOnChange}
            />
          ) : (
            /* --- HOME PAGE CODE --- */
            <div className="relative w-full h-full flex items-center">
              <input
                type="text"
                readOnly
                className="absolute inset-0 bg-transparent border-none outline-none text-stone-800 text-sm w-full z-10 cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center pointer-events-none text-stone-400 text-sm overflow-hidden whitespace-nowrap">
                <TypeAnimation
                  sequence={[
                    'Search "Fresh Milk"', 2000,
                    'Search "Organic Vegetables"', 2000,
                    'Search "Ice Cream"', 2000,
                  ]}
                  wrapper="span"
                  cursor={true}
                  repeat={Infinity}
                />
              </div>
            </div>
          )}

        </div>

        <button title="Voice Search" className="ml-2 text-stone-400 hover:text-amber-600 transition-colors">
          <FiMic size={18} />
        </button>
      </div>
    </div>
  );
};

export default Search;
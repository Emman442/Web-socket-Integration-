import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';



const AuthLayouts = () => {
  const location = useLocation()
  console.log(location.pathname)
  return (
    <>
      {location.pathname !== "/chat"?<header className="w-full h-20 shadow-lg bg-[#18212F] ">
        <div className='w-[80%] flex items-center py-3 mx-auto'>
          <img src="/logo.png" alt="logo" width={100} height={70}  />
          </div>
      </header>: ""}
      <Outlet/>
    </>
  );
}

export default AuthLayouts
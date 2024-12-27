import React from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';



const AuthLayouts = () => {
  const location = useLocation()
  console.log(location.pathname)
  return (
    <>
      {location.pathname !== "/chat"?<Header/> : ""}
      <Outlet/>
    </>
  );
}

export default AuthLayouts
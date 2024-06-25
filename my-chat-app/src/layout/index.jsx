import React from 'react'
import Logo from "../assets/react.svg"


const AuthLayouts = ({children}) => {
  return (
    <>
      <header className="flex items-center justify-center py-3 h-20 shadow-md bg-white">
        <img src={Logo} alt="logo" width={80} height={60} />
      </header>
      {children}
    </>
  );
}

export default AuthLayouts
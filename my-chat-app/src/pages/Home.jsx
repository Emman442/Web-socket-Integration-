import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import WalletConnectModal from "../components/WalletConnectModal";
import { useSocket } from "../contexts/SocketContext";

export default function Home() {
  const [buttonClicked, setButtonClicked] = useState(false)
  const onClose =()=> setButtonClicked(false)

  return (
    <>
    {buttonClicked && <WalletConnectModal onClose={onClose}/>}
    <div className="bg-[#111827] h-[88vh] font-custom">
      <div className=" w-[100%] py-14 flex items-center justify-center">
        <div className="w-[80%] h-[70vh] mx-auto bg-[#18212F] rounded-lg flex items-center">
          <div className="w-[90%] mx-auto">
          <h1 className="text-white text-[50px] leading-8 font-bold mb-12 ">
            Login to Start Chatting.
          </h1>

          <p className="mb-8"> <span className="text-[#F44D83] font-semibold">Chain Vibe </span> <span className="my-4 text-white">is a simple platform for verified messaging from wallet owner-to-owner for <br /> outreach and social purposes.<br></br> also send NFTs to your gees and get Instant Notification in Real time 😊</span></p>

          <button onClick={()=>setButtonClicked(true)} className=" bg-[#F44D83] w-[200px] h-[45px] rounded-md text-white font-semibold hover:bg-transparent hover:border-[#F44D83] hover:border hover:border-2px hover:border-solid ease-in duration-300">
            Sign in With Wallet
          </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

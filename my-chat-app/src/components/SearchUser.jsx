import React, { useEffect, useState } from 'react'
import { IoSearchOutline, IoChatbubblesOutline } from 'react-icons/io5'
import Loader from './Loader';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useSocket } from '../contexts/SocketContext';
import { useSelector } from 'react-redux';



export default function SearchUser({onClose}) {
  const user = useSelector((state)=>state?.user)
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [address, setAddress] = useState("")
    const socketConnection= useSocket();
    const handleSubmit = () => {
      console.log("add", user?.address);
      if (!address) {
        return;
      }
    
      socketConnection.socket.current.emit(
        "new contact",
        {
          sender: user?.address,
          receiver: address,
        },
        (response) => {
          if (response.success) {
            console.log("Conversation saved:", response.conversation);
          } else {
            console.error("Failed to save conversation:", response.message);
          }
        }
      );
    };
    

  return (
    <div className="font-custom fixed inset-0 flex items-center justify-center z-10 backdrop-blur-lg h-full">
  <div className="bg-[#111827] w-[35%] h-[260px] mx-auto rounded-lg shadow-lg p-6 absolute">
    <p role='button' onClick={()=>onClose()} className='font-semibold text-white text-[30px] relative ml-3 text-end'>&times;</p>
    <div className="text-center text-white">
      <p className="font-bold text-[18px]">Start a New Chat!</p>
      <p className="text-[14px]">Enter an address (or .sol name) below to start a new chat</p>
      <input type="text" onChange={(e)=>setAddress(e.target.value)} className='w-[90%] text-md border border-gray-600 h-10 bg-transparent my-4 rounded-lg pl-4 outline-none text-white' placeholder='e.g 0x... or name.sol'/>
      <button onClick={handleSubmit} className='flex gap-2 items-center justify-center mx-auto w-[90%] font-bold h-10 bg-[#F44D83] mb-6 rounded-md pl-4  text-white'>Start Chatting <span><IoChatbubblesOutline size={25}/></span></button>
    </div>
  </div>
</div>
  );
}

import React, { useState, useEffect } from 'react'
import { IoChatbubbleEllipses} from "react-icons/io5"
import {  FaUserPlus } from "react-icons/fa"
import { NavLink } from 'react-router-dom';
import { BiLogOut} from "react-icons/bi"
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import { FiArrowUpLeft} from "react-icons/fi"
import SearchUser from './SearchUser';
import { useSocket } from '../contexts/SocketContext';
import {FaImage,  FaVideo } from "react-icons/fa6"

export default function Sidebar() {
    const user = useSelector(state=>state?.user)
    const socketConnection = useSocket()
    const [allUser, setAllUser] = useState([])
    const [editUserOpen, setEditUserOpen] = useState(false)
    const [openSearchUser, setOpenSearchUser] = useState(false)

    useEffect(() => {
      if (socketConnection.socket && socketConnection.socket.current) {
        const socket = socketConnection.socket.current;
        socket.emit("sidebar", user?._id);

        const handleConversation = (data) => {
          const conversationData = data.map((conversationUser) => {
            if (
              conversationUser.sender?._id === conversationUser.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            } else if (conversationUser.receiver?._id !== user._id) {
              return {
                ...conversationUser,
                userDetails: conversationUser.receiver,
              };
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            }
          });

          setAllUser(conversationData);
          console.log("conversation Uer", conversationData)
        };

        socket.on("conversation", handleConversation);

        // Cleanup on unmount
        return () => {
          socket.off("conversation", handleConversation);
        };
      }
    }, [socketConnection.socket, user]);

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="flex flex-col justify-between bg-slate-200 w-12 h-full rounded rounded-tr-lg rounded-br-lg py-5 text-slate-600">
        <div>
          <NavLink
            title="chat"
            className={({ isActive }) =>
              `cursor-pointer w-12 h-10 hover:bg-slate-200 flex justify-center items-center ${
                isActive && "bg-slate-200"
              }`
            }
          >
            <IoChatbubbleEllipses size={21} />
          </NavLink>
          <div
            title="user"
            onClick={()=>setOpenSearchUser(true)}
            className="cursor-pointer w-12 h-10 hover:bg-slate-200 flex justify-center items-center"
          >
            <FaUserPlus size={21} />
          </div>
        </div>
        <div title="logout" className="flex flex-col items-center">
          <button
            className="cursor-pointer w-12 h-10 hover:bg-slate-200 flex justify-center items-center"
            title={`${user.name}`}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button className="cursor-pointer w-12 h-10 hover:bg-slate-200 flex justify-center items-center">
            <BiLogOut size={21} className="-ml-2" />
          </button>
        </div>
      </div>

      <div className="w-full ">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-700 ">Messages</h2>
        </div>
        <Divider />
        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto  scrollbar">
          {allUser.length === 0 && (
            <div>
              <div className='flex justify-center items-center my-5 text-slate-500'>
                <FiArrowUpLeft size={50}/>
              </div>
              <p className="text-lg text-center text-slate-600">
                Explore users to start a conversation with.
              </p>
            </div>
          )}
          {allUser.map((conv, index)=>{
            return (
              <NavLink to={`/${conv?.userDetails._id}`} key={conv?._id} className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-[#00acb4] rounded hover:bg-slate-100 cursor-pointer">
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibols text-sm">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>

                          {!conv?.lastMsg?.text && <span>photo</span>}
                        </div>
                      )}
                      {conv.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                            {!conv?.lastMsg?.text && <span>Video</span>}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">{conv?.lastMsg?.text}</p>
                  </div>
                </div>
                <p className="text-sm ml-auto p-1 bg-[#00acb4] w-6 flex items-center justify-center h-6 font-semibold rounded-full text-white">{conv?.unseenMsg}</p>
              </NavLink>
            );
          })}
        </div>
      </div>

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* Search User  */}
      {openSearchUser && <SearchUser onClose={setOpenSearchUser}/>}
    </div>
  );
}

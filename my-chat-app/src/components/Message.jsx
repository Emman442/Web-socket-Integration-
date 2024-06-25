import React, { useEffect, useContext, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {HiDotsVertical} from "react-icons/hi"
import {FaAngleLeft, FaPlus, FaImage, FaVideo} from "react-icons/fa6"
import {MdOutlineSend} from "react-icons/md"
import moment from "moment"
import { useSocket } from "../contexts/SocketContext";
// import {setSocketConnection} from "../redux/userSlice"
import Avatar from "./Avatar";
import { uploadFile } from "../helpers/uploadFile";
import Loader from "./Loader";

export default function Message() {
  const [openImageVideoUpload, setOpenVideoImageUpload] = useState(false)
 
  const params = useParams();
  const user = useSelector(state=> state?.user)
  console.log("userrr",user)
  const socketConnection = useSocket();
  const [loading, setIsLoading] = useState(false)
  const [dataUser, setDataUser] = useState({
    _id: "",
    name: "",
    email: "",
    profile_pic: "",
    online: false,
  });
  const [allMessages, setAllMessages] = useState([])
  const currentMessage = useRef()

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })
   const handleUploadImage = async(e) => {
    const file = e.target.files[0]
    setOpenVideoImageUpload(false);
    setIsLoading(true)

        const uploadPhoto = await uploadFile(file)
        console.log("upload photo", uploadPhoto)
        setIsLoading(false)
      
        setMessage((prev) => {
          return {
            ...prev,
           imageUrl: uploadPhoto.secure_url,
          };
        });
        
   };
   const handleUploadVideo = async(e) => {
    const file = e.target.files[0]
    setOpenVideoImageUpload(false);
    setIsLoading(true)

        const uploadVideo = await uploadFile(file)
        console.log("upload photo", uploadVideo)
        setIsLoading(false)
      
        setMessage((prev) => {
          return {
            ...prev,
           videoUrl: uploadVideo.secure_url,
          };
        });
   };
   const handleClearUploadImage = () =>{
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
   }
   const handleClearUploadVideo = () =>{
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
   }
   
   const handleOnChange = (e) =>{
    const {name, value} = e.target
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });

   }

   useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behaviour: 'smooth', block: 'end'})
    }
   }, [allMessages])
   

  useEffect(() => {
    if (socketConnection && socketConnection.socket.current) {
      const socket = socketConnection.socket.current;

      socket.emit("message-page", params.userId);
      socket.on("message-user", (data) => {
        setDataUser(data);
      });


      socket.on("message", (data)=>{
        console.log("message data: ", data)
        setAllMessages(data)
      })
    }


  }, [socketConnection,params?.userId, user]);


  const handleSendMessage = (e) =>{
    e.preventDefault()
    if(message.text || message.imageUrl || message.videoUrl){
      socketConnection.socket.current.emit("new message", {
        sender: dataUser._id,
        receiver: params.userId,
        text: message.text,
        videoUrl: message.videoUrl,
        imageUrl: message.imageUrl,
        msgByUserId: user?._id.toString(),
      });
    }
    setMessage({
      text:"",
      imageUrl: "",
      videoUrl: ""
    })
  }
  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className=" flex items-center gap-4">
          <Link to="/" className="lg:hidden ">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser.profile_pic}
              name={dataUser.name}
              userId={dataUser._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className=" -my-1.5">
              {dataUser.online ? (
                <span className="text-[#00acb4] text-sm">Online</span>
              ) : (
                <span className="text-slate-400">Offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/* Show all messages  */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar ">
        {/* Upload Image Display  */}

        {/* all Messages shows here*/}
        {
          <div className="flex flex-col gap-2 py-2 px-2">
            {allMessages.map((msg, index) => {
              return (
                <div
                  ref={currentMessage}
                  className={`bg-white rounded w-fit p-1 py-2 max-w-[200px] md:max-w-sm  lg:max-w-md${
                    user._id === msg.msgByUserI ? "ml-auto bg-teal-100" : ""
                  }`}
                >
                 <div>
                   {msg?.imageUrl && (<img src={msg?.imageUrl} className="w-full h-full object-scale-down"/>)}
                 </div>
                 <div>
                   {msg?.videoUrl && (<video src={msg?.videoUrl} className="w-full h-full object-scale-down" controls loop autoPlay />)}
                 </div>
                  <p className="px-2 pt-2">{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">
                    {moment(msg.createdAt).format("hh:mm")}
                  </p>
                </div>
              );
            })}
          </div>
        }
        {message.imageUrl && (
          <div className="w-full absolute sticky bottom-0 h-full  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div className="bg-white ">
              <div
                className="w-fit p-2 absolute top-0 right-0 text-black text-[30px] font-bold cursor-pointer hover:text-red-500"
                onClick={handleClearUploadImage}
              >
                &times;
              </div>
              <img
                src={message?.imageUrl}
                width={400}
                height={400}
                alt="upload image"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}

        {/* handle upload video display*/}
        {message.videoUrl && (
          <div className="w-full h-full  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div className="bg-white ">
              <div
                className="w-fit p-2 absolute top-0 right-0 text-black text-[30px] font-bold cursor-pointer hover:text-red-500"
                onClick={handleClearUploadVideo}
              >
                &times;
              </div>
              <video
                src={message?.videoUrl}
                alt="upload image"
                className="aspect-video w-full h-full max-w-sm m-2"
                controls
                autoPlay
                muted
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <Loader />
          </div>
        )}
      </section>

      {/* sedn message  */}

      <section className="h-16 bg-white flex items-center ">
        <div className=" ">
          <button
            className="relative flex justify-center items-center w-14 h-14 rounded-full hover:bg-[#00acb4] hover:text-white"
            onClick={() => setOpenVideoImageUpload(!openImageVideoUpload)}
          >
            <FaPlus size={20} />
          </button>

          {/* Video and Image  */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-[64px] w-36 p-2 m-0.5">
              <form>
                <label
                  htmlFor="upload Image"
                  className="flex items-center gap-3 p-2 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-[#00acb4]">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="upload Video"
                  className="flex items-center gap-3 p-2 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="upload Image"
                  onChange={handleUploadImage}
                />
                <input
                  type="file"
                  className="hidden"
                  id="upload Video"
                  onChange={handleUploadVideo}
                />
              </form>
            </div>
          )}
        </div>
        <form
          action=""
          className="w-full h-full flex gap-2 "
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            name=""
            id=""
            placeholder="type your message"
            className="py-1 px-4 outline-none w-full h-full border-2"
            value={message.text}
            onChange={handleOnChange}
          />

          <button className="hover:text-[#00acb4]">
            <MdOutlineSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
}


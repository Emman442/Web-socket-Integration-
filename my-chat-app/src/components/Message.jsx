import React, { useEffect, useContext, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import { MdOutlineSend } from "react-icons/md";
import moment from "moment";
import { useSocket } from "../contexts/SocketContext";
import { uploadFile } from "../helpers/uploadFile";
import Loader from "./Loader";
import { IoHomeOutline } from "react-icons/io5";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaCirclePlus } from "react-icons/fa6";
import { CgMoreVerticalO } from "react-icons/cg";
import { GrEmoji } from "react-icons/gr";
import { TiAttachment } from "react-icons/ti";
import { MdOutlineMoreVert } from "react-icons/md";
import SearchUser from "./SearchUser";

export default function Message() {
  const [currentChat, setCurrentChat] = useState();
  const [searchUser, setSearchUser] = useState(false);
  const [addressToChat, setAddressToChat] = useState();
  const [chats, setChats] = useState([]);
  const onClose = () => {
    setSearchUser(false);
  };
  const handleCurrentChat = (i) => {
    setCurrentChat(i);
  };

  const handleNewUser = () => {
    setSearchUser(true);
  };

  const [openImageVideoUpload, setOpenVideoImageUpload] = useState(false);

  const params = useParams();
  const user = useSelector((state) => state?.user);
  console.log("userrr", user);
  const socketConnection = useSocket();
  const [loading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const currentMessage = useRef();

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    setOpenVideoImageUpload(false);
    setIsLoading(true);

    const uploadPhoto = await uploadFile(file);
    console.log("upload photo", uploadPhoto);
    setIsLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto.secure_url,
      };
    });
  };
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setOpenVideoImageUpload(false);
    setIsLoading(true);

    const uploadVideo = await uploadFile(file);
    console.log("upload photo", uploadVideo);
    setIsLoading(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadVideo.secure_url,
      };
    });
  };
  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: "",
      };
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behaviour: "smooth",
        block: "end",
      });
    }
  }, [allMessages]);

  useEffect(() => {
    if (socketConnection && socketConnection.socket.current) {
      const socket = socketConnection.socket.current;

      socket.emit("message-page", params.userId);
      socket.on("message-user", (data) => {
        setDataUser(data);
      });

      socket.on("conversation", async (data) => {
        setChats(data);
        console.log("data", data);
      });

      socket.emit("sidebar", user?.address, (response) => {
        if (response.success) {
          console.log("Sidebar data received:", response.data);
        } else {
          console.error("Failed to fetch sidebar data:", response.message);
        }
      });

      socket.on("message", (data) => {
        console.log("message data: ", data);
        setAllMessages(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      socketConnection.socket.current.emit("new message", {
        sender: user?.address,
        receiver: currentChat?.adress,
        text: message.text,
        videoUrl: message.videoUrl,
        imageUrl: message.imageUrl,
      });
    }
    setMessage({
      text: "",
      imageUrl: "",
      videoUrl: "",
    });
  };
  return (
    <>
      {searchUser && <SearchUser onClose={onClose} />}
      <div className="font-custom w-full h-screen  bg-[#111827] flex items-center justify-center">
        <div className="w-[95%] bg-[#18212F] mx-auto h-[95vh] flex rounded-lg overflow-hidden shadow-lg">
          <div className="w-[30%]">
            <div className="flex items-center gap-[90px]">
              <div className="flex divide-x-2 divide-gray-600 gap-4 ml-2 my-3 items-center">
                <IoHomeOutline size={25} color="#F44D83" />
                <span className="pl-4">
                  <WalletMultiButton />
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <span onClick={() => handleNewUser()}>
                  <FaCirclePlus size={30} color="#070d1a" />
                </span>
                <CgMoreVerticalO size={30} color="#070d1a" />
              </div>
            </div>

            <div className="w-[90%] mx-auto my-4">
              <input
                className="w-full rounded-full h-10 outline-none pl-4 bg-transparent border border-gray-600"
                type="text"
                name=""
                id=""
                placeholder="search..."
              />
            </div>

            <div className="w-full scrollbar overflow-auto h-full">
              <div className="w-full mx-auto h-full ">
                <div className="flex flex-col w-full">
                  {chats.length === 0 ? (
                    <div className="w-[90%] mx-auto flex  justify-center">
                      <div>
                        <p className="font-bold text-[35px] text-white text-center ">
                          Click on the "+" to start a new chat!
                        </p>
                        <p className=" text-[15px] text-white text-center ">
                          Once you start a new conversation, you will see the
                          address list here!
                        </p>
                      </div>
                    </div>
                  ) : (
                    chats.map((i) => (
                      <div
                        className="w-full flex gap-3 h-20 items-center hover:rounded-sm hover:bg-[#111827]"
                        key={i.address}
                        onClick={() => handleCurrentChat(i)}
                      >
                        <img
                          className="w-10 h-10 rounded-full border-gray-200 border ml-4"
                          src={i.pic}
                          alt=""
                        />
                        <div className="a flex items-center justify-between w-full mr-4">
                          <div className="text-white flex-col gap-2">
                            <p className="text-white font-semibold">{i.receiver}</p>
                            <p className="text-[14px]">
                              {i.lastMessage ? i.lastMessage : "<New Chat>"}
                            </p>
                          </div>
                          <div className="b text-white text-right flex-col flex gap-2">
                            <p className="text-[14px] text-[#F44D83]">9:42pm</p>
                            <div className="bg-[#F44D83] text-[10px] w-4 h-4  rounded-full text-center mx-auto ">
                              1
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat  */}
          <div className="w-[70%] border-l-[1px] border-gray-600 relative">
            <div className="border-b border-gray-600 h-16 flex items-center justify-between px-4">
              <div className="flex gap-4 items-center">
                <img
                  className="w-10 h-10 rounded-full border border-gray-200"
                  src={currentChat?.pic}
                  alt="Profile Picture"
                />

                <div className="text-white flex flex-col">
                  <p className="font-semibold">
                    {currentChat?.addr || "Unknown User"}
                  </p>
                  <p className="text-sm text-gray-400">Typing...</p>
                </div>
              </div>

              {/* More Options Icon */}
              <MdOutlineMoreVert
                size={24}
                color="#F44D83"
                className="cursor-pointer hover:text-white"
              />
            </div>
            {/* Chat page  */}
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
                          user._id === msg.msgByUserI
                            ? "ml-auto bg-teal-100"
                            : ""
                        }`}
                      >
                        <div>
                          {msg?.imageUrl && (
                            <img
                              src={msg?.imageUrl}
                              className="w-full h-full object-scale-down"
                            />
                          )}
                        </div>
                        <div>
                          {msg?.videoUrl && (
                            <video
                              src={msg?.videoUrl}
                              className="w-full h-full object-scale-down"
                              controls
                              loop
                              autoPlay
                            />
                          )}
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
            </section>

            {/* footer */}
            <div className="h-16 border-t-[1px] w-full bottom-0 absolute border-gray-600 flex items-center">
              <div className="w-[15%] flex gap-8 items-center ml-7">
                <span>
                  <GrEmoji size={30} color="#F44D83" />
                </span>
                <span>
                  <TiAttachment
                    onClick={() =>
                      setOpenVideoImageUpload(!openImageVideoUpload)
                    }
                    size={30}
                    color="#F44D83"
                  />
                </span>
                {openImageVideoUpload && (
                  <div className="bg-[#111827] shadow rounded absolute bottom-[64px] w-36 p-2 m-0.5">
                    <form>
                      <label
                        htmlFor="upload Image"
                        className="flex items-center gap-3 p-2 hover:bg-[#18212F] cursor-pointer"
                      >
                        <div className="text-[#00acb4]">
                          <FaImage size={18} />
                        </div>
                        <p className="text-[#F44D83] text-[14px] font-medium">
                          Image
                        </p>
                      </label>
                      <label
                        htmlFor="upload Video"
                        className="flex items-center gap-3 p-2 hover:bg-[#18212F] cursor-pointer"
                      >
                        <div className="text-purple-500">
                          <FaVideo size={18} />
                        </div>
                        <p className="text-[#F44D83] text-[14px] font-medium">
                          Video
                        </p>
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
                className="w-[80%] flex  gap-8 items-center"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="type your message"
                  className="pl-4 outline-none bg-transparent border-gray-600 w-[98%] h-12 text-white border-2 rounded-full"
                  value={message.text}
                  onChange={handleOnChange}
                />

                <button>
                  <MdOutlineSend size={28} color="#F44D83" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
    // <div>
    //   <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
    //     <div className=" flex items-center gap-4">
    //       <Link to="/" className="lg:hidden ">
    //         <FaAngleLeft size={25} />
    //       </Link>
    //       <div>
    //         <Avatar
    //           width={50}
    //           height={50}
    //           imageUrl={dataUser.profile_pic}
    //           name={dataUser.name}
    //           userId={dataUser._id}
    //         />
    //       </div>
    //       <div>
    //         <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
    //           {dataUser?.name}
    //         </h3>
    //         <p className=" -my-1.5">
    //           {dataUser.online ? (
    //             <span className="text-[#00acb4] text-sm">Online</span>
    //           ) : (
    //             <span className="text-slate-400">Offline</span>
    //           )}
    //         </p>
    //       </div>
    //     </div>
    //     <div>
    //       <button className="cursor-pointer">
    //         <HiDotsVertical />
    //       </button>
    //     </div>
    //   </header>

    //   {/* Show all messages  */}
    // <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar ">
    //   {/* Upload Image Display  */}

    //   {/* all Messages shows here*/}
    //   {
    //     <div className="flex flex-col gap-2 py-2 px-2">
    //       {allMessages.map((msg, index) => {
    //         return (
    //           <div
    //             ref={currentMessage}
    //             className={`bg-white rounded w-fit p-1 py-2 max-w-[200px] md:max-w-sm  lg:max-w-md${
    //               user._id === msg.msgByUserI ? "ml-auto bg-teal-100" : ""
    //             }`}
    //           >
    //            <div>
    //              {msg?.imageUrl && (<img src={msg?.imageUrl} className="w-full h-full object-scale-down"/>)}
    //            </div>
    //            <div>
    //              {msg?.videoUrl && (<video src={msg?.videoUrl} className="w-full h-full object-scale-down" controls loop autoPlay />)}
    //            </div>
    //             <p className="px-2 pt-2">{msg.text}</p>
    //             <p className="text-xs ml-auto w-fit">
    //               {moment(msg.createdAt).format("hh:mm")}
    //             </p>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   }
    //   {message.imageUrl && (
    //     <div className="w-full absolute sticky bottom-0 h-full  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
    //       <div className="bg-white ">
    //         <div
    //           className="w-fit p-2 absolute top-0 right-0 text-black text-[30px] font-bold cursor-pointer hover:text-red-500"
    //           onClick={handleClearUploadImage}
    //         >
    //           &times;
    //         </div>
    //         <img
    //           src={message?.imageUrl}
    //           width={400}
    //           height={400}
    //           alt="upload image"
    //           className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
    //         />
    //       </div>
    //     </div>
    //   )}

    //   {/* handle upload video display*/}
    //   {message.videoUrl && (
    //     <div className="w-full h-full  bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
    //       <div className="bg-white ">
    //         <div
    //           className="w-fit p-2 absolute top-0 right-0 text-black text-[30px] font-bold cursor-pointer hover:text-red-500"
    //           onClick={handleClearUploadVideo}
    //         >
    //           &times;
    //         </div>
    //         <video
    //           src={message?.videoUrl}
    //           alt="upload image"
    //           className="aspect-video w-full h-full max-w-sm m-2"
    //           controls
    //           autoPlay
    //           muted
    //         />
    //       </div>
    //     </div>
    //   )}

    //     {loading && (
    //       <div className="w-full h-full flex items-center justify-center">
    //         <Loader />
    //       </div>
    //     )}
    //   </section>

    //   {/* sedn message  */}

    //   <section className="h-16 bg-white flex items-center ">
    //
    //       {/* Video and Image  */}
    //   {openImageVideoUpload && (
    //     <div className="bg-white shadow rounded absolute bottom-[64px] w-36 p-2 m-0.5">
    //       <form>
    //         <label
    //           htmlFor="upload Image"
    //           className="flex items-center gap-3 p-2 hover:bg-slate-200 cursor-pointer"
    //         >
    //           <div className="text-[#00acb4]">
    //             <FaImage size={18} />
    //           </div>
    //           <p>Image</p>
    //         </label>
    //         <label
    //           htmlFor="upload Video"
    //           className="flex items-center gap-3 p-2 hover:bg-slate-200 cursor-pointer"
    //         >
    //           <div className="text-purple-500">
    //             <FaVideo size={18} />
    //           </div>
    //           <p>Video</p>
    //         </label>
    //         <input
    //           type="file"
    //           className="hidden"
    //           id="upload Image"
    //           onChange={handleUploadImage}
    //         />
    //         <input
    //           type="file"
    //           className="hidden"
    //           id="upload Video"
    //           onChange={handleUploadVideo}
    //         />
    //       </form>
    //     </div>
    //   )}
    // </div>

    // </div>
  );
}

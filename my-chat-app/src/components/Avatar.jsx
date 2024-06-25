import React from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

export default function Avatar({ userId, name, imageUrl, width, height }) {
  const onlineUser = useSelector(state=> state?.user?.onlineUser)
  console.log("onlineUser",onlineUser)
  
  let avatarName = "";
  if (name) {
    const splitName = name.split("");
    if (splitName.length > 1) {
      avatarName = splitName[0][0] + splitName[1][0];
    } else {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-cyan-200",
    "bg-sky-200",
    "bg-blue-200"
  ];

  const isOnline = onlineUser.includes(userId)
  console.log("isOnline: ", isOnline)
  const randomNo = Math.floor(Math.random() * 9)
  return (
    <div
      className={`relative text-slate-800 rounded-full shadow border text-lg font-bold ${bgColor[randomNo]}`}
      style={{ width: width + "px", height: height + "px" }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          style={{ width: width + "px", height: height + "px" }}
          className="rounded-full"
        />
      ) : name ? (
        <div
          style={{ width: width + "px", height: height + "px" }}
          className="overflow-hidden rounded-full flex justify-center items-center"
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle size={width} />
      )}
      {isOnline && (<div className="bg-green-600 p-1 absolute bottom-1 right-0 z-100 rounded-full "></div>)}
    </div>
  );
}

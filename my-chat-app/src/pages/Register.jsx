import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function Register() {
    const navigate = useNavigate()
    const [uploadPhoto, setUploadPhoto] = useState("")
    const handleUploadPhoto = async(e) =>{
        const file = e.target.files[0]

        const uploadPhoto = await uploadFile(file)
        console.log("upload photo", uploadPhoto)
        setUploadPhoto(uploadPhoto)
        setData((prev) => {
          return {
            ...prev,
           profile_pic: uploadPhoto.secure_url,
          };
        });
        
    }
    const clearUploadPhoto =(e)=>{
        e.preventDefault();
        e.stopPropagation();
        setUploadPhoto("")
    }
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    console.log(data)
  };


  const handleSubmit = async(e) =>{
    e.preventDefault()
    e.stopPropagation()
    
    const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/user`

    try {
        const response = await axios.post(url, data)
        console.log("response: ", response)
        toast.success(response.data.message)
        if(response.data.success){
            setData({
              name: "",
              email: "",
              password: "",
              profile_pic: "",
            });
            navigate("/email")
        }
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error)
    }

    
  }
  return (
    <div className="mt-8">
      <div className="bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
        <h3 className="text-[#00acb4]">Welcome to Chidera Chat App!</h3>

        <form action="" className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus: outline-primary"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">password: </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">
              Photo:
              <div className="h-14 bg-slate-200 flex justify-center items-center border  hover:border-[#00acb4 cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">{uploadPhoto.name?uploadPhoto.name:"Upload profile Photo"}</p>
                {uploadPhoto && <button className="text-lg ml-2" onClick={clearUploadPhoto}><IoMdClose/></button>}
              </div>
            </label>
            <input
              type="file"
              name=""
              id="profile_pic"
              onChange={handleUploadPhoto}
              className='bg-slate-100 px-2 py-1 focus: outline-primary hidden'
           
            />
          </div>
          <button className="bg-[#00acb4] rounded mt-3 font-bold leading-tight tracking-wide text-white hover:bg-[#058187] text-lg px-4 py-1">Register</button>

          <p className="my-2 text-center">Already have an Account? <Link className="hover:text-[#00acb4] font-semibold" to={"/email"}>Login</Link></p>
        </form>
      </div>
    </div>
  );
}

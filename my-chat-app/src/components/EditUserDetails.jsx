import React, { useRef, useState } from 'react'
import Avatar from './Avatar'
import { uploadFile } from '../helpers/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

export default function EditUserDetails({onClose, user}) {
  const dispatch = useDispatch()
    const [data, setData] = useState({
        name: user?.name,
        profile_pic: user?.profile_pic
    })

    const handleOnChange = (e) =>{
        const {name, value} = e.target

        setData((prev)=>{
            return{
                ...prev, [name]: value
            }
        })
    }

    const uploadPhotoRef = useRef()

    const handleOpenUploadPhoto = (e) =>{
      e.preventDefault()
      e.stopPropagation()
      uploadPhotoRef.current.click()
    }

     const handleUploadPhoto = async (e) => {
       e.preventDefault();
       e.stopPropagation();
  
       const file = e.target.files[0];

       const uploadPhoto = await uploadFile(file);
       console.log("upload photo", uploadPhoto);
       
       setData((prev) => {
         return {
           ...prev,
           profile_pic: uploadPhoto.secure_url,
         };
       });
     };

     const handleSubmit = async(e)=>{
      e.preventDefault()
      e.stopPropagation()
      const URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/user/update-user`;
      
      console.log(data)
      try {
        const response = await axios.post(URL, data, {headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}})
        console.log(response)
        if(response?.data?.success){
          dispatch(setUser(response.data.data.userInformation))
          toast.success(response?.data?.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "An Error Occured while trying to update your profile")
      }
     }
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
      <div className="bg-white py-6 p-4 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit User Details</p>
        <form action="" className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full border py-1 px-2 focus:outline-bg-[#00acb4] border-0.5 "
            />
          </div>
          <div>
            <label htmlFor="profile_pic">Photo: </label>
            <div className="my-1 flex items-center gap-4">
              <Avatar
                width={40}
                height={40}
                name={data?.name}
                imageUrl={user?.profile_pic || data?.profile_pic}
              />
              <button className="font-semibold" onClick={handleOpenUploadPhoto}>
                Change Photo
              </button>
              <input
                type="file"
                id="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </div>
          </div>
          <Divider/>
          <div className="flex w-fit gap-2 ml-auto">
            <button
              className="border-[#00acb4] border px-4 py-1 text-[#00acb4] rounded hover:text-white hover:bg-[#00acb4]"
              onClick={() => onClose()}
            >
              Cancel
            </button>
            <button onClick={handleSubmit} className="border-[#00acb4] border px-4 py-1 text-white rounded bg-[#00acb4]">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

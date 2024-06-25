import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import Loader from './Loader';
import UserSearch from './UserSearch';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function SearchUser({onClose}) {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")

    const handleSearchUser = async()=>{
        const URL =`${import.meta.env.VITE_BACKEND_BASE_URL}/user/search-user`
        try {
            setLoading(true)
            const response = await axios.post(URL, {search: search})
            console.log(response)
            setLoading(false)
            setSearchUser(response.data.data)
            
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    useEffect(()=>{
        handleSearchUser()
    }, [search])
  return (
    <div className="fixed inset-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-10">
        <div className="bg-white rounded h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search user by name, email...."
            className="w-full py-1 h-full px-4 outline-none"
            onChange={(e)=>{setSearch(e.target.value)}}
            value={search}
          />

          <div className="h-14 w-14 flex items-center justify-center">
            <IoSearchOutline size={20} onClick={handleSearchUser} />
          </div>
        </div>

        {/* Display  Search Users */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {/* No User Found ?  */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-500">No user Found!</p>
          )}

          {loading && (
            // <p className="text-center text-slate-500">No user Found!</p>
            <div className='justify-center items-center flex'>
                <Loader/>
            </div>
            
          )}

          {
            searchUser.length !==0 && !loading && (
                searchUser.map((user, index)=>{
                    return <UserSearch key={user._id} user={user} onClose={onClose}/>
                })
            )
          }
        </div>
      </div>
    </div>
  );
}

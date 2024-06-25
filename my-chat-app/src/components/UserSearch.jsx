import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom';

export default function UserSearch({user, onClose}) {
  return (
    <Link to={`/${user?._id}`} onClick={()=>onClose()}  className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border-[#00acb4] rounded cursor-pointer' >
      <div>
        <Avatar
          imageUrl={user?.profile_pic}
          name={user.name}
          width={50}
          height={50}
          userId={user?._id}
        />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">
            {user?.name}
            </div>
            <p className='text-sm text-ellipsis'>{user?.email}</p>
        
      </div>
    </Link>
  );
}

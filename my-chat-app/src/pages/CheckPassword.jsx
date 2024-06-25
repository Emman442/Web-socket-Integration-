import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";
export default function CheckPassword() {
  const navigate = useNavigate();
  const location = useLocation()
  const dispatch = useDispatch()

  const [data, setData] = useState({
    password: "",
    userId: `${location?.state?.data?.emailAlreadyExists?._id}`,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(data)

    const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/user/password`;

    try {
      const response = await axios.post(url, data, {withCredentials: true});
      console.log("response: ", response);
      
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setToken(response?.data?.token));

        console.log("inside dispatch: ", response?.data?.data?.user);
        dispatch(setUser(response?.data?.data?.user))
        localStorage.setItem("token", response?.data?.token);
        
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message|| "An Error Occured!");
      console.log(error);
    }
  };

  return (
    <div className="mt-8">
      <div className="bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mb-2 mx-auto flex flex-col items-center gap-2">
          <Avatar width={70} name={location.state.name} imageUrl={location.state.profile_pic} height={70}/>
          <h2 className="font-semibold text-lg">{location?.state?.data?.emailAlreadyExists?.name}</h2>
        </div>
        <h3 className="text-[#00acb4]">Welcome to Chidera Chat App!</h3>

        <form action="" className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleChange}
            />
          </div>

          <button className="bg-[#00acb4] rounded mt-3 font-bold leading-tight tracking-wide text-white hover:bg-[#058187] text-lg px-4 py-1">
            Let's Go &rarr;
          </button>

          <p className="my-2 text-center">
           
            <Link
              className="hover:text-[#00acb4] font-semibold"
              to={"/forgot-password"}
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {PiUserCircle} from "react-icons/pi"
import toast from "react-hot-toast";
import axios from "axios";
export default function CheckEmail() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
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

    const url = `${import.meta.env.VITE_BACKEND_BASE_URL}/user/email`;

    try {
      const response = await axios.post(url, data);
      console.log("response: ", response);
      toast.success(response.data.message);
      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
            state: response?.data
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An Unexpected Errror Occured!");
      console.log(error);
    }
  };
  return (
    <div className="mt-8">
      <div className="bg-white w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">

        <div className="w-fit mb-2 mx-auto">
            <PiUserCircle size={80}/>
        </div>
        <h3 className="text-[#00acb4]">Welcome to Chidera Chat App!</h3>

        <form action="" className="grid gap-3" onSubmit={handleSubmit}>
         
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
         
          <button className="bg-[#00acb4] rounded mt-3 font-bold leading-tight tracking-wide text-white hover:bg-[#058187] text-lg px-4 py-1">
            Let's Go &rarr;
          </button>

          <p className="my-2 text-center">
            New User?{" "}
            <Link className="hover:text-[#00acb4] font-semibold" to={"/register"}>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

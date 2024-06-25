import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { logout, setOnlineUser, setUser } from "../redux/userSlice";
import Sidebar from "../components/Sidebar";
import Logo from "../assets/react.svg";
import { useSocket } from "../contexts/SocketContext";

export default function Home() {
  const socketConnection = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const socket = socketConnection

  console.log("redux user: ", user);

  const fetchUserDetails = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/user/user-details`;
    try {
      const response = await axios({
        url: URL,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        withCredentials: true,
      });

      dispatch(setUser(response.data?.data?.user));
;
      if (response.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (!socketConnection || !socketConnection.socket.current) return;

    const socket = socketConnection.socket.current

    const handleConnection = () =>{
      console.log("Connected Successfully!")
    }
    
    const handleOnlineUser = (data) => {
      console.log("online Data!!!!", data);
      dispatch(setOnlineUser(data));
    };

   
   socket.on("connect", handleConnection);
   socket.on("onlineUser", handleOnlineUser);

    return () => {
      socket.off("connect", handleConnection);
     socket.off("onlineUser", handleOnlineUser);
    };
  }, [socketConnection, dispatch]);

  const basePath = location.pathname === "/";

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />
      </section>
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div
        className={`items-center justify-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src={Logo} width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select a User to send message to
        </p>
      </div>
    </div>
  );
}

// import axios from "axios";
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, Outlet, useLocation } from "react-router-dom";
// import { logout, setOnlineUser, setUser } from "../redux/userSlice";
// import Sidebar from "../components/Sidebar";
// import Logo from "../assets/react.svg"
// import io from "socket.io-client"
// import { useSocket } from "../contexts/SocketContext";

// export default function Home() {
//   const socketConnection = useSocket()
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation()

//   const user = useSelector((state) => state.user);
//   console.log("redux user: ", user);

//   const fetchUserDetails = async () => {
//     const URL = `${import.meta.env.VITE_BACKEND_BASE_URL}/user/user-details`;
//     try {
//       const response = await axios({
//         url: URL,
//         method: "GET",
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         withCredentials: true,
//       });

//       dispatch(setUser(response.data?.data?.user));
//       console.log("Current User Details: ", response);
//       if (response.data.logout) {
//         dispatch(logout());
//         navigate("/email");
//       }
//     } catch (error) {
//       console.log("error", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails();
//   }, []);

//Socket connection
// useEffect(()=>{
//   // const socketConnection = io(import.meta.env.VITE_SOCKET, {
//   //   auth: {
//   //     token: localStorage.getItem("token")
//   //   },
//   //   withCredentials: true
//   // })

//    socketConnection.on("connection", ()=>{
//     console.log("connected!")
//    })

//    socketConnection.on("onlineUser", (data)=>{

//     dispatch(setOnlineUser(data))
//    })
//   //  dispatch(setSocketConnection(socketConnection))

//   return ()=>{

//     socketConnection.disconnect()
//   }
// }, [])

//     if (!socketConnection) return;
//     console.log("inside Use Effect", socketConnection)

//     socketConnection.on("connection", () => {
//       console.log("connected!");
//     });
// //
//     socketConnection.on("onlineUser", (data) => {
//       console.log("online Data!", data)
//       dispatch(setOnlineUser(data));
//     });

//     return () => {
//       socketConnection.off("connection");
//       socketConnection.off("onlineUser");
//     };

//   const basePath = location.pathname === '/'

//   return (
//     <div className="grid lg:grid-cols-[320px,1fr] h-screen max-h-screen">
//       <section className={`bg-white ${basePath && "hidden"}`}>
//         <Sidebar />
//       </section>
//       <section className={`${basePath && "hidden"}`}>
//         <Outlet />
//       </section>
//       <div className={`lg:flex items-center justify-center flex-col gap-2 hidden ${basePath ?'hidden':'lg:flex'}`}>
//         <div >
//           <img src={Logo} width={250} alt="logo" />
//         </div>
//         <p className="text-lg mt-2 text-slate-500">Select a User to send message to</p>
//       </div>
//     </div>
//   );

// }

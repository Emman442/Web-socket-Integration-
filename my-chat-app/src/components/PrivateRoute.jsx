import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(
    function () {
      if (!token) navigate("/home");
    },
    [token, navigate]
  );
  if (!token) {
    return <Navigate to={"/home"} />;
  }
  return children;
}

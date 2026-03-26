import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("accesstoken");

  if (!token || !user?._id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token"); // Fetch JWT token from localStorage

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if no token
    }
  }, [token, navigate]);

  return token; // You can return the token if needed
};

export default useAuth;

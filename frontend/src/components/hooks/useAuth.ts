import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const navigate = useNavigate();
  const [checkingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/session", {
          method: "GET",
          credentials: "include", // 🔹 Ensures session cookies are sent
        });
    
        const data = await response.json();
    
        if (!response.ok || !data.logged_in) {
          navigate("/login"); // Redirect to login if session is invalid
        }
      } catch (error) {
        console.error("Session check failed:", error);
        navigate("/login");
      }
    };        

    checkSession();
  }, [navigate]);

  return checkingSession;
};

export default useAuth;

import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useUser } from "../../../context/UserContext";
import userService from "../../../services/userService";

const LoginForm: React.FC = () => {
  const theme = useTheme();
  const { login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const loginResponse = await userService.loginUser(email, password);
      console.log("Login response:", loginResponse);
      // Fetch full user profile by ID

      const profileResponse = await userService.getUserById(
        loginResponse.user.id
      );
      console.log("prodf:", profileResponse);
      loginResponse.user.stats = profileResponse.stats;
      console.log("Login response with stats:", loginResponse);
      login(loginResponse.user);
      console.log("U");
      setMessage(
        `Welcome, ${loginResponse.user.name} ${loginResponse.user.surname}!`
      );
      navigate("/home");
    } catch (error: any) {
      setMessage(`Login failed: ${error.message || error}`);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = "http://localhost:5000/auth/login/google";

    // other logic handled by backend redirect
  };

  // Handle Orcid login
  const handleOrcidLogin = () => {
    // Redirect to backend ORCID OAuth if implemented
    window.location.href = "http://localhost:5000/auth/login/orcid";

    // other logic handled by backend redirect
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: theme.palette.background.default, // Dynamic background
        color: theme.palette.text.primary, // Dynamic text color
      }}
    >
      <Box
        sx={{
          width: "350px",
          padding: "2rem",
          borderRadius: "8px",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1E1E1E" : "#FFFFFF",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 0px 10px rgba(255, 255, 255, 0.2)"
              : "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <FaUser style={{ marginRight: "8px" }} />,
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <FaLock style={{ marginRight: "8px" }} />,
              }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body2">
              <input type="checkbox" /> Remember me
            </Typography>
            <Typography
              variant="body2"
              sx={{ cursor: "pointer", color: theme.palette.secondary.main }}
            >
              Forgot Password?
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "#fff",
              mb: 2,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              mb: 1,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
              },
            }}
          >
            Google Login
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={handleOrcidLogin}
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.text.primary,
              "&:hover": {
                backgroundColor:
                  theme.palette.mode === "dark" ? "#333" : "#f5f5f5",
              },
            }}
          >
            Orcid Login
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <a href="/register" style={{ color: theme.palette.secondary.main }}>
              Register
            </a>
          </Typography>

          {message && (
            <Typography align="center" sx={{ mt: 2, color: "red" }}>
              {message}
            </Typography>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;

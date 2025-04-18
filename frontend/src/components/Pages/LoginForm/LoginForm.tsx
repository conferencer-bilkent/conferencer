import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import Topbar from "../../global/TopBar";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";

const LoginForm: React.FC = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensures session cookies are sent for authentication
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Welcome, ${data.user.name} ${data.user.surname}!`);
        navigate("/home");
      } else {
        setMessage(`Login failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error occurred during login: ${error}`);
    }
  };

  return (
    <>
      <Topbar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.default, // Dynamic background
          color: theme.palette.text.primary, // Dynamic text color
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
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

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
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
              onClick={() => window.location.href = "http://localhost:5000/auth/login/google"}
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
              <a
                href="/register"
                style={{ color: theme.palette.secondary.main }}
              >
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
    </>
  );
};

export default LoginForm;
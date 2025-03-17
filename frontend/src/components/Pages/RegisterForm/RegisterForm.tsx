import React, { useState, } from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { FaUser, FaLock, FaRegUser } from "react-icons/fa";
//import { ColorModeContext } from "../../../theme"; // Ensure correct path
import Topbar from "../../global/TopBar"; // Import Topbar for theme toggle

const RegisterForm: React.FC = () => {
  const theme = useTheme();
  //const colorMode = useContext(ColorModeContext);

  const [name, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requestData = { name, surname, email, password };

    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        setMessage("User registered successfully");
      } else {
        const errorData = await response.json();
        setMessage(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      setMessage(`Error occurred during registration: ${error}`);
    }
  };

  return (
    <>
      <Topbar /> {/* Ensures theme switching */}
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: theme.palette.background.default, // Theme-based background
          color: theme.palette.text.primary, // Theme-based text color
        }}
      >
        <Box
          sx={{
            width: "400px",
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
            Register
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="First Name"
                value={name}
                onChange={(e) => setFirstName(e.target.value)}
                InputProps={{
                  startAdornment: <FaRegUser style={{ marginRight: "8px" }} />,
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Last Name"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                InputProps={{
                  startAdornment: <FaRegUser style={{ marginRight: "8px" }} />,
                }}
              />
            </Box>

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
              Register
            </Button>

            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: theme.palette.secondary.main }}>
                Login
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

export default RegisterForm;

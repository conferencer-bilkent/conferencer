import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Pages/LoginForm/LoginForm";
import RegisterForm from "./components/Pages/RegisterForm/RegisterForm";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ConferencePage from "./components/Pages/Conference/ConferencePage";
import HomePage from "./components/Pages/Home/Homepage";

const App: React.FC = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme.palette.background.default,
          }}
        >
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<ConferencePage />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/conference" element={<ConferencePage />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </Router>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;

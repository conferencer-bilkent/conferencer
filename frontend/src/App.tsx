import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Pages/LoginForm/LoginForm";
import RegisterForm from "./components/Pages/RegisterForm/RegisterForm";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ConferencePage from "./components/Pages/Conference/ConferencePage";
import HomePage from "./components/Pages/Home/Homepage";

import MyTasks from "./components/Pages/MyTasks/MyTasks";
import ReviewsPage from "./components/Pages/Conference/components/Reviews/ReviewsPage";
import ProfilePage from "./components/Pages/Profile/ProfilePage";


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
            transition:
              "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
          }}
        >
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/conference" element={<ConferencePage />} />
                <Route path="/mytasks" element={<MyTasks />} />
                <Route path="/review" element={<ReviewsPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                <Route path="/" element={<LoginForm />} />
              </Routes>
            </div>
          </Router>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;

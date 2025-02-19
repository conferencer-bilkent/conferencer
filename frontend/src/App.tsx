import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Pages/LoginForm/LoginForm";
import RegisterForm from "./components/Pages/RegisterForm/RegisterForm";
import HomePage from "./components/Pages/Home/Homepage.tsx";
import {ThemeProvider, CssBaseline} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
const App: React.FC = () => {

  //sample use of theme, also see LoginForm
  const [theme, colorMode] = useMode();
  return (
    <GoogleOAuthProvider clientId="957813325622-dvrciioe73t4dorpokic7evbfihh6kim.apps.googleusercontent.com">
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {<Route path="/home" element ={<HomePage />} />}
            {/* You can set the default route to be the login page */}
            <Route path="/" element={<LoginForm />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
    </ColorModeContext.Provider>
    </GoogleOAuthProvider>
  );
};

export default App;
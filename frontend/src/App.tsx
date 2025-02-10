import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Pages/LoginForm/LoginForm";
import RegisterForm from "./components/Pages/RegisterForm/RegisterForm";
import HomePage from "./components/Pages/Home/Homepage.tsx";
import {ThemeProvider, CssBaseline} from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
const App: React.FC = () => {

  //sample use of theme, also see LoginForm
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            {<Route path="/home" element ={<HomePage />} />}
            {/* You can set the default route to be the login page */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Pages/LoginForm/LoginForm";
import RegisterForm from "./components/Pages/RegisterForm/RegisterForm";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ConferencePage from "./components/Pages/Conference/ConferencePage";
import CreateConference from "./components/Pages/Conference/CreateConference/CreateConference";
import HomePage from "./components/Pages/Home/Homepage";

import MyTasks from "./components/Pages/MyTasks/MyTasks";
import ReviewsPage from "./components/Pages/Conference/components/Reviews/ReviewsPage";

import ProfilePage from "./components/Pages/Profile/ProfilePage";

import ReviewDetailPage from "./components/Pages/Conference/components/Reviews/ReviewDetailPage";
import SubmissionsList from "./components/Pages/AddSubmissions/components/homePage/submissionsList/submissionsList";
import AddSubmissionPage from "./components/Pages/AddSubmissions/components/homePage/addSubmission/addSubmission";
import { SubmissionProvider } from "./context/addSubmissionContext";
import { UserProvider } from "./context/UserContext";


const App: React.FC = () => {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
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
                  <Route path="/conference/create" element={<CreateConference />} />
                  <Route path="/mytasks" element={<MyTasks />} />
                  <Route path="/review" element={<ReviewsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/reviews" element={<ReviewDetailPage />} />
                  <Route path="/ex" element={<SubmissionsList />}></Route>
                  <Route
                    path="/addSubmission"
                    element={
                      <SubmissionProvider>
                        <AddSubmissionPage />
                      </SubmissionProvider>
                    }
                  />


                  <Route path="/" element={<LoginForm />} />
                </Routes>
              </div>
            </Router>
          </Box>
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;

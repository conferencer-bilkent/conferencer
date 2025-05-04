import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/Pages/LoginForm/LoginForm";
import RegisterForm from "./components/Pages/RegisterForm/RegisterForm";
import { ThemeProvider, CssBaseline } from "@mui/material";
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
import { ConferenceProvider } from "./context/ConferenceContext";
import ChatPage from "./components/Pages/Chat/ChatPage";
import NotificationsPage from "./components/Pages/Notifications/Notifications";
import CreateTrack from "./components/Pages/Conference/CreateTrack/CreateTrack";
import SideMenu from "./components/global/SideMenu";
import TopBar from "./components/global/TopBar";
import ConferenceOverview from "./components/Pages/Conference/ConferenceOverview";
import ReviewPage from "./components/Pages/Review/ReviewPage";
import { NotificationsProvider } from "./context/NotificationsContext";

const App: React.FC = () => {
  const [theme, colorMode] = useMode();
  const menuItems = [
    "CONFERENCES",
    "PROFILE",
    "MY TASKS",
    "MY ROLES",
    "NOTIFICATIONS",
    "CHATS",
    "SETTINGS",
    "LOG OUT",
  ];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <NotificationsProvider>
            <ConferenceProvider>
              <Router>
                <Routes>
                  <Route
                    path="/login"
                    element={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                        }}
                      >
                        <LoginForm />
                      </div>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                        }}
                      >
                        <LoginForm />
                      </div>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100vh",
                        }}
                      >
                        <RegisterForm />
                      </div>
                    }
                  />
                  <Route
                    path="*"
                    element={
                      <div
                        style={{
                          display: "flex",
                          height: "100vh",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflow: "hidden",
                            marginLeft: "20px",
                          }}
                        >
                          <TopBar />
                          <SideMenu items={menuItems} />
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "240px", // Adjust based on TopBar width
                          }}
                        >
                          <div
                            style={{
                              flex: 1,
                              overflowY: "auto",
                              marginTop: "64px",
                            }}
                          >
                            <Routes>
                              <Route path="/home" element={<HomePage />} />
                              <Route
                                path="/conference"
                                element={<ConferencePage />}
                              />
                              <Route
                                path="/conference/create"
                                element={<CreateConference />}
                              />
                              <Route
                                path="/conference/createTrack"
                                element={<CreateTrack />}
                              />
                              <Route
                                path="/conference/overview"
                                element={<ConferenceOverview />}
                              />
                              <Route path="/tasks" element={<MyTasks />} />
                              <Route
                                path="/notifications"
                                element={<NotificationsPage />}
                              />
                              <Route path="/chat" element={<ChatPage />} />
                              <Route path="/review" element={<ReviewsPage />} />
                              <Route
                                path="/profile/:id"
                                element={<ProfilePage />}
                              />
                              <Route
                                path="/review/detail"
                                element={<ReviewDetailPage />}
                              />
                              <Route
                                path="/ex"
                                element={<SubmissionsList />}
                              ></Route>
                              <Route
                                path="/addSubmission"
                                element={
                                  <SubmissionProvider>
                                    <AddSubmissionPage />
                                  </SubmissionProvider>
                                }
                              />
                              <Route
                                path="/review/:paperId"
                                element={<ReviewPage />}
                              />
                            </Routes>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </Routes>
              </Router>
            </ConferenceProvider>
          </NotificationsProvider>
        </UserProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;

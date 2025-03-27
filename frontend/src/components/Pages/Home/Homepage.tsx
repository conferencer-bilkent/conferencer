import React from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppTitle, { SectionTitle } from "../../global/AppTitle";
//import useAuth from "../../hooks/useAuth";
import "./Homepage.css";

const menuItems = [
  "MY TASKS",
  "MY ROLES",
  "CONFERENCES",
  "NOTIFICATIONS",
  "CHATS",
  "SETTINGS",
  "PROFILE",
  "LOG OUT",
];

const Homepage: React.FC = () => {
  const navigate = useNavigate();
  //useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleItemClick = (item: string) => {
    if (item === "LOG OUT") {
      handleLogout();
    } else {
      console.log("Clicked:", item);
    }
  };

  return (
    <>
      <Topbar></Topbar>
      <div className="homepage-container">
        {/* Side Menu on the left */}
        <SideMenu items={menuItems} onItemClick={handleItemClick} />

        {/* Container on the right */}
        <div className="content-container">
          {/* Upcoming Conferences Section */}
          <div className="section">
            <SectionTitle text="Upcoming Conferences" />
            <AppTitle text="OS FAIR 2024" />
            <AppTitle text="BILKENT CONFERENCE 2025" />
          </div>

          {/* Past Conferences Section */}
          <div className="section">
            <SectionTitle text="Past Conferences" />
            <AppTitle text="BILKENT CONFERENCE 2023" />
            <AppTitle text="CS FAIR 2023" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;

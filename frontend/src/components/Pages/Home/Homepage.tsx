import React from "react";
// import { useNavigate } from "react-router-dom";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppTitle from "../../global/AppTitle";
import useAuth from "../../hooks/useAuth";
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

  useAuth();
  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);
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
          <h2 className="section-title">Upcoming Conferences</h2>
          <AppTitle text="OS FAIR 2024" />
          <AppTitle text="BILKENT CONFERENCE 2025" />
        </div>

        {/* Past Conferences Section */}
        <div className="section">
          <h2 className="section-title">Past Conferences</h2>
          <AppTitle text="BILKENT CONFERENCE 2023" />
          <AppTitle text="CS FAIR 2023" />
        </div>
      </div>
    </div>

    </>
  );
};

export default Homepage;


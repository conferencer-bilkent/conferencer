import React from "react";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppTitle from "../../global/AppTitle";
import "./Homepage.css"; // Import the CSS file

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
  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);
  };

  return (
    <div className="homepage-container">
      {/* Side Menu on the left */}
      <SideMenu items={menuItems} onItemClick={handleItemClick} />

      {/* Container on the right */}
      <div className="content-container">
        {/* AppTitle components stacked vertically */}
        <AppTitle text="CS FAIR 2024 - Day 1" />
        <AppTitle text="CS FAIR 2024 - Day 2" />
      </div>
    </div>
  );
};

export default Homepage;
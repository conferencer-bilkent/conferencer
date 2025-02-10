import React from "react";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";

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
    <div className="flex">
      <SideMenu items={menuItems} onItemClick={handleItemClick} />
      {/* <div className="flex-grow">
        <Topbar />
      </div> */}
    </div>
  );
};

export default Homepage;

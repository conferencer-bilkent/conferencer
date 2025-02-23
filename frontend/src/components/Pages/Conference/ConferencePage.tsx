import React from 'react';
import AppButton from '../../global/AppButton';// Import the AppButton component
import { FaVideo, FaMicrophone } from 'react-icons/fa'; // Example icons from react-icons library
import ConferenceDetail, { ConferenceDetailExample } from './components/ConferenceDetail';
import AppTitle from '../../global/AppTitle';
import SideMenu from '../../global/SideMenu';
import { getMenuItemsForPage } from '../../global/sideMenuConfig';
import './ConferencePage.css'; // Import the CSS file


const ConferencePage: React.FC = () => {
  const menuItems = getMenuItemsForPage("home");
  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);
  };

  return (
    <div className="conference-page">
      <div className="conference-container">
        <div className="side-menu-container">
          <SideMenu items={menuItems} onItemClick={handleItemClick}/>
        </div>
        <div className="content-container">
          <AppTitle text="CS FAIR 2025" />
          <AppButton icon={<FaVideo />} text="Start Video" />
          <AppButton icon={<FaMicrophone />} text="Mute Audio" />
          <ConferenceDetailExample />
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;
import React from 'react';
import './SideMenu.css'; // Import the CSS file

interface SideMenuProps {
  items?: string[];
}

const SideMenu: React.FC<SideMenuProps> = ({ items = [
  'MY TASKS',
  'MY ROLES',
  'CONFERENCES',
  'NOTIFICATIONS',
  'CHATS',
  'SETTINGS',
  'PROFILE',
  'LOG OUT'
] }) => {
  return (
    <div className="side-menu">
      <ul className="menu-list">
        {items.map((item, index) => (
          <li key={index} className="menu-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideMenu;
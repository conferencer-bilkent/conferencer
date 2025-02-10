import React from 'react';
import './AppButton.css';

interface AppButtonProps {
  icon: React.ReactNode;
  text: string;
}

const AppButton: React.FC<AppButtonProps> = ({ icon, text }) => {
  return (
    <button className="app-button">
      <div className="icon-wrapper">{icon}</div>
      <span className="button-text">{text}</span>
    </button>
  );
};

export default AppButton;
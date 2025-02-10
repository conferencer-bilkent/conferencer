import React from 'react';
import './AppTitle.css'; // Import the CSS file

interface AppTitleProps {
  text: string;
}

const AppTitle: React.FC<AppTitleProps> = ({ text }) => {
  return (
    <div className="app-title">
      {text}
    </div>
  );
};

export default AppTitle;
import React from "react";
import { Button, useTheme, Box } from "@mui/material";
import { tokens } from "../../theme"; // Import theme tokens

type AppButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
};

const AppButton: React.FC<AppButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button className="app-button" onClick={onClick}>
      <div className="icon-wrapper">{icon}</div>
      <span className="button-text">{text}</span>
    </button>
  );
};

export default AppButton;

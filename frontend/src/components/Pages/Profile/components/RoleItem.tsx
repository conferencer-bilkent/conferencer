import React from "react";
import { useTheme } from "@mui/material/styles";
import { FaLink } from "react-icons/fa";

interface RoleItemProps {
  name: string;
}

const RoleItem: React.FC<RoleItemProps> = ({ name }) => {
  const theme = useTheme();
  
  const roleItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderRadius: "20px",
    gap: "10px",
    border: `2px solid ${theme.palette.divider}`,
    marginBottom: "5px",
    color: theme.palette.text.primary,
  };

  const iconStyle: React.CSSProperties = {
    color: theme.palette.text.primary,
  };

  return (
    <div style={roleItemStyle}>
      <FaLink style={iconStyle} />
      <span>{name}</span>
    </div>
  );
};

export default RoleItem;
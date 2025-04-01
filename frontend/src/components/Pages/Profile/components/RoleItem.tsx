import React from "react";
import { FaLink } from "react-icons/fa";

interface RoleItemProps {
  name: string;
}

const RoleItem: React.FC<RoleItemProps> = ({ name }) => {
  return (
    <div style={roleItemStyle}>
      <FaLink style={iconStyle} />
      <span>{name}</span>
    </div>
  );
};

const roleItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px",
  borderRadius: "20px",
  gap: "10px",
  border: "1px solid white",
  marginBottom: "5px",
};

const iconStyle: React.CSSProperties = {
  color: "white",
};

export default RoleItem;
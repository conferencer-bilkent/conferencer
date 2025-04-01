import React from "react";
import { FaLink } from "react-icons/fa";

interface Role {
  name: string;
}

interface UserRolesProps {
  activeRoles: Role[];
  pastRoles: Role[];
}

const UserRoles: React.FC<UserRolesProps> = ({ activeRoles, pastRoles }) => {
  return (
    <div style={containerStyle}>
      {/* Active Roles Section */}
      <h3 style={titleStyle}>Active Roles</h3>
      <div style={listStyle}>
        {activeRoles.map((role, index) => (
          <div key={index} style={roleItemStyle}>
            <FaLink style={iconStyle} />
            <span>{role.name}</span>
          </div>
        ))}
      </div>

      {/* Past Roles Section */}
      <h3 style={{ ...titleStyle, marginTop: "20px" }}>Past Roles</h3>
      <div style={listStyle}>
        {pastRoles.map((role, index) => (
          <div key={index} style={roleItemStyle}>
            <FaLink style={iconStyle} />
            <span>{role.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline styles
const containerStyle: React.CSSProperties = {
  border: "1px solid white",
  borderRadius: "12px",
  padding: "15px",
  backgroundColor: "#2c3e50",
  color: "white",
  width: "100%",
};

const titleStyle: React.CSSProperties = {
  fontWeight: "bold",
  marginBottom: "10px",
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const roleItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#34495e",
  padding: "10px",
  borderRadius: "20px",
  gap: "10px",
};

const iconStyle: React.CSSProperties = {
  color: "white",
};

export default UserRoles;

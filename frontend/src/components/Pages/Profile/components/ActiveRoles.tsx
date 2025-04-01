import React from "react";
import RoleItem from "./RoleItem";

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
          <RoleItem key={index} name={role.name} />
        ))}
      </div>

      {/* Past Roles Section */}
      <h3 style={{ ...titleStyle, marginTop: "20px" }}>Past Roles</h3>
      <div style={listStyle}>
        {pastRoles.map((role, index) => (
          <RoleItem key={index} name={role.name} />
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

export default UserRoles;

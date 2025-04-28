import React from "react";
import RoleItem from "./RoleItem";
import { tokens } from "../../../../theme";
import { useTheme } from "@mui/material";

interface Role {
  name: string;
}

interface UserRolesProps {
  activeRoles: Role[];
  pastRoles: Role[];
}

const UserRoles: React.FC<UserRolesProps> = ({ activeRoles, pastRoles }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const containerStyle: React.CSSProperties = {
    border: `1px solid ${colors.grey[100]}`, // Match ProfileUserRoles border
    borderRadius: "12px",
    padding: "15px",
    color: "white",
    height: "100%",
    width: "100%",
  };
  
  const titleStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "10px",
    color: colors.grey[100],
    fontFamily: theme.typography.fontFamily,
  };
  
  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };
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


export default UserRoles;

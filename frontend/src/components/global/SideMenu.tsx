import React from "react";
import { useTheme, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useUser } from "../../context/UserContext"; // ✅ added

interface SideMenuProps {
  items: string[];
  onItemClick?: (item: string) => void; // Optional callback for item click
}

const SideMenu: React.FC<SideMenuProps> = ({ items }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { user } = useUser(); // ✅ use user context

  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);

    switch (item) {
      case "CONFERENCES":
        navigate("/home");
        break;
      case "PROFILE":
        if (user && user.id) {
          navigate(`/profile/${user.id}`); // ✅ dynamic /profile/id
        } else {
          navigate("/login");
        }
        break;
      case "MY TASKS":
        navigate("/tasks");
        break;
      case "MY ROLES":
        navigate("/roles");
        break;
      case "NOTIFICATIONS":
        navigate("/notifications");
        break;
      case "CHATS":
        navigate("/chat");
        break;
      case "SETTINGS":
        navigate("/settings");
        break;
      case "LOG OUT":
        console.log("Log out should be handled separately");
        break;
      default:
        console.log("No navigation defined for:", item);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "auto", sm: "250px" }, // Allow shrinking on small screens
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: { xs: "10px", sm: "0" }, // Add padding for small screens
        marginTop: "10vh", // Start at 1/3 of the page height
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(item)}
            style={{
              padding: "10px 20px",
              color: colors.grey[100],
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize,
              fontWeight: "bold",
              cursor: "pointer",
              borderBottom: `1px solid ${colors.grey[300]}`,
              borderRadius: "5px",
              transition: "background-color 0.3s, color 0.3s",
              textAlign: "center", // Center text for small screens
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.grey[900];
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.grey[100];
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default SideMenu;

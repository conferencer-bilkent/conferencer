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
  const [hoveredItem, setHoveredItem] = React.useState<number | null>(null);

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
      case "NOTIFICATIONS":
        navigate("/notifications");
        break;
      case "MY SUBMISSIONS":
        navigate("/submissions");
        break;
      case "CHATS":
        navigate("/chat");
        break;
      case "SETTINGS":
        navigate("/settings");
        break;
      case "LOG OUT":
        fetch("http://localhost:5000/auth/logout", {
          method: "POST",
          credentials: "include",
        })
          .then(() => {
            localStorage.removeItem("user");
            navigate("/login");
          })
          .catch((error) => {
            console.error("Logout failed:", error);
          });
        break;
      default:
        console.log("No navigation defined for:", item);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        width: { xs: "auto", sm: "250px" }, // Allow shrinking on small screens
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: { xs: "10px", sm: "0" }, // Add padding for small screens
        marginTop: "calc(100%/10)", // Start at 1/3 of the page height
        paddingLeft: "3rem", // Ensure left padding is 3rem
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(item)}
            style={{
              backgroundColor:
                hoveredItem === index ? colors.grey[600] : "transparent",
              padding: "10px 20px",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.h5.fontSize,
              fontWeight: "bold",
              cursor: "pointer",
              borderBottom: `1px solid ${colors.grey[300]}`,
              borderRadius: "5px",
              textAlign: "center", // Center text for small screens
            }}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default SideMenu;

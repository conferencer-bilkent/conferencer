import React from "react";
import { useTheme, Box } from "@mui/material";
import { tokens } from "../../theme"; // Import the theme tokens

interface SideMenuProps {
  items: string[];
  onItemClick: (item: string) => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ items, onItemClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        padding: "20px",
        borderRadius: "10px",
        width: "250px",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => onItemClick(item)}
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

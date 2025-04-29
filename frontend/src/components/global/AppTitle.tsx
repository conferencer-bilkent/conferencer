import React from "react";
import { Typography, useTheme, Box } from "@mui/material";
import { tokens } from "../../theme";

interface AppTitleProps {
  text: string;
  onClick?: () => void; // add optional onClick handler
}

const AppTitle: React.FC<AppTitleProps> = ({ text, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Typography
      variant="h4"
      onClick={onClick} // attach onClick
      sx={{
        cursor: onClick ? "pointer" : "default", // show pointer if clickable
        border: `2px solid ${colors.grey[100]}`,
        borderRadius: "20px",
        color: colors.grey[100],
        backgroundColor: colors.primary[1000],
        transition: "background-color 0.5s ease", // add transition for background color
        padding: "10px",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.h4.fontSize,
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {text}
    </Typography>
  );
};

export const SectionTitle: React.FC<{ text: string }> = ({ text }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        padding: "10px",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          color: colors.grey[100],
          transition: "color 0.5s ease", // add transition for color
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.h2.fontSize,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default AppTitle;

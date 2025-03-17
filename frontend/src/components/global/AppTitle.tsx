import React from "react";
import { Typography, useTheme, Box } from "@mui/material";
import { tokens } from "../../theme";

interface AppTitleProps {
  text: string;
}

const AppTitle: React.FC<AppTitleProps> = ({ text }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Typography
      variant="h4"
      sx={{
        border: `2px solid ${colors.grey[100]}`,
        borderRadius: "20px",
        color: colors.grey[100],
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

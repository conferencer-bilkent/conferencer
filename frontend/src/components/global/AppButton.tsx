import React from "react";
import { Button, useTheme, Box } from "@mui/material";
import { tokens } from "../../theme"; // Import theme tokens

interface AppButtonProps {
  icon: React.ReactNode;
  text: string;
}

const AppButton: React.FC<AppButtonProps> = ({ icon, text }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Button
      variant="contained"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          theme.palette.mode === "dark"
            ? colors.primary[600]
            : colors.primary[900],
        color: colors.grey[100],
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.h5.fontSize,
        fontWeight: "bold",
        padding: "10px 20px",
        borderRadius: "10px",
        transition: "background-color 0.3s, color 0.3s",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? colors.primary[500]
              : colors.primary[400],
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box>{icon}</Box>
        <span>{text}</span>
      </Box>
    </Button>
  );
};

export default AppButton;

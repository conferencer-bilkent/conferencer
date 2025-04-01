import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

type AppButtonProps = {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
};

const AppButton: React.FC<AppButtonProps> = ({ icon, text, onClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: isHovered
          ? theme.palette.mode === "dark"
            ? colors.grey[700]
            : colors.grey[200]
          : "transparent",
        width: "240px",
        height: "56px",
        border: `2px solid ${colors.grey[100]}`,
        borderRadius: "16px",
        padding: "8px 16px",
        color: colors.grey[100],
        cursor: "pointer",
        transition: "background-color 0.2s ease",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "12px",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {text}
      </span>
    </button>
  );
};

export default AppButton;

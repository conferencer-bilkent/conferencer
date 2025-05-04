import React, { useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { FaCheck, FaTimes } from "react-icons/fa"; // ensure these are installed

type AppButtonProps = {
  icon?: React.ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  color?: "red" | "green"; // new
};

const AppButton: React.FC<AppButtonProps> = ({
  icon,
  text,
  onClick,
  disabled = false,
  color,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isHovered, setIsHovered] = useState(false);

  // pick bg based on color prop
  let bg = colors.primary[1000];
  if (disabled) {
    bg = colors.grey[900];
  } else if (color === "red") {
    bg = isHovered ? colors.redAccent[400] : colors.redAccent[500];
  } else if (color === "green") {
    bg = isHovered ? colors.greenAccent[400] : colors.greenAccent[500];
  } else {
    bg = isHovered ? colors.grey[600] : colors.primary[1000];
  }

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: bg,
        width: "240px",
        height: "50px",
        border: `2px solid ${colors.grey[100]}`,
        borderRadius: "16px",
        padding: "8px 16px",
        color: colors.grey[100],
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon && (
        <div style={{ fontSize: 24, marginRight: 12 }}>
          {React.cloneElement(icon as React.ReactElement, {
            style: { width: 24, height: 24 },
          })}
        </div>
      )}
      <span
        style={{
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          flex: 1,
          textAlign: "center",
        }}
      >
        {text}
      </span>
    </button>
  );
};

export default AppButton;

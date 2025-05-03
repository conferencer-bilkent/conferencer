import React from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

type AppButtonProps = {
  icon?: React.ReactNode; // Made icon optional
  text: string;
  onClick?: () => void;
  disabled?: boolean;
};

const AppButton: React.FC<AppButtonProps> = ({
  icon,
  text,
  onClick,
  disabled = false,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [isHovered, setIsHovered] = React.useState(false);

  // Only apply hover state if not disabled
  const handleMouseEnter = () => {
    if (!disabled) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!disabled) setIsHovered(false);
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: disabled
          ? colors.grey[900] // Darker gray when disabled
          : isHovered
          ? theme.palette.mode === "dark"
            ? colors.grey[600]
            : colors.grey[600]
          : colors.primary[1000],
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
        <div
          style={{
            fontSize: "24px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "12px",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            style: {
              width: "24px",
              height: "24px",
              ...((icon as React.ReactElement)?.props?.style || {}),
            },
          })}
        </div>
      )}
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

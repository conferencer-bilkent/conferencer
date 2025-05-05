import React from "react";
import "./ConferenceDetail.css";

// import { FaBookOpen, FaPlusCircle } from "react-icons/fa";
// import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

interface TextInfo {
  title?: string;
  content: string;
  link?: string;
}

interface ButtonInfo {
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
  disabled?: boolean; // Added disabled property
  visibleTo?: 'all' | 'trackchairs' | 'superchairs' | 'members'; // Role-based visibility
}

interface ConferenceDetailProps {
  texts: TextInfo[];
  buttons: ButtonInfo[];
  description?: string;
  userRoles?: {
    isTrackchair?: boolean;
    isSuperchair?: boolean;
    isTrackMember?: boolean;
  };
}

const ConferenceDetail: React.FC<ConferenceDetailProps> = ({
  texts,
  buttons,
  description,
  userRoles = {},
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Default role values if not provided
  const { isTrackchair = false, isSuperchair = false, isTrackMember = false } = userRoles;

  // Helper function to determine if a button should be enabled for the current user
  const isButtonEnabledForUser = (button: ButtonInfo): boolean => {
    // If button has explicit disabled state, respect that
    if (button.disabled === true) {
      return false;
    }
    
    // Check role-based visibility
    switch (button.visibleTo) {
      case 'trackchairs':
        return isTrackchair || isSuperchair;
      case 'superchairs':
        return isSuperchair;
      case 'members':
        return isTrackMember || isTrackchair || isSuperchair;
      case 'all':
      default:
        return true;
    }
  };

  return (
    <div
      className="conference-detail"
      style={{
        border: `2px solid ${colors.grey[100]}`,
        backgroundColor: colors.primary[1000],
        color: colors.grey[100],
      }}
    >
      <div
        className="description-container"
        style={{
          borderRight: `2px solid ${colors.grey[100]}`,
        }}
      >
        <div className="description">
          {description ||
            "Description: orem ipsum dolor sit amet, consectetur adipiscing elit. Sed egestas vulputate elit non consectetur. Pellentesque vel enim diam. Maecenas dictum turpis vitae elit pellentesque, sit amet pharetra dolor viverra. Pellentesque vel nisi sit amet dui pharetra auctor. Cras condimentum nisl a posuere sagittis. Suspendisse volutpat auctor fermentum. Morbi ultrices felis quis felis facilisis, nec maximus nibh lacinia. Phasellus porta lorem ante, a fermentum risus blandit vitae. Suspendisse tempus ultrices risus sit amet consequat. Morbi lacus lacus, accumsan non blandit suscipit, aliquet sed lorem."}
        </div>
        <div className="text-info">
          {texts.map((item, index) => (
            <div
              className="small-details"
              key={index}
              style={{ color: colors.grey[100] }}
            >
              {item.title && <strong>{item.title}: </strong>}
              {item.content}
            </div>
          ))}
        </div>
      </div>
      <div className="buttons-container">
        {buttons.map((button, index) => {
          const isEnabled = isButtonEnabledForUser(button);
          
          return (
            <div
              key={index}
              className="button"
              onClick={isEnabled ? button.onClick : undefined}
              style={{
                cursor: isEnabled && button.onClick ? "pointer" : "not-allowed",
                borderRight:
                  index !== buttons.length - 1
                    ? `1px solid ${colors.grey[100]}`
                    : "none",
                backgroundColor: colors.primary[1000],
                color: isEnabled ? colors.grey[100] : colors.grey[400],
                opacity: isEnabled ? 1 : 0.8,
              }}
            >
              <div style={{ opacity: isEnabled ? 1 : 0.8 }}>
                {button.icon}
              </div>
              <p
                style={{
                  color: isEnabled ? colors.grey[100] : colors.grey[400],
                  opacity: isEnabled ? 1 : 0.8,
                }}
              >
                {button.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConferenceDetail;

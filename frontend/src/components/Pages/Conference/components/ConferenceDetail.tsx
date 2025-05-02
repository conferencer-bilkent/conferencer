import React from "react";
import "./ConferenceDetail.css";
import { FaBookOpen, FaPlusCircle } from "react-icons/fa";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useTheme } from "@mui/material";
import { tokens } from "../../../../theme";
import {
  ConferenceData,
  conference1,
  conference2,
} from "../../../../utils/dummyData/dummyConferenceData";

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
}

interface ConferenceDetailProps {
  texts: TextInfo[];
  buttons: ButtonInfo[];
  description?: string;
}

const ConferenceDetail: React.FC<ConferenceDetailProps> = ({
  texts,
  buttons,
  description,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
        {buttons.map((button, index) => (
          <div
            key={index}
            className="button"
            onClick={button.disabled ? undefined : button.onClick}
            style={{
              cursor: button.disabled
                ? "not-allowed"
                : button.onClick
                ? "pointer"
                : "default",
              borderRight:
                index !== buttons.length - 1
                  ? `1px solid ${colors.grey[100]}`
                  : "none",
              backgroundColor: colors.primary[1000],
              color: button.disabled ? colors.grey[400] : colors.grey[400],
              opacity: button.disabled ? 0.8 : 1,
            }}
          >
            <div style={{ opacity: button.disabled ? 0.8 : 1 }}>
              {button.icon}
            </div>
            <p
              style={{
                color: button.disabled ? colors.grey[400] : colors.grey[100],
                opacity: button.disabled ? 0.8 : 1,
              }}
            >
              {button.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to create text info from conference data
const createTextInfoFromConference = (
  conference: ConferenceData
): TextInfo[] => {
  return [
    {
      title: "Track Dates",
      content: `${conference.track_dates.start} - ${conference.track_dates.end}`,
    },
    {
      content: "See Full Calendar",
      link: "#",
    },
    {
      content: `Total Submissions: ${conference.stats.total_submissions}`,
      link: "#",
    },
    {
      content: `Assigned Reviews: ${conference.stats.assigned_reviews}`,
      link: "#",
    },
    {
      content: `Pending Reviews: ${conference.stats.pending_reviews}`,
      link: "#",
    },
  ];
};

// Default buttons
const defaultButtons: ButtonInfo[] = [
  {
    icon: <FaBookOpen size={24} />,
    text: "View Submissions and Paper Assignments",
  },
  { icon: <AssignmentIcon sx={{ fontSize: 26 }} />, text: "Assign Papers" },
  { icon: <FaPlusCircle size={24} />, text: "Add People to Track" },
  { icon: <FaPlusCircle size={24} />, text: "Assign Trackchair(s)" },
];

// Example usage with props to handle popup and conference data
interface ConferenceDetailExampleProps {
  openPopup?: (action: string) => void;
  conference?: ConferenceData;
}

export const ConferenceDetailExample: React.FC<
  ConferenceDetailExampleProps
> = ({
  openPopup,
  conference = conference1, // Default to first conference if none provided
}) => {
  // Create buttons with onClick handlers where needed
  const buttonsWithHandlers = defaultButtons.map((button) => {
    // Handle multiple buttons that should open popups
    if (openPopup) {
      switch (button.text) {
        case "Assign Papers":
          return {
            ...button,
            onClick: () => openPopup("Select Paper(s)"),
          };
        case "Add People to Track":
          return {
            ...button,
            onClick: () => openPopup("Add People to Track"),
          };
        case "Assign Trackchair(s)":
          return {
            ...button,
            onClick: () => openPopup("Assign Trackchair(s)"),
          };
        default:
          return button;
      }
    }
    return button;
  });

  // Generate text info from conference data
  const textsFromConference = createTextInfoFromConference(conference);

  return (
    <ConferenceDetail
      texts={textsFromConference}
      buttons={buttonsWithHandlers}
      description={conference.description}
    />
  );
};

// Export a component that displays both conferences for demo purposes
export const ConferenceDetailDemoWithBothConferences: React.FC = () => {
  return (
    <div>
      <h2>
        {conference1.name} ({conference1.acronym})
      </h2>
      <ConferenceDetailExample conference={conference1} />

      <h2 style={{ marginTop: "30px" }}>
        {conference2.name} ({conference2.acronym})
      </h2>
      <ConferenceDetailExample conference={conference2} />
    </div>
  );
};

export default ConferenceDetail;

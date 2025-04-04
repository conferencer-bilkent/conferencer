import React from "react";
import "./ConferenceDetail.css";
import { FaBookOpen, FaPlusCircle } from "react-icons/fa";

interface TextInfo {
  title?: string;
  content: string;
  link?: string;
}

interface ButtonInfo {
  icon: JSX.Element;
  text: string;
  onClick?: () => void;  // Added onClick handler
}

interface ConferenceDetailProps {
  texts: TextInfo[];
  buttons: ButtonInfo[];
}

const ConferenceDetail: React.FC<ConferenceDetailProps> = ({
  texts,
  buttons,
}) => {
  return (
    <div className="conference-detail">
      <div className="description-container">
        <div className="description">
          {" "}
          Description: orem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed egestas vulputate elit non consectetur. Pellentesque vel enim
          diam. Maecenas dictum turpis vitae elit pellentesque, sit amet
          pharetra dolor viverra. Pellentesque vel nisi sit amet dui pharetra
          auctor. Cras condimentum nisl a posuere sagittis. Suspendisse volutpat
          auctor fermentum. Morbi ultrices felis quis felis facilisis, nec
          maximus nibh lacinia. Phasellus porta lorem ante, a fermentum risus
          blandit vitae. Suspendisse tempus ultrices risus sit amet consequat.
          Morbi lacus lacus, accumsan non blandit suscipit, aliquet sed lorem.{" "}
        </div>
        <div className="text-info">
          {texts.map((item, index) => (
            <div className="small-details" key={index}>
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
            onClick={button.onClick}
            style={button.onClick ? { cursor: 'pointer' } : {}}
          >
            {button.icon}
            <p>{button.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default Props (Hardcoded Example)
const defaultTexts: TextInfo[] = [
  {
    title: "Track Dates",
    content: "23.12.2024 - 25.12.2024",
  },
  {
    content: "See Full Calendar",
    link: "#",
  },
  {
    content: "Total Submissions: 500",
    link: "#",
  },
  {
    content: "Assigned Reviews: 256",
    link: "#",
  },
  {
    content: "Pending Reviews: 187",
    link: "#",
  },
];

const defaultButtons: ButtonInfo[] = [
  {
    icon: <FaBookOpen size={24} />,
    text: "View Submissions and Paper Assignments",
  },
  { icon: <FaPlusCircle size={24} />, text: "Assign Papers" },
  { icon: <FaPlusCircle size={24} />, text: "Add People to Track" },
  { icon: <FaPlusCircle size={24} />, text: "Assign Trackchair(s)" },
];

// Example usage with props to handle popup
interface ConferenceDetailExampleProps {
  openPopup?: (action: string) => void;
}

export const ConferenceDetailExample: React.FC<ConferenceDetailExampleProps> = ({ openPopup }) => {
  // Create buttons with onClick handlers where needed
  const buttonsWithHandlers = defaultButtons.map(button => {
    // Handle multiple buttons that should open popups
    if (openPopup) {
      switch (button.text) {
        case "Assign Papers":
          return {
            ...button,
            onClick: () => openPopup("Select Paper(s)")
          };
        case "Add People to Track":
          return {
            ...button,
            onClick: () => openPopup("Add People to Track")
          };
        case "Assign Trackchair(s)":
          return {
            ...button,
            onClick: () => openPopup("Assign Trackchair(s)")
          };
        default:
          return button;
      }
    }
    return button;
  });
  
  return <ConferenceDetail texts={defaultTexts} buttons={buttonsWithHandlers} />;
};

export default ConferenceDetail;

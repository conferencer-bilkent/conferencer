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
}

interface ConferenceDetailProps {
  texts: TextInfo[];
  buttons: ButtonInfo[];
}

const ConferenceDetail: React.FC<ConferenceDetailProps> = ({ texts, buttons }) => {
  return (
    <div className="conference-detail">
      <div className="text-info">
        <div className="description">
          {texts.map((item, index) => (
            <p key={index}>
              {item.title && <strong>{item.title}: </strong>}
              {item.link ? <a href={item.link}>{item.content}</a> : item.content}
            </p>
          ))}
        </div>
      </div>
      <div className="buttons-container">
        {buttons.map((button, index) => (
          <div key={index} className="button">
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
    title: "Description",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elit massa, accumsan non consectetur non, accumsan sit amet odio.",
  },
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
  { icon: <FaBookOpen size={24} />, text: "View Submissions and Paper Assignments" },
  { icon: <FaPlusCircle size={24} />, text: "Assign Papers" },
  { icon: <FaPlusCircle size={24} />, text: "Add People to Track" },
  { icon: <FaPlusCircle size={24} />, text: "Assign Trackchair(s)" },
];

// Example usage
export const ConferenceDetailExample = () => (
  <ConferenceDetail texts={defaultTexts} buttons={defaultButtons} />
);

export default ConferenceDetail;

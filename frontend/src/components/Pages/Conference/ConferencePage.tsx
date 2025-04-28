import React, { useState } from "react";
import AppButton from "../../global/AppButton";
import { FaPlusCircle } from "react-icons/fa";
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useNavigate } from "react-router-dom";


import { ConferenceDetailExample } from "./components/ConferenceDetail";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import SelectPeoplePopup from "../../global/SelectPeoplePopUp";
import "./ConferencePage.css";
import Topbar from "../../global/TopBar";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import { useConference } from "../../../context/ConferenceContext";

const ConferencePage: React.FC = () => {
  const { activeConference } = useConference();
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
  };

  // Track which popup button (if any) is clicked
  const [popupAction, setPopupAction] = useState<string | null>(null);

  const openPopup = (actionName: string) => {
    setPopupAction(actionName);
  };

  const closePopup = () => {
    setPopupAction(null);
  };

  return (
    <>
      <Topbar></Topbar>
      <div className="conference-page">
        <div className="conference-container">
          <div className="side-menu-container">
            <SideMenu items={menuItems} onItemClick={handleItemClick} />
          </div>
          <div className="content-container">
            <AppTitle text={activeConference?.name || "No Conference Selected"} />

            <div className="buttons-row">
              {/* The first and third buttons open the popup with their respective text */}
              <AppButton
                icon={<FaPlusCircle />}
                text="Invite People"
                onClick={() => openPopup("Invite People")}
              />
              <AppButton
                icon={<DashboardIcon sx={{ width: "26px", height: "26px" }} />}
                text="Conference Overview"
                // no popup for this one
              />
              <AppButton
                icon={<FaPlusCircle />}
                text="Assign Superchair(s)"
                onClick={() => openPopup("Assign Superchair(s)")}
              />
              <AppButton
                icon={<FaPlusCircle />}
                text="Add Track"
                // no popup for this one
              />
            </div>

            <ConferenceDetailExample openPopup={openPopup} />

            {/* Conditionally render the popup if popupAction is set */}
            {popupAction && (
              <SelectPeoplePopup
                buttonText={popupAction}
                onClose={closePopup}
              />
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ConferencePage;


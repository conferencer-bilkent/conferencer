import React, { useState } from "react";
import AppButton from "../../global/AppButton";
import { FaPlusCircle } from "react-icons/fa";

import { ConferenceDetailExample } from "./components/ConferenceDetail";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import SelectPeoplePopup from "../../global/SelectPeoplePopUp";
import "./ConferencePage.css";
import Topbar from "../../global/TopBar";

const ConferencePage: React.FC = () => {
  const menuItems = getMenuItemsForPage("home");

  const handleItemClick = (item: string) => {
    console.log("Clicked:", item);
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
            <AppTitle text="CS FAIR 2025" />

            <div className="buttons-row">
              {/* The first and third buttons open the popup with their respective text */}
              <AppButton
                icon={<FaPlusCircle />}
                text="Invite People"
                onClick={() => openPopup("Invite People")}
              />
              <AppButton
                icon={<FaPlusCircle />}
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

            <ConferenceDetailExample />

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

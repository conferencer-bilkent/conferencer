import React, { useState, useEffect } from "react";
import AppButton from "../../global/AppButton";
import { FaPlusCircle, FaBookOpen, FaUser } from "react-icons/fa";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from "react-router-dom";

import ConferenceDetail from "./components/ConferenceDetail";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import SelectPeoplePopup from "../../global/SelectPeoplePopUp";
import "./ConferencePage.css";
import Topbar from "../../global/TopBar";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import { useConference } from "../../../context/ConferenceContext";

// Import the user service and types
import { getUserById } from "../../../services/userService";
import { UserData } from "../../../models/user";

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

  // State to store superchair user data
  const [superchairUsers, setSuperchairUsers] = useState<Record<string, UserData>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  // Fetch superchair data when activeConference changes
  useEffect(() => {
    if (activeConference?.superchairs?.length) {
      // Reset state for new conference
      setSuperchairUsers({});
      
      // Fetch each superchair's details
      activeConference.superchairs.forEach((chairId) => {
        setLoadingUsers(prev => ({ ...prev, [chairId]: true }));
        
        getUserById(chairId)
          .then(userData => {
            setSuperchairUsers(prev => ({
              ...prev,
              [chairId]: userData
            }));
          })
          .catch(error => {
            console.error(`Error fetching superchair ${chairId}:`, error);
          })
          .finally(() => {
            setLoadingUsers(prev => ({ ...prev, [chairId]: false }));
          });
      });
    }
  }, [activeConference?.superchairs]);

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

            {/* Use ConferenceDetail directly instead of ConferenceDetailExample */}
            {activeConference && (
              <ConferenceDetail 
                description={activeConference.venue ? 
                  `Venue: ${activeConference.venue}, ${activeConference.city || ''}, ${activeConference.country || ''}` : 
                  'No venue information available'
                }
                texts={[
                  {
                    title: "Track Dates",
                    content: `${new Date(activeConference.createdAt || Date.now()).toLocaleDateString()} - ${new Date(activeConference.licenseExpiry || Date.now()).toLocaleDateString()}`,
                  },
                  {
                    content: "See Full Calendar",
                    link: "#",
                  },
                  {
                    content: `Total Submissions: 0`,
                  },
                  {
                    content: `Assigned Reviews: 0`,
                  },
                  {
                    content: `Pending Reviews: 0`,
                  },
                ]}
                buttons={[
                  {
                    icon: <FaBookOpen size={24} />,
                    text: "View Submissions and Paper Assignments",
                  },
                  { 
                    icon: <AssignmentIcon sx={{ fontSize: 26 }} />, 
                    text: "Assign Papers",
                    onClick: () => openPopup("Select Paper(s)")
                  },
                  { 
                    icon: <FaPlusCircle size={24} />, 
                    text: "Add People to Track",
                    onClick: () => openPopup("Add People to Track")
                  },
                  { 
                    icon: <FaPlusCircle size={24} />, 
                    text: "Assign Trackchair(s)",
                    onClick: () => openPopup("Assign Trackchair(s)")
                  },
                ]}
              />
            )}

            {/* Display Superchairs */}
            {activeConference && activeConference.superchairs && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>Superchair(s)</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {activeConference.superchairs.map((chairId, index) => (
                    <div 
                      key={index}
                      onClick={() => navigate(`/profile/${chairId}`)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid white',
                        borderRadius: '16px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        minWidth: '160px',
                        backgroundColor: '#2c3e50',
                        color: 'white',
                        width: 'fit-content'
                      }}
                    >
                      <FaUser style={{ marginRight: '8px' }} />
                      {loadingUsers[chairId] ? (
                        <span>Loading...</span>
                      ) : superchairUsers[chairId] ? (
                        <span>{`${superchairUsers[chairId].name} ${superchairUsers[chairId].surname || ''}`}</span>
                      ) : (
                        <span>{chairId}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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


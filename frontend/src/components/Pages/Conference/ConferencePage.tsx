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
import { getUserById, getAllUsers } from "../../../services/userService"; // Add getAllUsers import
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

  // Function to handle selected users
  const handleSelectedUsers = (selectedUserIds: string[], action: string) => {
    console.log(`Selected users for ${action}:`, selectedUserIds);
    
    // Different actions for different popup types
    switch(action) {
      case "Invite People":
        // Handle inviting people to the conference
        if (activeConference) {
          // Call your API to invite these users to the conference
          console.log(`Inviting users to conference ${activeConference.id}`);
        }
        break;
        
      case "Assign Superchair(s)":
        // Handle assigning superchairs
        if (activeConference) {
          // Call your API to assign these users as superchairs
          console.log(`Assigning users as superchairs to conference ${activeConference.id}`);
        }
        break;
        
      case "Add People to Track":
      case "Assign Trackchair(s)":
        // Handle track-related assignments
        // These would need track ID as well
        console.log(`${action} - Implementation needed`);
        break;
        
      default:
        console.log(`No handler for action: ${action}`);
    }
    
    // Close popup after action is taken
    closePopup();
  };

  // Add state for all users
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState<boolean>(false);

  // Add effect to fetch all users when component mounts
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingAllUsers(true);
      try {
        const users = await getAllUsers();
        setAllUsers(users);
        console.log(`Fetched ${users.length} users`);
      } catch (error) {
        console.error("Error fetching all users:", error);
      } finally {
        setLoadingAllUsers(false);
      }
    };
    
    fetchAllUsers();
  }, []); // Empty dependency array ensures it only runs once on mount

  // Function to get filtered users based on the popup action
  const getFilteredUsersForPopup = (): UserData[] => {
    if (!activeConference) return allUsers;

    // For different actions, we may want different filtering rules
    switch(popupAction) {
      case "Invite People":
        // Filter out users who are already PC members
        console.log("Filtering users for Invite People");
        console.log("Active Conference PC Members:", activeConference.pcMembers);
        console.log("All Users:", allUsers);
        // Alternative approach with more flexible ID matching
        return allUsers.filter(user => {
          // Get all possible ID forms
          const userId = user._id || user.id;
          
          // Check if this ID is in the PC members array
          const isAlreadyPcMember = activeConference.pcMembers?.some(
            memberId => memberId === userId
          );
          
          return !allUsers;
        });
        
      case "Assign Superchair(s)":
        // Filter out users who are already superchairs
        return allUsers.filter(user => 
          !activeConference.superchairs?.includes(user.id)
        );
        
      case "Add People to Track":
      case "Assign Trackchair(s)":
        // For track-related actions, you might want to filter out existing track chairs
        return allUsers.filter(user => 
          !activeConference.trackChairs?.includes(user.id)
        );
        
      default:
        // Default case - no filtering
        return allUsers;
    }
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
                onClick={() => navigate("/conference/createTrack")}
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
                people={getFilteredUsersForPopup()}
                onClose={closePopup}
                onSelect={(selectedUserIds) => handleSelectedUsers(selectedUserIds, popupAction)}
              />
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default ConferencePage;


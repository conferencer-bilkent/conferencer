import React, { useState, useEffect } from "react";
import AppButton from "../../global/AppButton";
import { FaPlusCircle, FaBookOpen, FaUser } from "react-icons/fa";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
import { assignSuperchair, invitePeopleToConference } from "../../../services/conferenceService";


// Import the user service and types
import { getUserById, getAllUsers } from "../../../services/userService"; // Add getAllUsers import
import { UserData } from "../../../models/user";

const ConferencePage: React.FC = () => {
  const { activeConference , setActiveConference} = useConference();
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();
  // Add active track state
  const [activeTrack, setActiveTrack] = useState<any>(null);

  // Track which popup button (if any) is clicked
  const [popupAction, setPopupAction] = useState<string | null>(null);

  // Initialize active track when activeConference changes
  useEffect(() => {
    if (!activeConference) {
      const stored = localStorage.getItem("activeConference");
      if (stored) {
        setActiveConference(JSON.parse(stored));
        // Exit early and let the dependency trigger this effect again when activeConference is set
        return;
      } else {
        console.log("No active conference found in localStorage");
        return;
      }
    }
    
    // Now we know activeConference exists
    console.log(`Active conference set: ${activeConference.name} (ID: ${activeConference.id})`);
    
    // Safe access to tracks with optional chaining and nullish check
    if (activeConference.tracks?.length > 0) {
      console.log(
        `Setting active track for conference: ${activeConference.name} (ID: ${activeConference.id})`
      );
      setActiveTrack(activeConference.tracks[0]);
    } else {
      setActiveTrack(null); // Reset if no tracks available
      console.log("No tracks available for this conference");
    }
  }, [activeConference]); // Add activeConference to dependency array

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
  };

  const openPopup = (actionName: string) => {
    setPopupAction(actionName);
  };

  const closePopup = () => {
    setPopupAction(null);
  };

  // State to store superchair user data
  const [superchairUsers, setSuperchairUsers] = useState<
    Record<string, UserData>
  >({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  // Fetch superchair data when activeConference changes
  useEffect(() => {
    if (activeConference?.superchairs?.length) {
      // Reset state for new conference
      setSuperchairUsers({});

      // Fetch each superchair's details
      activeConference.superchairs.forEach((chairId) => {
        setLoadingUsers((prev) => ({ ...prev, [chairId]: true }));

        getUserById(chairId)
          .then((userData) => {
            setSuperchairUsers((prev) => ({
              ...prev,
              [chairId]: userData,
            }));
          })
          .catch((error) => {
            console.error(`Error fetching superchair ${chairId}:`, error);
          })
          .finally(() => {
            setLoadingUsers((prev) => ({ ...prev, [chairId]: false }));
          });
      });
    }
  }, [activeConference?.superchairs]);

  // Function to handle selected users
  const handleSelectedUsers = (selectedUserIds: string[], action: string) => {
    console.log(`Selected users for ${action}:`, selectedUserIds);

    // Different actions for different popup types
    switch (action) {
      case "Invite People":
        // Handle inviting people to the conference
        if (activeConference) {
          // Call your API to invite these users to the conference
          
          invitePeopleToConference(selectedUserIds, activeConference.id, activeConference.name)
            .then(response => {
              console.log("Successfully invited users:", response);
              // You could add a success notification here
            })
            .catch(error => {
              console.error("Error inviting users:", error);
              // You could add an error notification here
            });
          
          console.log(`Inviting users to conference ${activeConference.id}`);
        }
        break;

      case "Assign Superchair(s)":
        // Handle assigning superchairs
        if (activeConference) {
          // Process each selected user to assign as superchair
          const assignPromises = selectedUserIds.map(userId => 
            assignSuperchair(userId, activeConference.id)
          );
          
          Promise.all(assignPromises)
            .then(results => {
              console.log("Successfully assigned superchairs:", results);
              // Refresh the page or update the UI to show new superchairs
              window.location.reload(); // Simple refresh, or you could update state
            })
            .catch(error => {
              console.error("Error assigning superchair(s):", error);
              // You could add an error notification here
            });
          
          console.log(`Assigning users as superchairs to conference ${activeConference.id}`);
        }
        break;

      case "Add People to Track":
      case "Assign Trackchair(s)":
        // Handle track-related assignments
        // These would need track ID as well

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
    switch (popupAction) {
      case "Invite People":
        const nonMembers = allUsers.filter(
          (user) =>
            !activeConference.pcMembers.includes(user._id?.toString() ?? "")
        );

        return nonMembers;

      case "Assign Superchair(s)":
        // Filter out users who are already superchairs
        const nonSuperIds = activeConference.pcMembers.filter(
          (pcMemberId) =>
            !activeConference.superchairs.includes(pcMemberId?.toString() ?? "")
        );
        console.log(activeConference.pcMembers);

        // Then map these IDs to the corresponding UserData objects
        const nonSupers = allUsers.filter((user) =>
          nonSuperIds.includes(user._id?.toString() ?? "")
        );


        return nonSupers;

      case "Add People to Track":
      case "Assign Trackchair(s)":
        // For track-related actions, filter out existing track chairs
        console.log(
          `Assigning users to track ${JSON.stringify(activeTrack)} }`
        );

        // First get IDs of PC members who aren't already track chairs
        const nonTrackChairIds = activeConference.pcMembers.filter(
          (pcMemberId) =>
            !activeTrack.track_chairs.includes(pcMemberId?.toString() ?? "")
        );

        // Then map these IDs to the corresponding UserData objects
        const nonTracks = allUsers.filter((user) =>
          nonTrackChairIds.includes(user._id?.toString() ?? "")
        );

        return nonTracks;
      default:
        // Default case - no filtering
        return allUsers;
    }
  };

  return (
    <div className="conference-page">
      <div className="conference-container">
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
            {/* Added "Assign paper" button */}
            <AppButton
              icon={<AssignmentIcon sx={{ fontSize: 26 }} />}
              text="Add Submission"
              onClick={() => navigate("/addSubmission")}
            />
          </div>

          {/* Use ConferenceDetail directly instead of ConferenceDetailExample */}
          {activeConference && (
            <ConferenceDetail
              description={
                activeConference.venue
                  ? `Venue: ${activeConference.venue}, ${
                      activeConference.city || ""
                    }, ${activeConference.country || ""}`
                  : "No venue information available"
              }
              texts={[
                {
                  title: "Track Dates",
                  content: `${new Date(
                    activeConference.createdAt || Date.now()
                  ).toLocaleDateString()} - ${new Date(
                    activeConference.licenseExpiry || Date.now()
                  ).toLocaleDateString()}`,
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
                  onClick: () => openPopup("Select Paper(s)"),
                },
                {
                  icon: <FaPlusCircle size={24} />,
                  text: "Add People to Track",
                  onClick: () => openPopup("Add People to Track"),
                },
                {
                  icon: <FaPlusCircle size={24} />,
                  text: "Assign Trackchair(s)",
                  onClick: () => openPopup("Assign Trackchair(s)"),
                },
              ]}
            />
          )}

          {/* Display Superchairs */}
          {activeConference && activeConference.superchairs && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ color: "white", marginBottom: "10px" }}>
                Superchair(s)
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {activeConference.superchairs.map((chairId, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(`/profile/${chairId}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid white",
                      borderRadius: "16px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      minWidth: "160px",
                      backgroundColor: "#2c3e50",
                      color: "white",
                      width: "fit-content",
                    }}
                  >
                    <FaUser style={{ marginRight: "8px" }} />
                    {loadingUsers[chairId] ? (
                      <span>Loading...</span>
                    ) : superchairUsers[chairId] ? (
                      <span>{`${superchairUsers[chairId].name} ${
                        superchairUsers[chairId].surname || ""
                      }`}</span>
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
              onSelect={(selectedUserIds) =>
                handleSelectedUsers(selectedUserIds, popupAction)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;

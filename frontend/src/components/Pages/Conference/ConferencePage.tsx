import React, { useState, useEffect } from "react";
import AppButton from "../../global/AppButton";
import { FaPlusCircle, FaBookOpen, FaUser } from "react-icons/fa";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import ConferenceDetail from "./components/ConferenceDetail";
import AppTitle from "../../global/AppTitle";
import SelectPeoplePopup from "../../global/SelectPeoplePopUp";
import "./ConferencePage.css";
import { useConference } from "../../../context/ConferenceContext";
import { invitePeopleToConference } from "../../../services/conferenceService";

import { getUserById, getAllUsers } from "../../../services/userService";
import { UserData } from "../../../models/user";

const ConferencePage: React.FC = () => {
  const { activeConference } = useConference();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [activeTrack, setActiveTrack] = useState<any>(null);
  const [popupAction, setPopupAction] = useState<string | null>(null);

  useEffect(() => {
    if (activeConference!.tracks!.length > 0) {
      console.log(
        `Setting active track for conference: ${activeConference?.name} (ID: ${activeConference?.id})`
      );
      setActiveTrack(activeConference!.tracks[0]);
    } else {
      setActiveTrack(null);
    }
  }, []);

  const openPopup = (actionName: string) => {
    setPopupAction(actionName);
  };

  const closePopup = () => {
    setPopupAction(null);
  };

  const [superchairUsers, setSuperchairUsers] = useState<
    Record<string, UserData>
  >({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeConference?.superchairs?.length) {
      setSuperchairUsers({});

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

  const handleSelectedUsers = (selectedUserIds: string[], action: string) => {
    console.log(`Selected users for ${action}:`, selectedUserIds);

    switch (action) {
      case "Invite People":
        if (activeConference) {
          invitePeopleToConference(
            selectedUserIds,
            activeConference.id,
            activeConference.name
          )
            .then((response) => {
              console.log("Successfully invited users:", response);
            })
            .catch((error) => {
              console.error("Error inviting users:", error);
            });

          console.log(`Inviting users to conference ${activeConference.id}`);
        }
        break;

      case "Assign Superchair(s)":
        if (activeConference) {
          console.log(
            `Assigning users as superchairs to conference ${activeConference.id}`
          );
        }
        break;

      case "Add People to Track":
      case "Assign Trackchair(s)":
        break;

      default:
        console.log(`No handler for action: ${action}`);
    }

    closePopup();
  };

  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [loadingAllUsers, setLoadingAllUsers] = useState<boolean>(false);

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
  }, []);

  const getFilteredUsersForPopup = (): UserData[] => {
    if (!activeConference) return allUsers;

    switch (popupAction) {
      case "Invite People":
        const nonMembers = allUsers.filter(
          (user) =>
            !activeConference.pcMembers.includes(user._id?.toString() ?? "")
        );

        return nonMembers;

      case "Assign Superchair(s)":
        const nonSuperIds = activeConference.pcMembers.filter(
          (pcMemberId) =>
            !activeConference.superchairs.includes(pcMemberId?.toString() ?? "")
        );
        console.log(activeConference.pcMembers);

        const nonSupers = allUsers.filter((user) =>
          nonSuperIds.includes(user._id?.toString() ?? "")
        );

        return nonSupers;

      case "Add People to Track":
      case "Assign Trackchair(s)":
        console.log(
          `Assigning users to track ${JSON.stringify(activeTrack)} }`
        );

        const nonTrackChairIds = activeConference.pcMembers.filter(
          (pcMemberId) =>
            !activeTrack.track_chairs.includes(pcMemberId?.toString() ?? "")
        );

        const nonTracks = allUsers.filter((user) =>
          nonTrackChairIds.includes(user._id?.toString() ?? "")
        );

        return nonTracks;
      default:
        return allUsers;
    }
  };

  return (
    <div
      className="conference-page"
      style={{
        backgroundColor: colors.transparent,
        color: colors.grey[100],
      }}
    >
      <div className="conference-container">
        <div className="content-container">
          <AppTitle text={activeConference?.name || "No Conference Selected"} />

          <div className="buttons-row">
            <AppButton
              icon={<FaPlusCircle />}
              text="Invite People"
              onClick={() => openPopup("Invite People")}
            />
            <AppButton
              icon={<DashboardIcon sx={{ width: "26px", height: "26px" }} />}
              text="Conference Overview"
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
            />
            <AppButton
              icon={<AssignmentIcon sx={{ fontSize: 26 }} />}
              text="Add Submission"
              onClick={() => navigate("/addSubmission")}
            />
          </div>

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

          {activeConference && activeConference.superchairs && (
            <div style={{ marginTop: "20px" }}>
              <h3 style={{ color: colors.grey[100], marginBottom: "10px" }}>
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
                      border: `1px solid ${colors.grey[100]}`,
                      borderRadius: "16px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      minWidth: "160px",
                      backgroundColor: colors.primary[1000],
                      color: colors.grey[100],
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

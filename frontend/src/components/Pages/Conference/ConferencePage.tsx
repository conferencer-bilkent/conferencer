import React, { useState, useEffect, useRef } from "react";
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
import SelectPaperPopup from "../../global/SelectPaperPopUp";
import ConflictOfInterestPopup from "../../global/ConflictOfInterestPopup";
import "./ConferencePage.css";
import { useConference } from "../../../context/ConferenceContext";
import {
  assignSuperchair,
  invitePeopleToConference,
  useRefreshConference,
} from "../../../services/conferenceService";

import { getUserById, getAllUsers } from "../../../services/userService";

import { UserData } from "../../../models/user";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useUser } from "../../../context/UserContext";
import { isConferencePastDue } from "../Home/Homepage";

const ConferencePage: React.FC = () => {
  const { activeConference, setActiveConference } = useConference();
  const refreshConference = useRefreshConference();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useUser();

  const [popupAction, setPopupAction] = useState<string | null>(null);

  const tracks = activeConference?.tracks || [];
  console.log("activeconfessrence", activeConference);
  const [activeTrack, setActiveTrack] = useState<any>(null);

  const [papers, setPapers] = useState<any[]>([]);
  const [loadingPapers, setLoadingPapers] = useState(false);

  const fetchTrackPapers = async (trackId: string) => {
    setLoadingPapers(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/track/${trackId}/papers`,
        {
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to fetch papers");
      const data = await response.json();
      setPapers(data.papers || []);
    } catch (error) {
      console.error("Error fetching papers:", error);
      setPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  useEffect(() => {
    if (activeTrack?._id) {
      fetchTrackPapers(activeTrack._id);
    } else {
      setPapers([]);
    }
  }, [activeTrack]);

  useEffect(() => {
    if (activeTrack) {
      console.log('Active Track:', {
        id: activeTrack._id,
        name: activeTrack.track_name,
        description: activeTrack.description
      });
    }
  }, [activeTrack]);

  const isCurrentUserPCMember = React.useMemo(() => {
    if (!user || !activeConference?.pcMembers) return false;
    return activeConference.pcMembers.includes(user.id);
  }, [user, activeConference]);

  const isCurrentUserSuperchair = React.useMemo(() => {
    if (!user || !activeConference?.superchairs) return false;
    return activeConference.superchairs.includes(user.id);
  }, [user, activeConference]);

  const isCurrentUserTrackchair = React.useMemo(() => {
    if (!user || !activeTrack?.track_chairs) return false;
    return activeTrack.track_chairs.includes(user.id);
  }, [user, activeTrack]);

  const isCurrentUserTrackMember = React.useMemo(() => {
    if (!user || !activeTrack?.track_members) return false;
    console.log("activeTrack", activeTrack);
    console.log("user", user);
    return activeTrack.track_members.includes(user.id);
    
  }, [user, activeTrack]);

  // only refresh once on first mount / load of activeConference
  const hasRefreshed = useRef(false);
  useEffect(() => {
    if (!hasRefreshed.current && activeConference) {
      hasRefreshed.current = true;
      console.log(
        `Refreshing conference data on mount (ID: ${activeConference.id})`
      );
      refreshConference(activeConference.id)
        .then(() => console.log("Conference refreshed"))
        .catch((err) => console.error("Error refreshing on mount:", err));
    }
  }, [activeConference, refreshConference]);

  useEffect(() => {
    if (!activeTrack && tracks.length > 0) {
      setActiveTrack(tracks[0]);
      console.log(
        `Initial active track set: ${tracks[0].track_name} (ID: ${tracks[0]._id})`
      );
    }
  }, [tracks, activeTrack]);

  const currentIndex = tracks.findIndex((t) => t._id === activeTrack?._id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < tracks.length - 1;
  const handlePrevTrack = () =>
    hasPrev && setActiveTrack(tracks[currentIndex - 1]);
  const handleNextTrack = () =>
    hasNext && setActiveTrack(tracks[currentIndex + 1]);

  useEffect(() => {
    if (!activeConference) {
      const stored = localStorage.getItem("activeConference");
      if (stored) {
        try {
          const parsedConference = JSON.parse(stored);
          setActiveConference(parsedConference);

          if (parsedConference?.tracks?.length > 0) {
            setActiveTrack(parsedConference.tracks[0]);
            console.log(
              `Active track set: ${parsedConference.tracks[0].name} (ID: ${parsedConference.tracks[0].id})`
            );
          }
        } catch (error) {
          console.error("Error parsing stored conference:", error);
        }
        return;
      } else {
        console.log("No active conference found in localStorage");
        return;
      }
    }

    console.log(
      `Active conference set: ${activeConference.name} (ID: ${activeConference.id})`
    );

    if (activeConference.tracks?.length > 0) {
      console.log(
        `Setting active track for conference: ${activeConference.name} (ID: ${activeConference.id})`
      );
      setActiveTrack(activeConference.tracks[0]);
    } else {
      setActiveTrack(null);
      console.log("No tracks available for this conference");
    }
  }, [activeConference, setActiveConference]);

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
      setLoadingUsers({});

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
    } else {
      setSuperchairUsers({});
      setLoadingUsers({});
    }
  }, [activeConference]);

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
              if (activeConference) {
                refreshConference(activeConference.id);
              }
            })
            .catch((error) => {
              console.error("Error inviting users:", error);
            });
        }
        break;

      case "Assign Superchair(s)":
        if (activeConference) {
          const assignPromises = selectedUserIds.map((userId) =>
            assignSuperchair(userId, activeConference.id)
          );

          Promise.all(assignPromises)
            .then((results) => {
              console.log("Successfully assigned superchairs:", results);
              if (activeConference) {
                refreshConference(activeConference.id);
              }
            })
            .catch((error) => {
              console.error("Error assigning superchair(s):", error);
            });
        }
        break;

      case "Add People to Track":
        if (activeConference && activeTrack) {
          const assignPromises = selectedUserIds.map((userId) =>
            fetch("http://127.0.0.1:5000/track/appoint_track_members", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                track_id: activeTrack._id,
                track_member: userId,
              }),
            }).then((res) => {
              if (!res.ok) {
                return res.json().then((err) => {
                  throw new Error(
                    err.error || `Failed to add track member ${userId}`
                  );
                });
              }
              return res.json();
            })
          );

          Promise.all(assignPromises)
            .then((results) => {
              console.log("Successfully added track members:", results);
              if (activeConference) {
                refreshConference(activeConference.id);
              }
            })
            .catch((error) => {
              console.error("Error adding track members:", error);
            });
        }
        break;

      case "Assign Trackchair(s)":
        if (activeConference && activeTrack) {
          const assignPromises = selectedUserIds.map((userId) =>
            fetch("http://127.0.0.1:5000/track/appoint_track_chairs", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                track_id: activeTrack._id,
                track_chair: userId,
              }),
            }).then((res) => {
              if (!res.ok) {
                return res.json().then((err) => {
                  throw new Error(
                    err.error || `Failed to assign trackchair ${userId}`
                  );
                });
              }
              return res.json();
            })
          );

          Promise.all(assignPromises)
            .then((results) => {
              console.log("Successfully assigned trackchairs:", results);
              if (activeConference) {
                refreshConference(activeConference.id)
                  .then(() => {
                    console.log(
                      "Conference refreshed successfully after assigning trackchairs"
                    );
                  })
                  .catch((error) => {
                    console.error("Error refreshing conference data:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error assigning trackchairs:", error);
            });
        }
        break;

      default:
        console.log(`No handler for action: ${action}`);
    }

    closePopup();
  };

  const [allUsers, setAllUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await getAllUsers();
        setAllUsers(users);
        console.log(`Fetched ${users.length} users`);
      } catch (error) {
        console.error("Error fetching all users:", error);
      } finally {
        console.log("Finished fetching all users");
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
        console.log("pc", activeConference.pcMembers);

        const nonSupers = allUsers.filter((user) =>
          nonSuperIds.includes(user._id?.toString() ?? "")
        );

        return nonSupers;

      case "Add People to Track":
      //

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

  const [trackChairUsers, setTrackChairUsers] = useState<
    Record<string, UserData>
  >({});
  const [loadingTrackChairs, setLoadingTrackChairs] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!activeTrack?.track_chairs?.length) return;

    setTrackChairUsers({});
    setLoadingTrackChairs({});

    activeTrack.track_chairs.forEach((chairId: string) => {
      setLoadingTrackChairs((prev) => ({ ...prev, [chairId]: true }));
      getUserById(chairId)
        .then((userData) => {
          setTrackChairUsers((prev) => ({ ...prev, [chairId]: userData }));
        })
        .catch((err) => {
          console.error(`Error fetching trackchair ${chairId}:`, err);
        })
        .finally(() => {
          setLoadingTrackChairs((prev) => ({ ...prev, [chairId]: false }));
        });
    });
  }, [activeTrack]);

  const hasActiveTrack = Boolean(activeTrack);

  const handleConferenceOverviewClick = () => {
    navigate("/conference/overview");
  };

  const isPastDue = React.useMemo(() => {
    return activeConference ? isConferencePastDue(activeConference) : false;
  }, [activeConference]);

  return (
    <div
      className="conference-page"
      style={{ backgroundColor: colors.transparent, color: colors.grey[100] }}
    >
      <div className="conference-container">
        <div
          className="content-container"
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <AppTitle text={activeConference?.name || "No Conference Selected"} />
          <div className="buttons-row" style={{ marginBottom: 20 }}>
            {!isPastDue && isCurrentUserSuperchair && (
              <AppButton
                icon={<FaPlusCircle />}
                text="Invite People"
                onClick={() => openPopup("Invite People")}
              />
            )}
            <AppButton
              icon={<DashboardIcon sx={{ width: "26px", height: "26px" }} />}
              text="Conference Overview"
              onClick={handleConferenceOverviewClick}
            />
            {!isPastDue && isCurrentUserSuperchair && (
              <AppButton
                icon={<FaPlusCircle />}
                text="Assign Superchair(s)"
                onClick={() => openPopup("Assign Superchair(s)")}
              />
            )}
            {!isPastDue && isCurrentUserSuperchair && (
              <AppButton
                icon={<FaPlusCircle />}
                text="Add Track"
                onClick={() => navigate("/conference/createTrack")}
              />
            )}
          </div>

          {activeConference && (
            <AppTitle text={activeTrack?.track_name || "No Track Selected"} />
          )}

          {activeConference && (
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                gap: "8px",
                opacity: hasActiveTrack ? 1 : 0.9,
              }}
            >
              <IconButton
                onClick={handlePrevTrack}
                disabled={!hasPrev}
                sx={{ color: hasPrev ? colors.grey[100] : "transparent" }}
              >
                <ChevronLeftIcon sx={{ color: "inherit" }} />
              </IconButton>

              <ConferenceDetail
                description={
                  hasActiveTrack && activeTrack.description
                    ? activeTrack.description
                    : "Select a track to view details"
                }
                texts={[
                  {
                    title: "Track Dates",
                    content: hasActiveTrack
                      ? `${
                          activeConference.startDate
                            ? new Date(
                                activeConference.startDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "Start date not set"
                        } - ${
                          activeConference.endDate
                            ? new Date(
                                activeConference.endDate
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "End date not set"
                        }`
                      : "-",
                  },
                
                  { 
                    content: `Total Submissions: ${hasActiveTrack ? papers.length : "-"}` 
                  },
                  { 
                    content: `Track Chairs: ${
                      hasActiveTrack ? activeTrack.track_chairs?.length || 0 : "-"
                    }` 
                  },
                  { 
                    content: `Track Members: ${
                      hasActiveTrack ? activeTrack.track_members?.length || 0 : "-"
                    }` 
                  },
                  { 
                    content: `Reviews: ${
                      hasActiveTrack ? activeTrack.reviews?.length || 0 : "-"
                    }` 
                  },
                  { 
                    content: `Assignments: ${
                      hasActiveTrack ? activeTrack.assignments?.length || 0 : "-"
                    }` 
                  },
                ]}
                buttons={[
                  {
                    icon: <FaBookOpen size={24} />,
                    text: "View Submissions and Paper Assignments",
                    onClick:
                      hasActiveTrack
                        ? () => navigate("/review", { state: { activeTrack } })
                        : undefined,
                    disabled: !hasActiveTrack,
                    visibleTo: "members" as "members",
                  },
                  ...(isPastDue
                    ? []
                    : [
                        {
                          icon: <AssignmentIcon sx={{ fontSize: 26 }} />,
                          text: "Assign Papers",
                          onClick:
                            hasActiveTrack &&
                            (isCurrentUserTrackchair || isCurrentUserSuperchair)
                              ? () => openPopup("Select Paper(s)")
                              : undefined,
                          disabled: !hasActiveTrack,
                          visibleTo: "trackchairs" as "trackchairs",
                        },
                        {
                          icon: <FaPlusCircle size={24} />,
                          text: "Add People to Track",
                          onClick:
                            hasActiveTrack &&
                            (isCurrentUserTrackchair || isCurrentUserSuperchair)
                              ? () => openPopup("Add People to Track")
                              : undefined,
                          disabled: !hasActiveTrack,
                          visibleTo: "trackchairs" as "trackchairs",
                        },
                        {
                          icon: <FaPlusCircle size={24} />,
                          text: "Assign Trackchair(s)",
                          onClick:
                            hasActiveTrack &&
                            (isCurrentUserTrackchair || isCurrentUserSuperchair)
                              ? () => openPopup("Assign Trackchair(s)")
                              : undefined,
                          disabled: !hasActiveTrack,
                          visibleTo: "trackchairs" as "trackchairs",
                        },
                      ]),
                ]}
                userRoles={{
                  isTrackchair: isCurrentUserTrackchair,
                  isSuperchair: isCurrentUserSuperchair,
                  isTrackMember: isCurrentUserTrackMember,
                }}
              />

              <IconButton
                onClick={handleNextTrack}
                disabled={!hasNext}
                sx={{ color: hasNext ? colors.grey[100] : "transparent" }}
              >
                <ChevronRightIcon sx={{ color: "inherit" }} />
              </IconButton>
            </div>
          )}

          <div
            style={{
              display: "flex",
              width: "100%",
              borderTop: `1px solid ${colors.grey[400]}`,
              paddingTop: "12px",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                flex: 1,
                paddingRight: "16px",
                borderRight: `1px solid ${colors.grey[400]}`,
              }}
            >
              <h3
                style={{
                  color: colors.grey[100],
                  marginBottom: 10,
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Superchair(s)
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {(activeConference?.superchairs?.length ?? 0) > 0 ? (
                  activeConference?.superchairs?.map((id, idx) => (
                    <div
                      key={id || idx}
                      onClick={() => navigate(`/profile/${id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: `1px solid ${colors.grey[100]}`,
                        borderRadius: 10,
                        padding: "6px 10px",
                        cursor: "pointer",
                        backgroundColor: colors.primary[1000],
                        color: colors.grey[100],
                        fontSize: "14px",
                      }}
                    >
                      <FaUser style={{ marginRight: 8, fontSize: "12px" }} />
                      {loadingUsers[id]
                        ? "Loading…"
                        : superchairUsers[id]
                        ? `${superchairUsers[id].name} ${
                            superchairUsers[id].surname || ""
                          }`
                        : id}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      color: colors.grey[300],
                      fontStyle: "italic",
                      fontSize: "14px",
                    }}
                  >
                    No superchairs added yet
                  </div>
                )}
              </div>
            </div>

            <div style={{ flex: 1, paddingLeft: "16px" }}>
              <h3
                style={{
                  color: colors.grey[100],
                  marginBottom: 10,
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                Trackchair(s)
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {hasActiveTrack && activeTrack.track_chairs?.length > 0 ? (
                  activeTrack.track_chairs.map((id: string, idx: number) => (
                    <div
                      key={id || idx}
                      onClick={() => navigate(`/profile/${id}`)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        border: `1px solid ${colors.grey[100]}`,
                        borderRadius: 10,
                        padding: "6px 10px",
                        cursor: "pointer",
                        backgroundColor: colors.primary[1000],
                        color: colors.grey[100],
                        fontSize: "14px",
                      }}
                    >
                      <FaUser style={{ marginRight: 8, fontSize: "12px" }} />
                      {loadingTrackChairs[id]
                        ? "Loading…"
                        : trackChairUsers[id]
                        ? `${trackChairUsers[id].name} ${
                            trackChairUsers[id].surname || ""
                          }`
                        : id}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      color: colors.grey[300],
                      fontStyle: "italic",
                      fontSize: "14px",
                    }}
                  >
                    No track chairs added yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isPastDue && (
            <div className="buttons-row" style={{ marginTop: 20 }}>
              <AppButton
                icon={<AssignmentIcon sx={{ fontSize: 26 }} />}
                text="Add Submission"
                onClick={() => navigate("/addSubmission")}
              />
            </div>
          )}

        

          {popupAction && popupAction !== "Select Paper(s)" && popupAction !== "ConflictOfInterest" && (
            <SelectPeoplePopup
              buttonText={popupAction}
              people={getFilteredUsersForPopup()}
              onClose={closePopup}
              onSelect={(selectedUserIds) =>
                handleSelectedUsers(selectedUserIds, popupAction)
              }
            />
          )}

          {popupAction === "Select Paper(s)" && (
            <SelectPaperPopup
              buttonText="Assign Papers"
              trackId={activeTrack._id}
              onClose={closePopup}
            />
          )}

          
        </div>
      </div>
    </div>
  );
};

export default ConferencePage;

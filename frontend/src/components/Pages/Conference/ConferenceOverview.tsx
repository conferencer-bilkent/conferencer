import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useConference } from "../../../context/ConferenceContext";
import AppTitle from "../../global/AppTitle";
import AppButton from "../../global/AppButton";
import { FaUserAlt } from "react-icons/fa";
import { getUserById } from "../../../services/userService";
import { UserData } from "../../../models/user";

const ConferenceOverview: React.FC = () => {
  const { activeConference } = useConference();
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [superchairUsers, setSuperchairUsers] = useState<
    Record<string, UserData>
  >({});
  const [pcMemberUsers, setPcMemberUsers] = useState<Record<string, UserData>>(
    {}
  );
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Load superchair data
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

    // Load PC member data
    if (activeConference?.pcMembers?.length) {
      setPcMemberUsers({});

      activeConference.pcMembers.forEach((memberId) => {
        setLoadingUsers((prev) => ({ ...prev, [memberId]: true }));

        getUserById(memberId)
          .then((userData) => {
            setPcMemberUsers((prev) => ({
              ...prev,
              [memberId]: userData,
            }));
          })
          .catch((error) => {
            console.error(`Error fetching PC member ${memberId}:`, error);
          })
          .finally(() => {
            setLoadingUsers((prev) => ({ ...prev, [memberId]: false }));
          });
      });
    }
  }, [activeConference]);

  // Calculate superchair names
  const superchairNames = activeConference?.superchairs
    ?.map((id) => {
      if (loadingUsers[id]) return "Loading...";
      if (superchairUsers[id])
        return `${superchairUsers[id].name} ${
          superchairUsers[id].surname || ""
        }`;
      return id;
    })
    .join(", ");

  // Format date range
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // In a real implementation, these would come from the activeConference
  const startDate = activeConference?.createdAt || "";
  const endDate = ""; // This would come from conference data
  const dateRange = startDate
    ? `${formatDate(startDate)}${endDate ? ` - ${formatDate(endDate)}` : ""}`
    : "";

  // Determine roles for each participant
  const getUserRoles = (userId: string) => {
    const roles = [];

    // Check if user is a superchair
    if (activeConference?.superchairs?.includes(userId)) {
      roles.push("Superchair");
    }

    // Check track chair roles
    activeConference?.tracks?.forEach((track, index) => {
      if (track.track_chairs?.includes(userId)) {
        roles.push(`Track Chair (TRACK${index + 1} - ${track.track_name})`);
      }
    });

    // Check PC member roles (if not already a chair)
    if (activeConference?.pcMembers?.includes(userId) && roles.length === 0) {
      roles.push("PC Member");
    }

    return roles.length ? roles.join(", ") : "Participant";
  };

  // Filter participants based on search term
  const filteredParticipants = activeConference?.pcMembers?.filter(
    (memberId) => {
      if (!searchTerm) return true;

      const user = pcMemberUsers[memberId];
      if (!user) return false;

      const fullName = `${user.name} ${user.surname || ""}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        memberId.includes(searchTerm)
      );
    }
  );

  const handleConfigureConference = () => {
    navigate("/conference/edit");
  };

  const handleSwitchToTrackView = () => {
    navigate("/conference");
  };

  const handleInviteMore = () => {
    // Logic to invite more participants
    navigate("/conference/invite");
  };

  const handleViewSubmissions = () => {
    // View all submissions
    navigate("/submissions");
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: colors.transparent,
        minHeight: "100vh",
        color: colors.grey[100],
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <AppButton
          text="Configure Conference"
          onClick={handleConfigureConference}
        />
        <AppButton
          text="Switch Back to Track View"
          onClick={handleSwitchToTrackView}
        />
      </div>

      <div
        style={{
          backgroundColor: colors.transparent,
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <AppTitle
          text={`${activeConference?.name || "Conference"}: Overview`}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* Left side: Conference info and participants */}
        <div
          style={{
            backgroundColor: colors.transparent,
            borderRadius: "8px",
            border: `1px solid ${colors.grey[100]}`,
            padding: "20px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h3 style={{ marginBottom: "8px" }}>
              Superchair(s): {superchairNames || "None assigned"}
            </h3>
            <p style={{ marginBottom: "16px" }}>
              Description:{" "}
              {activeConference?.submissionInstructions?.value ||
                "No description available."}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: `1px solid ${colors.grey[700]}`,
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <span>Date: {dateRange || "Date not set"}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                Participants: {activeConference?.pcMembers?.length || 0}
              </span>
              <span
                onClick={handleInviteMore}
                style={{
                  color: colors.greenAccent[400],
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Invite More
              </span>
            </div>
          </div>

          {/* Participant search and list */}
          <div style={{ marginTop: "30px" }}>
            <div
              style={{
                display: "flex",
                marginBottom: "15px",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: colors.primary[900],
                  borderRadius: "50px",
                  padding: "5px 15px",
                  flex: 1,
                }}
              >
                <span style={{ marginRight: "8px" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by ID or Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    width: "100%",
                    outline: "none",
                  }}
                />
              </div>
              <div
                style={{
                  backgroundColor: colors.primary[700],
                  padding: "5px 15px",
                  borderRadius: "50px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                Filter
              </div>
            </div>

            {/* Participant list with real data */}
            {filteredParticipants && filteredParticipants.length > 0 ? (
              filteredParticipants.map((memberId) => {
                const user = pcMemberUsers[memberId];
                const isLoading = loadingUsers[memberId];

                return (
                  <div
                    key={memberId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: colors.primary[900],
                      borderRadius: "8px",
                      padding: "10px 15px",
                      marginBottom: "10px",
                    }}
                  >
                    <FaUserAlt style={{ marginRight: "10px" }} />
                    <span>
                      {isLoading
                        ? "Loading..."
                        : user
                        ? `${user.name} ${user.surname || ""}, ${getUserRoles(
                            memberId
                          )}`
                        : `${memberId}, Role Unknown`}
                    </span>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: colors.grey[400],
                }}
              >
                {searchTerm
                  ? "No matching participants found"
                  : "No participants added yet"}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Track information */}
        <div
          style={{
            backgroundColor: colors.transparent,
            borderRadius: "8px",
            border: `1px solid ${colors.grey[100]}`,
            padding: "20px",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>
                Submissions:{" "}
                {activeConference?.tracks?.reduce(
                  (acc, track) => acc + (track.papers?.length || 0),
                  0
                ) || 0}
              </span>
              <span
                onClick={handleViewSubmissions}
                style={{
                  color: colors.greenAccent[400],
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                View
              </span>
            </div>
            <div>
              <span>Track Count: {activeConference?.tracks?.length || 0}</span>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              color: colors.grey[300],
              marginBottom: "20px",
            }}
          >
            click on tracks to switch to track view
          </p>

          {/* Tracks list */}
          {(activeConference?.tracks || []).length > 0 ? (
            activeConference?.tracks.map((track, index) => (
              <div
                key={track._id || index}
                style={{
                  backgroundColor: colors.primary[900],
                  borderRadius: "8px",
                  border: `1px solid ${colors.grey[100]}`,
                  padding: "15px",
                  marginBottom: "15px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/conference/`)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4>
                    {track.track_name || `TRACK${index + 1}`}, Chair(s):
                    {track.track_chairs && track.track_chairs.length > 0
                      ? track.track_chairs
                          .map((id) => {
                            if (pcMemberUsers[id])
                              return ` ${pcMemberUsers[id].name} ${
                                pcMemberUsers[id].surname || ""
                              }`;
                            return " Unknown";
                          })
                          .join(", ")
                      : " None assigned"}
                  </h4>
                  <AppButton text="Configure track" />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    color: colors.grey[300],
                    fontSize: "14px",
                  }}
                >
                  <div>
                    <span>Submissions: {track.papers?.length || 0}</span>
                  </div>
                  <div>
                    <span>Reviews: {track.reviews?.length || 0}</span>
                  </div>
                  <div>
                    <span>Assignments: {track.assignments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: colors.grey[400],
              }}
            >
              No tracks found for this conference
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConferenceOverview;

import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import TopBar from "../../global/TopBar";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import ProfileUserRoles from "./components/ProfileUserRoles";
import { tokens } from "../../../theme";
import { useNavigate, useParams } from "react-router-dom";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import { useUser } from "../../../context/UserContext";
import { CircularProgress } from "@mui/material";
import { emptyRole, getUserStats, UserData } from "../../../models/user";
import { getUserById } from "../../../services/userService";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();
  const { user: currentUser, loading: contextLoading } = useUser();
  const { id } = useParams<{ id: string }>();
  const [profileUser, setProfileUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data based on URL parameter
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        console.log("Current user:", currentUser);
        console.log("User ID from URL:", id);
        
        // If ID is "me" or not provided, use the current logged-in user
        if (id == currentUser?.id || !id) {
          if (currentUser) {
            setProfileUser(currentUser);
          } else if (!contextLoading) {
            navigate("/login");
          }
        } else {
          // Otherwise fetch the user with the specified ID
          const userData = await getUserById(id);
          setProfileUser(userData);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(contextLoading ? true : false);
      }
    };

    fetchUserData();
  }, [id, currentUser, contextLoading, navigate]);

  // Log the user data structure for debugging
  useEffect(() => {
    if (profileUser) {
      console.log("User data structure:", JSON.stringify(profileUser, null, 2));
    }
  }, [profileUser]);

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
  };

  // Inline styles using theme values
  const profilePageStyle: React.CSSProperties = {
    display: "flex",
    height: "100vh",
    width: "100vw",
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  };

  const profileContainerStyle: React.CSSProperties = {
    display: "flex",
    width: "100%",
    height: "100%",
  };

  const sideMenuContainerStyle: React.CSSProperties = {
    width: "220px",
    height: "100%",
  };

  // Add new container for content with TopBar
  const contentWrapperStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
  };

  const contentContainerStyle: React.CSSProperties = {
    flexGrow: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  const headerOuterStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginTop: "20px",
  };

  const headerInnerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  };

  const userPartStyle: React.CSSProperties = {
    width: "50%",
  };

  const numericPartStyle: React.CSSProperties = {
    width: "50%",
  };

  const contactContainerStyle: React.CSSProperties = {
    width: "50%",
  };

  const contactStyle: React.CSSProperties = {
    textAlign: "start",
  };

  const bottomContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    marginTop: "20px",
    width: "100%",
    justifyContent: "start",
    gap: "20px", // Add spacing between containers
  };

  const roleContainerStyle: React.CSSProperties = {
    width: "45%",
  };

  const statsContainerStyle: React.CSSProperties = {
    border: `1px solid ${colors.grey[100]}`, // Match ProfileUserRoles border
    borderRadius: "12px",
    width: "45%",
    padding: "15px", // Match ProfileUserRoles padding
    color: colors.grey[100], // Match ProfileUserRoles text color
  };

  const statsTableStyle: React.CSSProperties = {
    marginLeft: "5px",
    borderCollapse: "collapse",
    width: "95%",
    marginTop: "10px", // Add some spacing after the title
  };

  const statsCellStyle: React.CSSProperties = {
    border: `1px solid ${colors.grey[100]}`, // Match ProfileUserRoles border
    padding: "8px",
    textAlign: "left",
    width: "45%",
  };

  const loadingContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  };

  const errorContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    color: colors.redAccent[500],
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorContainerStyle}>
        <p>{error}</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div style={errorContainerStyle}>
        <p>User not found</p>
      </div>
    );
  }

  // Add safe access to potentially undefined properties
  const userStats = getUserStats(profileUser);
  const userRoles = profileUser.roles;
  const activeRoles = userRoles?.active || [emptyRole];
  const pastRoles = userRoles?.past ||  [emptyRole];

  return (
    <div style={profilePageStyle}>
      {/* Rest of your component rendering */}
      <div style={profileContainerStyle}>
        <div style={sideMenuContainerStyle}>
          <SideMenu items={menuItems} onItemClick={handleItemClick} />
        </div>
        <div style={contentWrapperStyle}>
          <TopBar />
          <div style={contentContainerStyle}>
            <AppTitle text={`${profileUser.name || ""} ${profileUser.surname || ""}`} />
            <div style={headerOuterStyle}>
              <div style={headerInnerStyle}>
                <div style={userPartStyle}>
                  <p>{`${profileUser.name || ""} ${profileUser.surname || ""}`}</p>
                  <p>Bio: {profileUser.bio || "No bio provided"}</p>
                </div>
                <div style={numericPartStyle}>
                  <p>Total Reviews: {userStats.totalReviews || 0}</p>
                  <p>Conferences Worked: {userStats.conferencesWorked || 0}</p>
                  <p>Submissions: {userStats.submissions || 0}</p>
                </div>
              </div>
              <div style={contactContainerStyle}>
                <p style={contactStyle}>Contact: {profileUser.email || ""}</p>
              </div>
            </div>
            <div style={bottomContainerStyle}>
              <div style={roleContainerStyle}>
                <ProfileUserRoles
                  activeRoles={(activeRoles || []).map((role) => ({
                    name: role?.name || "Unknown",
                  }))}
                  pastRoles={(pastRoles || []).map((role) => ({
                    name: role?.name || "Unknown",
                  }))}
                />
              </div>
              <div style={statsContainerStyle}>
                <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                  Stats
                </h3>
                <div>
                  <table style={statsTableStyle}>
                    <tbody>
                      <tr>
                        <td style={statsCellStyle}>Average Rating Given</td>
                        <td style={statsCellStyle}>{userStats.avg_rating_given}</td>
                      </tr>
                      <tr>
                        <td style={statsCellStyle}>Avg Time Before Deadline</td>
                        <td style={statsCellStyle}>{userStats.avg_submit_time_before_deadline}</td>
                      </tr>
                      <tr>
                        <td style={statsCellStyle}>Avg Time to Review</td>
                        <td style={statsCellStyle}>{userStats.avg_time_to_review}</td>
                      </tr>
                      <tr>
                        <td style={statsCellStyle}>Deadline Compliance Rate</td>
                        <td style={statsCellStyle}>{userStats.deadline_compliance_rate}</td>
                      </tr>
                      <tr>
                        <td style={statsCellStyle}>Review Rating</td>
                        <td style={statsCellStyle}>{userStats.review_rating}</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

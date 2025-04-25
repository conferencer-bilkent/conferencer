import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import TopBar from "../../global/TopBar";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import { tokens } from "../../../theme";
import { useNavigate, useParams } from "react-router-dom";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import { CircularProgress } from "@mui/material";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get user id from URL
  const menuItems = getMenuItemsForPage("default");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/profile/${id}`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        navigate("/login"); // Redirect if error
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, navigate]);

  const handleItemClick = (item: string) => {
    handleMenuItemClick(item, navigate);
  };

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

  const statsContainerStyle: React.CSSProperties = {
    width: "45%",
    border: `1px solid ${colors.grey[100]}`,
    borderRadius: "12px",
    padding: "15px",
    color: colors.grey[100],
  };

  const statsTableStyle: React.CSSProperties = {
    marginLeft: "5px",
    borderCollapse: "collapse",
    width: "95%",
    marginTop: "10px",
  };

  const statsCellStyle: React.CSSProperties = {
    border: `1px solid ${colors.grey[100]}`,
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

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = user.stats && user.stats.length > 0 ? user.stats[0] : null;

  return (
    <div style={profilePageStyle}>
      <div style={profileContainerStyle}>
        <div style={sideMenuContainerStyle}>
          <SideMenu items={menuItems} onItemClick={handleItemClick} />
        </div>
        <div style={contentWrapperStyle}>
          <TopBar />
          <div style={contentContainerStyle}>
            <AppTitle text={`${user.name} ${user.surname}`} />
            <div style={headerOuterStyle}>
              <div style={headerInnerStyle}>
                <div style={userPartStyle}>
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Surname:</strong> {user.surname}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Bio:</strong> {user.bio || "No bio provided"}
                  </p>
                </div>

                <div style={statsContainerStyle}>
                  <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Stats
                  </h3>
                  {stats ? (
                    <table style={statsTableStyle}>
                      <tbody>
                        <tr>
                          <td style={statsCellStyle}>Avg. Time to Review</td>
                          <td style={statsCellStyle}>
                            {stats.avg_time_to_review}
                          </td>
                        </tr>
                        <tr>
                          <td style={statsCellStyle}>
                            Avg. Submit Time Before Deadline
                          </td>
                          <td style={statsCellStyle}>
                            {stats.avg_submit_time_before_deadline}
                          </td>
                        </tr>
                        <tr>
                          <td style={statsCellStyle}>
                            Deadline Compliance Rate
                          </td>
                          <td style={statsCellStyle}>
                            {stats.deadline_compliance_rate}
                          </td>
                        </tr>
                        <tr>
                          <td style={statsCellStyle}>Avg. Rating Given</td>
                          <td style={statsCellStyle}>
                            {stats.avg_rating_given}
                          </td>
                        </tr>
                        <tr>
                          <td style={statsCellStyle}>Avg. Words per Review</td>
                          <td style={statsCellStyle}>
                            {stats.avg_words_per_review}
                          </td>
                        </tr>
                        <tr>
                          <td style={statsCellStyle}>Review Rating</td>
                          <td style={statsCellStyle}>{stats.review_rating}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>No statistics available.</p>
                  )}
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

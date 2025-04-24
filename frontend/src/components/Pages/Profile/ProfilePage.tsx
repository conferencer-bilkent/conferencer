import React from "react";
import { useTheme } from "@mui/material/styles";
import AppTitle from "../../global/AppTitle";
import SideMenu from "../../global/SideMenu";
import TopBar from "../../global/TopBar"; // Import TopBar component
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import ProfileUserRoles from "./components/ProfileUserRoles";
import { tokens } from "../../../theme";
import { useNavigate } from "react-router-dom";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const menuItems = getMenuItemsForPage("default");
  const navigate = useNavigate();

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
    border: `1px solid ${colors.grey[100]}`,// Match ProfileUserRoles border
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

  return (
    <div style={profilePageStyle}>
      <div style={profileContainerStyle}>
        <div style={sideMenuContainerStyle}>
          <SideMenu items={menuItems} onItemClick={handleItemClick} />
        </div>
        {/* New wrapper container for TopBar and content */}
        <div style={contentWrapperStyle}>
          <TopBar />
          <div style={contentContainerStyle}>
            <AppTitle text="PROFILE NAME" />
            <div style={headerOuterStyle}>
              <div style={headerInnerStyle}>
                <div style={userPartStyle}>
                  <p>Atilla Emre Söylemez</p>
                  <p>Bio: I am a CS Student....</p>
                </div>
                <div style={numericPartStyle}>
                  <p>Total Reviews: 210</p>
                  <p>Conferences Worked: 3</p>
                  <p>Submissions: 1 View</p>
                </div>
              </div>
              <div style={contactContainerStyle}>
                <p style={contactStyle}>Contact: emre.soylemez@bilkent.edu.tr</p>
              </div>
            </div>
            <div style={bottomContainerStyle}>
              <div style={roleContainerStyle}>
                <ProfileUserRoles
                  activeRoles={[
                    { name: "RECOMB2023, PC Member(TRACK1), Track Chair (YTTW2)" },
                    { name: "CS FAIR, Superchair" },
                  ]}
                  pastRoles={[
                    { name: "RECOMB2022, PC Member(TRACK1), Track Chair (TRACK2)" },
                  ]}
                />
              </div>
              <div style={statsContainerStyle}>
                <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>Stats</h3>
                <div>
                  <table style={statsTableStyle}>
                    <tbody>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                          <td style={statsCellStyle}>Average fala filan</td>
                          <td style={statsCellStyle}>Average fala filan</td>
                        </tr>
                      ))}
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

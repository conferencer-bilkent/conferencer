import React, { useState, useEffect } from "react";
import { useConference } from "../../../context/ConferenceContext";
import { useNavigate } from "react-router-dom";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppTitle, { SectionTitle } from "../../global/AppTitle";
import { getAllConferences } from "../../../services/conferenceService";
import { Conference } from "../../../models/conference";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
import "./Homepage.css";

const Homepage: React.FC = () => {
  const { setActiveConference } = useConference();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const menuItems = getMenuItemsForPage("default");

  useEffect(() => {
    getAllConferences()
      .then(setConferences)
      .finally(() => setLoading(false));
  }, []);

  const handleConferenceClick = (conf: Conference) => {
    setActiveConference(conf);
    navigate("/conference");
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleItemClick = (item: string) => {
    if (item === "LOG OUT") {
      handleLogout();
    } else {
      handleMenuItemClick(item, navigate);
    }
  };

  const handleCreateConference = () => {
    navigate("/conference/create");
  };
  const handleAssignPaper = () => {
    navigate("/addSubmission");
  };

  return (
    <div className="homepage-container">
      <div className="topbar-wrapper">
        <Topbar />
      </div>

      <div className="main-content-container">
        <SideMenu items={menuItems} onItemClick={handleItemClick} />

        <div className="content-container">
          <div className="button-group">
            <button
              className="create-conference-button"
              onClick={handleCreateConference}
            >
              Create New Conference
            </button>
            <button
              className="create-conference-button"
              onClick={handleAssignPaper}
            >
              Assign paper
            </button>
          </div>

          <div className="sections-container">
            <div className="section">
              <SectionTitle text="Upcoming Conferences" />
              {loading ? (
                <div>Loading…</div>
              ) : conferences.length > 0 ? (
                <div className="conference-list">
                  {conferences.map((conf) => (
                    <AppTitle
                      key={conf.id}
                      text={conf.name}
                      onClick={() => handleConferenceClick(conf)}
                    />
                  ))}
                </div>
              ) : (
                <div>No conferences found</div>
              )}
            </div>

            <div className="section">
              <SectionTitle text="Past Conferences" />
              <AppTitle text="BILKENT CONFERENCE 2023" />
              <AppTitle text="CS FAIR 2023" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

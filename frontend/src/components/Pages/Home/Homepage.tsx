import React, { useState, useEffect } from "react";
//import { useConference } from "../../../context/ConferenceContext";
import { useNavigate } from "react-router-dom";
import Topbar from "../../global/TopBar";
import SideMenu from "../../global/SideMenu";
import AppTitle, { SectionTitle } from "../../global/AppTitle";
import { getAllConferences } from "../../../services/conferenceService";
import { Conference } from "../../../models/conference";
import { getMenuItemsForPage } from "../../global/sideMenuConfig";
import { handleMenuItemClick } from "../../../utils/navigation/menuNavigation";
//import useAuth from "../../hooks/useAuth";
import "./Homepage.css";

const Homepage: React.FC = () => {
  //const { activeConference, setActiveConference } = useConference();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const menuItems = getMenuItemsForPage("default");
  //useAuth();

  useEffect(() => {
    getAllConferences()
      .then(setConferences)
      .finally(() => setLoading(false));
  }, []);

  // on click, set globally
  // const handleConferenceClick = (conf: Conference) => {
  //   setActiveConference(conf);
  // };

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
    navigate("/paper/assign");
  };

  console.log("Conferences:", conferences);
  return (
    <>
      <Topbar></Topbar>
      <div className="homepage-container">
        {/* Side Menu on the left */}
        <SideMenu items={menuItems} onItemClick={handleItemClick} />

        {/* Container on the right */}
        <div className="content-container">
          {/* Create Conference Button */}
          <div className="create-conference-button-container">
            <button
              className="create-conference-button"
              onClick={handleCreateConference}
            >
              Create New Conference
            </button>
          </div>
          <div className="create-conference-button-container">
            <button
              className="create-conference-button"
              onClick={handleAssignPaper}
            >
              Assign paper
            </button>
          </div>
          {/* Upcoming Conferences Section */}
          <div className="section">
            <SectionTitle text="Upcoming Conferences" />
            {loading ? (
              <div>Loading…</div>
            ) : conferences.length > 0 ? (
              <div className="conference-list">
                {conferences.map(
                  (conf) => (
                    console.log(conf.id),
                    (
                      <AppTitle
                        key={conf.id}
                        text={conf.name}
                        //onClick={() => handleConferenceClick(conf)}
                      />
                    )
                  )
                )}
              </div>
            ) : (
              <div>No conferences found</div>
            )}
          </div>

          {/* Past Conferences Section */}
          <div className="section">
            <SectionTitle text="Past Conferences" />
            <AppTitle text="BILKENT CONFERENCE 2023" />
            <AppTitle text="CS FAIR 2023" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;

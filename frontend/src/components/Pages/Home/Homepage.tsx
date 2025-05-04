import React, { useState, useEffect } from "react";
import { useConference } from "../../../context/ConferenceContext";
import { useNavigate } from "react-router-dom";
import AppTitle, { SectionTitle } from "../../global/AppTitle";
import { getAllConferences } from "../../../services/conferenceService";
import { Conference } from "../../../models/conference";
import "./Homepage.css";

export const isConferencePastDue = (conference: Conference): boolean => {
  const endDate = conference.endDate ? new Date(conference.endDate) : null;
  return endDate ? endDate < new Date() : false;
};

const Homepage: React.FC = () => {
  const { setActiveConference } = useConference();
  const [upcomingConferences, setUpcomingConferences] = useState<Conference[]>(
    []
  );
  const [pastConferences, setPastConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllConferences()
      .then((conferences) => {
        const now = new Date();
        const upcoming: Conference[] = [];
        const past: Conference[] = [];

        conferences.forEach((conf) => {
          if (isConferencePastDue(conf)) {
            past.push(conf);
          } else {
            upcoming.push(conf);
          }
        });

        setUpcomingConferences(upcoming);
        setPastConferences(past);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleConferenceClick = (conf: Conference) => {
    setActiveConference(conf);
    navigate("/conference");
  };

  return (
    <div className="content-container">
      <div className="sections-container">
        <div className="section">
          <SectionTitle text="Upcoming Conferences" />
          {loading ? (
            <div>Loading…</div>
          ) : upcomingConferences.length > 0 ? (
            <div className="conference-list">
              {upcomingConferences.map((conf) => (
                <AppTitle
                  key={conf.id}
                  text={conf.name}
                  onClick={() => handleConferenceClick(conf)}
                />
              ))}
            </div>
          ) : (
            <div>No upcoming conferences found</div>
          )}
        </div>

        <div className="section">
          <SectionTitle text="Past Conferences" />
          {loading ? (
            <div>Loading…</div>
          ) : pastConferences.length > 0 ? (
            <div className="conference-list">
              {pastConferences.map((conf) => (
                <AppTitle
                  key={conf.id}
                  text={conf.name}
                  onClick={() => handleConferenceClick(conf)}
                />
              ))}
            </div>
          ) : (
            <div>No past conferences found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import React, { useEffect, useState } from "react";
import { useConference } from "../../../context/ConferenceContext";
import { useNavigate } from "react-router-dom";
import AppTitle from "../../global/AppTitle";
import AppButton from "../../global/AppButton";
import "../Conference/CreateConference/CreateConference.css";  // Import for consistent button + form style
import { getSeriesStats } from "../../../services/conferenceService";

interface PcMemberStat {
  pc_member_id: string;
  pc_member_name: string;
  avg_submit_time_before_deadline: string;
  review_rating: number;
  avg_words_per_review: number;
  avg_time_to_review: string;
  avg_rating_given: number;
}

const SeriesStatsPage: React.FC = () => {
  const { activeConference } = useConference();
  const navigate = useNavigate();
  const [stats, setStats] = useState<PcMemberStat[]>([]);
  const [sortField, setSortField] = useState<string>("avg_rating_given");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (false) return;
  
      setLoading(true);
      try {
        const statsData = await getSeriesStats('681904ecf4e35e758fbc3ccb');
        setStats(statsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStats();
  }, [activeConference]);
  

  const sortedStats = [...stats].sort((a, b) => {
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    return typeof aValue === "number" ? bValue - aValue : 0;
  });

  return (
    <div className="content-container">
      <AppTitle text="PC Member Statistics" />
      <AppButton
        text="Back to Conference"
        onClick={() => navigate("/conference/overview")}
      />
      {loading ? (
        <p>Loading stats...</p>
      ) : stats.length === 0 ? (
        <p>No statistics available.</p>
      ) : (
        <table
          className="form-field"
          style={{ marginTop: "20px", width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th
                onClick={() =>
                  setSortField("avg_submit_time_before_deadline")
                }
                style={{ cursor: "pointer" }}
              >
                Submit Time Before Deadline
              </th>
              <th
                onClick={() => setSortField("review_rating")}
                style={{ cursor: "pointer" }}
              >
                Review Rating
              </th>
              <th
                onClick={() => setSortField("avg_words_per_review")}
                style={{ cursor: "pointer" }}
              >
                Avg Words/Review
              </th>
              <th
                onClick={() => setSortField("avg_time_to_review")}
                style={{ cursor: "pointer" }}
              >
                Time to Review
              </th>
              <th
                onClick={() => setSortField("avg_rating_given")}
                style={{ cursor: "pointer" }}
              >
                Avg Rating Given
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat) => (
              <tr key={stat.pc_member_id}>
                <td>{stat.pc_member_name}</td>
                <td>{stat.avg_submit_time_before_deadline}</td>
                <td>{stat.review_rating.toFixed(2)}</td>
                <td>{stat.avg_words_per_review.toFixed(2)}</td>
                <td>{stat.avg_time_to_review}</td>
                <td>{stat.avg_rating_given.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SeriesStatsPage;

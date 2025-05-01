import React from "react";
import "./selectTrackPage.css";
import { useConference } from "../../../../../../../context/ConferenceContext";
import { useSubmissionContext } from "../../../../../../../context/addSubmissionContext";

const SelectTrackPage: React.FC = () => {
  const { state, handleInput } = useSubmissionContext();
  const { activeConference } = useConference();

  if (!activeConference?.tracks) {
    return <div>No tracks available</div>;
  }
  return (
    <div className="radioSelectTrack">
      {activeConference.tracks.map((track) => (
        <label key={track._id}>
          <input
            type="radio"
            value={track._id}
            checked={state.selectedTrack === track._id}
            onChange={(e) => handleInput(e, "selectedTrack")}
          />
          {track.track_name}
        </label>
      ))}
    </div>
  );
};

export default SelectTrackPage;

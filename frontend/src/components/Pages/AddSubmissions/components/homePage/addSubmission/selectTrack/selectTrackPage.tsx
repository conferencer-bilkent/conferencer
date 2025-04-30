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
  console.log("activeConference", activeConference.tracks);
  return (
    <div className="radioSelectTrack">
      {activeConference.tracks.map(
        (track) => (
          console.log("track", track),
          (
            <label key={track._id}>
              <input
                type="radio"
                value={track.track_name}
                checked={state.selectedTrack === track.track_name}
                onChange={(e) => handleInput(e, "selectedTrack")}
              />
              {track.track_name}
            </label>
          )
        )
      )}
    </div>
  );
};

export default SelectTrackPage;

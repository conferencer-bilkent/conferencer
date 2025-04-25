import React from 'react';
import './selectTrackPage.css';
import { trackingList } from '../../../../../../../utils/trackingList/trackingList';
import { useSubmissionContext } from '../../../../../../../context/addSubmissionContext';
useSubmissionContext
const SelectTrackPage: React.FC = () => {
    const {state, handleInput} = useSubmissionContext();
  return (
    <div className="radioSelectTrack">
        {trackingList.map((trackingItem, index) => (
            <label key={index} >
                <input
                    type='radio'
                    value={trackingItem}
                    checked={state.selectedTrack === trackingItem}
                    onChange={(e) => handleInput(e, "selectedTrack")
                    
                    }
                />
                {trackingItem}
            </label>
        ))};
    </div>
  )
}

export default SelectTrackPage;
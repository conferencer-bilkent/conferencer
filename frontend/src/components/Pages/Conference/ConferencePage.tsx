import React from 'react';
import AppButton from '../../global/AppButton';// Import the AppButton component
import { FaVideo, FaMicrophone } from 'react-icons/fa'; // Example icons from react-icons library

const ConferencePage: React.FC = () => {
  return (
    <div className="conference-page">
      <h1>Welcome to the Conference</h1>
      <p>Join the meeting and start collaborating!</p>

      {/* Example usage of AppButton with a video icon */}
      <AppButton icon={<FaVideo />} text="Start Video" />

      {/* Example usage of AppButton with a microphone icon */}
      <AppButton icon={<FaMicrophone />} text="Mute Audio" />
    </div>
  );
};

export default ConferencePage;
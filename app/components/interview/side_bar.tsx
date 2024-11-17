import React, { useState, useEffect } from "react";
import { FaPause, FaPlay } from "react-icons/fa"; // Import Pause and Play icons

const Sidebar: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isRunning, setIsRunning] = useState(true); // State to track if the timer is running

  useEffect(() => {
    if (!isRunning) return; // Do nothing if the timer is paused

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)); // Decrement by 1 second
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [isRunning]); // Only run the effect when `isRunning` changes

  // Format timeLeft as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="w-full md:w-16 h-16 md:h-screen bg-gray-900 flex flex-col md:justify-center items-center py-4 px-4 md:px-10">
      {/* Top Section: Timer */}
      <div className="text-white mb-8">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-blue-500">
          <span className="text-lg">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Middle Section: Pause/Play Button */}
      <div
        className="bg-blue-500 p-4 rounded-full mb-6 cursor-pointer flex items-center justify-center"
        onClick={() => setIsRunning((prev) => !prev)} // Toggle running state
      >
        {isRunning ? (
          <FaPause className="text-white text-lg" /> // Pause Icon
        ) : (
          <FaPlay className="text-white text-lg" /> // Play Icon
        )}
      </div>

      {/* Middle Section: Information Button */}
      <div className="bg-gray-700 p-4 rounded-full mb-6">
        {/* Information Icon (replace with actual icon) */}
        <span className="block w-4 h-4 bg-blue-500"></span>
      </div>

      {/* Middle Section: Settings Button */}
      <div className="bg-gray-700 p-4 rounded-full">
        {/* Settings Icon (replace with actual icon) */}
        <span className="block w-4 h-4 bg-blue-500"></span>
      </div>
    </div>
  );
};

export default Sidebar;

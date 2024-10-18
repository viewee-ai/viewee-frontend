import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-16 h-screen bg-gray-900 flex flex-col justify-center items-center py-4">
      {/* Top Section: Timer */}
      <div className="text-white mb-8">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-4 border-blue-500">
          <span className="text-lg">8:46</span>
        </div>
      </div>

      {/* Middle Section: Pause Button */}
      <div className="bg-gray-700 p-4 rounded-full mb-6">
        {/* Pause Icon (replace with actual icon) */}
        <span className="block w-4 h-4 bg-blue-500"></span>
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

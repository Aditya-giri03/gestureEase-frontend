import { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [weather, setWeather] = useState({
    temp: 24,
    condition: 'Sunny',
    humidity: 65,
    location: 'New Delhi',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">GestureEase</h1>
          <p className="text-gray-600 text-lg">
            Gesture-based Home Automation System
          </p>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Weather Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-blue-500 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-white font-semibold text-2xl">
                    {weather.location}
                  </h2>
                  <p className="text-blue-100">{weather.condition}</p>
                </div>
                <div className="text-white text-4xl font-bold">
                  {weather.temp}°C
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center text-gray-700">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <span>Humidity: {weather.humidity}%</span>
                </div>
                <button className="text-blue-500 hover:text-blue-700">
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Calibrate Card */}
          <Link to="/calibrate">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer">
              <div className="bg-purple-500 p-6 flex justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Calibrate
                </h2>
                <p className="text-gray-600">
                  Configure and Calibrate your Camera Setup
                </p>
              </div>
            </div>
          </Link>

          {/* Add Device Card */}
          <Link to="/add-device">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full transform hover:-translate-y-1 cursor-pointer">
              <div className="bg-green-500 p-6 flex justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Add Device
                </h2>
                <p className="text-gray-600">Configure New Devices</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} GestureEase - Control your Home with
            Gestures
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;

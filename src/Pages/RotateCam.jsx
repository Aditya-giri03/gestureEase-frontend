import { useState } from 'react';

const RotateCam = () => {
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Camera 1', rotation: 0 },
    { id: 2, name: 'Camera 2', rotation: 0 },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Track which camera and step size is currently rotating (for UI feedback)
  const [activeRotation, setActiveRotation] = useState({
    cameraId: null,
    stepSize: null,
  });

  const rotateCamera = async (cameraId, stepSize) => {
    // Disable all buttons
    setIsLoading(true);

    setActiveRotation({
      cameraId,
      stepSize,
    });

    try {
      const response = await fetch('http://100.64.238.95:8080/rotate-camera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cameraId: cameraId,
          stepSize: stepSize,
        }),
      });

      if (response.ok) {
        // Update local state to reflect the rotation
        setCameras(
          cameras.map((camera) => {
            if (camera.id === cameraId) {
              return {
                ...camera,
                rotation: camera.rotation + stepSize,
              };
            }
            return camera;
          })
        );

        // Reset
        setIsLoading(false);
        setActiveRotation({
          cameraId: null,
          stepSize: null,
        });
      } else {
        console.error('Failed to rotate camera');
        setIsLoading(false);
        setActiveRotation({
          cameraId: null,
          stepSize: null,
        });
      }
    } catch (error) {
      console.error('Error rotating camera:', error);
      setIsLoading(false);
      setActiveRotation({
        cameraId: null,
        stepSize: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Camera Rotation
          </h1>
          <p className="text-gray-600 text-lg">
            Adjust the orientation of your Cameras
          </p>
        </header>

        {/* Camera Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Camera Header */}
              <div className="bg-indigo-600 p-4 text-white">
                <h2 className="text-xl font-semibold">{camera.name}</h2>
              </div>

              {/* Camera Preview */}
              <div className="p-6 flex flex-col items-center">
                <div className="relative w-48 h-48 mb-6 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                  {/* Camera Icon */}
                  <div
                    className="transform transition-transform duration-500"
                    style={{ transform: `rotate(${camera.rotation}deg)` }}
                  >
                    <svg
                      className="w-24 h-24 text-indigo-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Rotation Display */}
                <p className="text-gray-700 mb-4">
                  Current rotation: {camera.rotation}°
                </p>

                {/* Control Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => rotateCamera(camera.id, -5)}
                    disabled={isLoading}
                    className={`flex items-center justify-center font-medium py-2 px-4 rounded-lg transition-colors ${
                      isLoading
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                    }`}
                  >
                    {isLoading &&
                    activeRotation.cameraId === camera.id &&
                    activeRotation.stepSize === -5 ? (
                      <span>Rotating...</span>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                        Counter-clockwise (-5°)
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => rotateCamera(camera.id, 5)}
                    disabled={isLoading}
                    className={`flex items-center justify-center font-medium py-2 px-4 rounded-lg transition-colors ${
                      isLoading
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                    }`}
                  >
                    {isLoading &&
                    activeRotation.cameraId === camera.id &&
                    activeRotation.stepSize === 5 ? (
                      <span>Rotating...</span>
                    ) : (
                      <>
                        Clockwise (+5°)
                        <svg
                          className="w-5 h-5 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default RotateCam;

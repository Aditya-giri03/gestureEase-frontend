import { useState, useEffect } from 'react';

const RotateCam = () => {
  const [cameras, setCameras] = useState([
    { id: 1, name: 'Camera 1', rotation: 0, previewImage: null },
    { id: 2, name: 'Camera 2', rotation: 0, previewImage: null },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [activeRotation, setActiveRotation] = useState({
    cameraId: null,
    direction: null,
    isReset: false,
  });
  const API_BASE_URL = 'http://100.91.131.94:4000';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Create a new cameras array that we'll update
        const updatedCameras = [...cameras];

        // 1. Fetch initial rotation values
        const rotationResponse = await fetch(
          `${API_BASE_URL}/get-camera-position`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (rotationResponse.ok) {
          const rotationData = await rotationResponse.json();
          // Apply rotation values to each camera in our updatedCameras array
          updatedCameras.forEach((camera) => {
            camera.rotation =
              rotationData[`cam${camera.id}`].current_position ||
              camera.rotation;
          });
        }

        // 2. Fetch initial images for both cameras
        for (const camera of updatedCameras) {
          try {
            const pictureResponse = await fetch(
              `${API_BASE_URL}/get-picture/${camera.id}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (pictureResponse.ok) {
              const imageBlob = await pictureResponse.blob();
              const imageUrl = URL.createObjectURL(imageBlob);

              // Update camera with image
              camera.previewImage = imageUrl;
            }
          } catch (error) {
            console.error(
              `Error fetching picture for camera ${camera.id}:`,
              error
            );
          }
        }

        setCameras([...updatedCameras]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const rotateCamera = async (cameraId, direction) => {
    // Disable all buttons
    setIsLoading(true);

    setActiveRotation({
      cameraId,
      direction,
      isReset: false,
    });

    const stepSize = 20;
    const rotationChange = direction === 'clock' ? stepSize : -stepSize;

    try {
      const response = await fetch(`${API_BASE_URL}/rotate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camera_id: cameraId,
          step_size: stepSize,
          direction: direction,
        }),
      });

      if (response.ok) {
        // Get the image blob from the response
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        setCameras(
          cameras.map((camera) => {
            if (camera.id === cameraId) {
              return {
                ...camera,
                rotation: camera.rotation + rotationChange,
                previewImage: imageUrl,
              };
            }
            return camera;
          })
        );

        // Reset
        setIsLoading(false);
        setActiveRotation({
          cameraId: null,
          direction: null,
          isReset: false,
        });
      } else {
        console.error('Failed to rotate camera');
        setIsLoading(false);
        setActiveRotation({
          cameraId: null,
          direction: null,
          isReset: false,
        });
      }
    } catch (error) {
      console.error('Error rotating camera:', error);
      setIsLoading(false);
      setActiveRotation({
        cameraId: null,
        direction: null,
        isReset: false,
      });
    }
  };

  const resetCamera = async (cameraId) => {
    // Disable all buttons
    setIsLoading(true);

    setActiveRotation({
      cameraId,
      direction: null,
      isReset: true,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/reset-camera-position`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          camera_id: cameraId,
        }),
      });

      if (response.ok) {
        // Get the image blob from the response
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);

        setCameras(
          cameras.map((camera) => {
            if (camera.id === cameraId) {
              return {
                ...camera,
                rotation: 0, // Reset rotation to 0
                previewImage: imageUrl,
              };
            }
            return camera;
          })
        );

        // Reset loading state
        setIsLoading(false);
        setActiveRotation({
          cameraId: null,
          direction: null,
          isReset: false,
        });
      } else {
        console.error('Failed to reset camera');
        setIsLoading(false);
        setActiveRotation({
          cameraId: null,
          direction: null,
          isReset: false,
        });
      }
    } catch (error) {
      console.error('Error resetting camera:', error);
      setIsLoading(false);
      setActiveRotation({
        cameraId: null,
        direction: null,
        isReset: false,
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
            Adjust the orientation of your cameras
          </p>
        </header>

        {/* Initial Loading State */}
        {initialLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <span className="ml-3 text-lg text-gray-700">
              Loading camera data...
            </span>
          </div>
        )}

        {/* Camera Controls */}
        {!initialLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-indigo-600 p-4 text-white">
                  <h2 className="text-xl font-semibold">{camera.name}</h2>
                </div>

                <div className="p-6 flex flex-col items-center">
                  <div className="relative w-full h-64 mb-6 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                    {camera.previewImage ? (
                      // Show the actual camera image when available
                      <img
                        src={camera.previewImage}
                        alt={`${camera.name} view`}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      // Show the camera icon when no image is available
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
                    )}
                  </div>

                  {/* Rotation Display */}
                  <p className="text-gray-700 mb-4">
                    Current rotation: {camera.rotation}°
                  </p>

                  {/* Control Buttons */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => rotateCamera(camera.id, 'anticlock')}
                      disabled={isLoading}
                      className={`flex items-center justify-center font-medium py-2 px-4 rounded-lg transition-colors ${
                        isLoading
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                      }`}
                    >
                      {isLoading &&
                      activeRotation.cameraId === camera.id &&
                      activeRotation.direction === 'anticlock' ? (
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
                          Left
                        </>
                      )}
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={() => resetCamera(camera.id)}
                      disabled={isLoading}
                      className={`flex items-center justify-center font-medium py-2 px-4 rounded-lg transition-colors ${
                        isLoading
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-red-100 hover:bg-red-200 text-red-700'
                      }`}
                    >
                      {isLoading &&
                      activeRotation.cameraId === camera.id &&
                      activeRotation.isReset ? (
                        <span>Resetting...</span>
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
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Reset
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => rotateCamera(camera.id, 'clock')}
                      disabled={isLoading}
                      className={`flex items-center justify-center font-medium py-2 px-4 rounded-lg transition-colors ${
                        isLoading
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                      }`}
                    >
                      {isLoading &&
                      activeRotation.cameraId === camera.id &&
                      activeRotation.direction === 'clock' ? (
                        <span>Rotating...</span>
                      ) : (
                        <>
                          Right
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
        )}

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

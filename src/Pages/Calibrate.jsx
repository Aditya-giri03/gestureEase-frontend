import { useState } from 'react';

const Calibrate = () => {
  // Track the current step in the calibration process
  const [currentStep, setCurrentStep] = useState(3);

  // Track the loading states of various operations
  const [loading, setLoading] = useState({
    camera1Capture: false,
    camera2Capture: false,
    calibration: false,
  });

  // Track the status of captured images
  const [captureStatus, setCaptureStatus] = useState({
    camera1Images: 0,
    camera2Images: 0,
    requiredImages: 10, // Assuming we need 10 images for calibration
    complete: false,
  });

  // Store calibration results
  const [calibrationResults, setCalibrationResults] = useState(null);

  // Error state
  const [error, setError] = useState(null);

  // Handle image capture from a camera
  const captureImage = async (cameraId) => {
    const loadingKey = cameraId === 1 ? 'camera1Capture' : 'camera2Capture';
    const statusKey = cameraId === 1 ? 'camera1Images' : 'camera2Images';

    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setError(null);

    try {
      const response = await fetch('http://100.64.238.95:8080/capture-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cameraId }),
      });

      if (response.ok) {
        // Increment the count of captured images
        setCaptureStatus((prev) => ({
          ...prev,
          [statusKey]: prev[statusKey] + 1,
          complete:
            (statusKey === 'camera1Images'
              ? prev.camera1Images + 1
              : prev.camera1Images) >= prev.requiredImages &&
            (statusKey === 'camera2Images'
              ? prev.camera2Images + 1
              : prev.camera2Images) >= prev.requiredImages,
        }));
      } else {
        setError(`Failed to capture image from Camera ${cameraId}`);
      }
    } catch (err) {
      setError(`Error capturing image: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Perform stereo calibration
  const performStereoCalibration = async () => {
    setLoading((prev) => ({ ...prev, calibration: true }));
    setError(null);

    try {
      const response = await fetch(
        'http://100.64.238.95:8080/stereo-calibration',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        setCalibrationResults(results);
        setCurrentStep(3); // Move to results step
      } else {
        setError('Failed to perform stereo calibration');
      }
    } catch (err) {
      setError(`Error during calibration: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, calibration: false }));
    }
  };

  // Reset the calibration process
  const resetCalibration = () => {
    setCurrentStep(1);
    setCaptureStatus({
      camera1Images: 0,
      camera2Images: 0,
      requiredImages: 10,
      complete: false,
    });
    setCalibrationResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Camera Calibration
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Calibrate your stereo cameras for accurate depth perception
          </p>

          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                currentStep >= 1
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <div
              className={`h-1 w-16 ${
                currentStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            ></div>
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                currentStep >= 2
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <div
              className={`h-1 w-16 ${
                currentStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            ></div>
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                currentStep >= 3
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Step 1: Image Capture */}
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Step 1: Capture Calibration Images
            </h2>
            <p className="text-gray-600 mb-6">
              Hold a checkerboard pattern in front of both cameras and capture
              images from different angles. You need to capture{' '}
              {captureStatus.requiredImages} images from each camera.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Camera 1 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-2">Camera 1</h3>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Images Captured:</span>
                  <span className="font-semibold">
                    {captureStatus.camera1Images} /{' '}
                    {captureStatus.requiredImages}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (captureStatus.camera1Images /
                          captureStatus.requiredImages) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <button
                  onClick={() => captureImage(1)}
                  disabled={
                    loading.camera1Capture ||
                    captureStatus.camera1Images >= captureStatus.requiredImages
                  }
                  className={`w-full py-2 rounded-lg ${
                    loading.camera1Capture ||
                    captureStatus.camera1Images >= captureStatus.requiredImages
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {loading.camera1Capture
                    ? 'Capturing...'
                    : captureStatus.camera1Images >=
                      captureStatus.requiredImages
                    ? 'Complete'
                    : 'Capture Image'}
                </button>
              </div>

              {/* Camera 2 */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium mb-2">Camera 2</h3>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Images Captured:</span>
                  <span className="font-semibold">
                    {captureStatus.camera2Images} /{' '}
                    {captureStatus.requiredImages}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        (captureStatus.camera2Images /
                          captureStatus.requiredImages) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <button
                  onClick={() => captureImage(2)}
                  disabled={
                    loading.camera2Capture ||
                    captureStatus.camera2Images >= captureStatus.requiredImages
                  }
                  className={`w-full py-2 rounded-lg ${
                    loading.camera2Capture ||
                    captureStatus.camera2Images >= captureStatus.requiredImages
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {loading.camera2Capture
                    ? 'Capturing...'
                    : captureStatus.camera2Images >=
                      captureStatus.requiredImages
                    ? 'Complete'
                    : 'Capture Image'}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!captureStatus.complete}
                className={`px-6 py-2 rounded-lg ${
                  captureStatus.complete
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Run Calibration */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Step 2: Run Stereo Calibration
            </h2>
            <p className="text-gray-600 mb-6">
              Now that you've captured images from both cameras, you can run the
              stereo calibration process to calculate the extrinsic and
              intrinsic matrices.
            </p>

            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
              <div className="flex items-center text-indigo-700 mb-2">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Calibration Information</span>
              </div>
              <p className="text-indigo-600 text-sm">
                This process may take a few minutes to complete. The system will
                analyze all captured images to determine the camera parameters
                needed for accurate depth perception.
              </p>
            </div>

            <div className="text-center mb-6">
              <svg
                className="w-20 h-20 mx-auto text-gray-400 mb-4"
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
              <p className="text-gray-600 mb-2">
                Camera 1 Images: {captureStatus.camera1Images} /{' '}
                {captureStatus.requiredImages}
              </p>
              <p className="text-gray-600">
                Camera 2 Images: {captureStatus.camera2Images} /{' '}
                {captureStatus.requiredImages}
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={performStereoCalibration}
                disabled={loading.calibration}
                className={`px-6 py-2 rounded-lg ${
                  loading.calibration
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {loading.calibration ? 'Calibrating...' : 'Run Calibration'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-700">
                Calibration Complete
              </h2>
            </div>

            <p className="text-gray-600 text-center mb-6">
              The stereo calibration process has been completed successfully.
              The system now has the necessary parameters for depth perception.
            </p>

            {calibrationResults && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 overflow-auto max-h-64">
                <h3 className="text-lg font-medium mb-2 text-gray-700">
                  Calibration Results
                </h3>
                <pre className="text-xs text-gray-600">
                  {JSON.stringify(calibrationResults, null, 2)}
                </pre>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={resetCalibration}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Recalibrate
              </button>
              <a
                href="/"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Return Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calibrate;

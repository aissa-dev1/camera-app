import { useRef, useState } from "react";

function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streaming, setStreaming] = useState(false);

  // Function to start the video stream
  const startCamera = async (facingMode: "user" | "environment") => {
    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode }, // Use 'user' for selfie, 'environment' for back camera
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      } catch (error) {
        console.error("Error accessing camera: ", error);
      }
    }
  };

  // Function to capture the image from the video
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Function to save the image
  const saveImage = () => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "captured_image.png";
      link.click();
    }
  };

  return (
    <div>
      <h1>Camera App</h1>
      {!streaming ? (
        <div>
          <button onClick={() => startCamera("user")}>
            Start Selfie Camera
          </button>
          <button onClick={() => startCamera("environment")}>
            Start Back Camera
          </button>
        </div>
      ) : (
        <div>
          <video ref={videoRef} style={{ display: "block", width: "100%" }} />
          <button onClick={captureImage}>Capture Image</button>
          <button onClick={saveImage}>Save Image</button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;

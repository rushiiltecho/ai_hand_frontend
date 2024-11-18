import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Define the type for the data received from the socket
interface VideoFrameData {
  data: string; // Assuming data is a string (base64 encoded image)
}

function App() {
  const [videoFrame, setVideoFrame] = useState<string | null>(null); // Specify the type for state

  useEffect(() => {
    // Connect to the Flask WebSocket server
    const socket = io('http://localhost:5000');  // Flask is running on port 5000

    // Listen for the "video_frame" event and update the video frame
    socket.on("video_frame", (data: VideoFrameData) => {
      setVideoFrame(`data:image/jpeg;base64,${data.data}`);
    });

    // Cleanup socket connection when component is unmounted
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Live Video Stream</h1>
      {videoFrame ? (
        <img
          src={videoFrame}
          alt="Live Video"
          style={{
            width: '640px',  // Adjust width and height as needed
            height: '480px',
            objectFit: 'cover',
          }}
        />
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
}

export default App;
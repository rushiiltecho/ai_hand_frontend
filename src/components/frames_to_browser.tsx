import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Define the type for the data received from the socket
interface VideoFrameData {
  data: string; // Assuming data is a string (base64 encoded image)
}
 // Replace with the correct URL if needed

export function FramesToBrowser() {
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
  
    // Define state to manage the mode and loading status
    const [mode, setMode] = useState(null);
    useEffect(() => {
      const socket = io("http://localhost:5000"); 
      // Listen for `input_transcript` and `ai_output_transcript` events
      socket.on("speaker_mode", (data) => {
          setMode(data.response_from);
      });
  
      // Cleanup function to disconnect the socket on unmount
      return () => {
        console.log(mode)
        // socket.off("speaker_mode");
        socket.disconnect();
      };
    }, []);
  
    // Define gradient styles based on the mode
    const gradientClasses =
      mode === "user"
        ? "from-blue-500 to-green-500"
        : mode === "AI"
        ? "from-purple-500 to-pink-500"
        : "";
    console.log("SPEAKER:" , mode)

  return (
    <div>          <div className="relative group cursor-pointer">
    <div
      className={`absolute -inset-2 bg-gradient-to-r ${gradientClasses} rounded-lg blur  opacity-25 transition duration-1000 animate-pulse-gradient`}
      style={{ opacity: mode === "user" || mode === "AI" ? "1" : "0" }}
    ></div>
    <div className={`relative px-3 py-3 bg-[#111827]/60 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6`}>
      <div className="space-y-2">

      {videoFrame ? (
        <img
          src={videoFrame}
          alt="Live Video"
          style={{
            width: '960px',  // Adjust width and height as needed
            height: '720px',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            width: '960px',
            height: '720px',
            // backgroundColor: 'white',  // White background as a placeholder
            objectFit:'cover'
          }}
          className='rounded-xl backdrop-blur-sm bg-white/55 '
        />
      )}
            </div>
    </div>
  </div>
    </div>
  );
}

export default FramesToBrowser;

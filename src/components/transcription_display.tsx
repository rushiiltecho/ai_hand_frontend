// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';

// // Define the type for the data received from the socket
// interface VideoFrameData {
//   data: string; // Assuming data is a string (base64 encoded image)
// }

// function App() {
//   const [videoFrame, setVideoFrame] = useState<string | null>(null); // Specify the type for state

//   useEffect(() => {
//     // Connect to the Flask WebSocket server
//     const socket = io('http://localhost:5000');  // Flask is running on port 5000

//     // Listen for the "video_frame" event and update the video frame
//     socket.on("video_frame", (data: VideoFrameData) => {
//       setVideoFrame(`data:image/jpeg;base64,${data.data}`);
//     });

//     // Cleanup socket connection when component is unmounted
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h1>Live Video Stream</h1>
//       {videoFrame ? (
//         <img
//           src={videoFrame}
//           alt="Live Video"
//           style={{
//             width: '640px',  // Adjust width and height as needed
//             height: '480px',
//             objectFit: 'cover',
//           }}
//         />
//       ) : (
//         <p>Loading video...</p>
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function Transcription() {
  const [inputTranscript, setInputTranscript] = useState('');
  const [aiOutputTranscript, setAiOutputTranscript] = useState('');

  useEffect(() => {
    // Connect to the WebSocket server
    const socket = io('http://localhost:5000');

    // Listen for input transcriptions
    socket.on('input_transcript', (data) => {
      setInputTranscript(data.text);
    });

    // Listen for AI output transcriptions
    socket.on('ai_output_transcript', (data) => {
      setAiOutputTranscript(data.text);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(aiOutputTranscript)

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Conversation Transcription</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>User Input</h2>
        <div 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            minHeight: '50px', 
            backgroundColor: '#f9f9f9' 
          }}
        >
          {inputTranscript}
        </div>
      </div>

      <div>
        <h2>AI Output</h2>
        <div 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            minHeight: '50px', 
            backgroundColor: '#f9f9f9' 
          }}
        >
          {aiOutputTranscript}
        </div>
      </div>
    </div>
  );
}

export default Transcription;
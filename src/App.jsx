import Transcription from "./components/transcription_display";
import React, { useEffect, useState } from 'react';
import { DynamicVoiceLine } from "./components/dynamic_voice_lines";
import FramesToBrowser from "./components/frames_to_browser";
import io from "socket.io-client";


export function App() {

  const [inputTranscript, setInputTranscript] = useState('');
  const [aiOutputTranscript, setAiOutputTranscript] = useState('');
  const [videoFrame, setVideoFrame] = useState('');
  const [mode, setMode] = useState('');
  const [activeMode, setActiveMode] = useState(false)
  
  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('input_transcript', (data) => {
      setInputTranscript(data.text);
    });

    socket.on('ai_output_transcript', (data) => {
      setAiOutputTranscript(data.text);
    });

    let frameTimeout //: NodeJS.Timeout;

    // Function to clear frame and reset if no frame received
    const resetFrame = () => {
      setVideoFrame(null);
    };

    // Listen for video frame updates
    socket.on('video_frame', (data) => {
      setVideoFrame(`data:image/jpeg;base64,${data.data}`);
      
      // Clear the previous timeout and set a new one (e.g., 1 second)
      clearTimeout(frameTimeout);
      frameTimeout = setTimeout(resetFrame, 1000); // Adjust timeout duration as needed
    });

    // Listen for mode updates
    socket.on('speaker_mode', (data) => {
      setMode(data.response_from);      
    })

    return () => {
      socket.disconnect();
    };
  }, []);


  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      {/* Loading Component */
        console.log(mode)
      }
        <div>
          <FramesToBrowser videoFrame={videoFrame} mode={mode}/>
        </div>
        <div>
          <div className="p-8">
            <Transcription 
              inputTranscript={inputTranscript}
              aiOutputTranscript={aiOutputTranscript}
              activeMode={mode}
            />
          </div>
        </div>
    </div>
  );
}

export default App;
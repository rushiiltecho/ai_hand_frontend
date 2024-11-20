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
  const [audioData, setAudioData] = useState(null)
  
  useEffect(() => {
    const socket = io('http://localhost:5000');
    let modeTimeout;

    socket.on('input_transcript', (data) => {
      setInputTranscript(data.text);
    });

    socket.on('ai_output_transcript', (data) => {
      setAiOutputTranscript(data.text);
    });

    socket.on('audio_output_data', (audio) => {
      setAudioData(audio);
    });

    const resetFrame = () => {
      setVideoFrame(null);
    };

    socket.on('video_frame', (data) => {
      setVideoFrame(`data:image/jpeg;base64,${data.data}`);
      clearTimeout(modeTimeout);
      modeTimeout = setTimeout(resetFrame, 1000); // Adjust timeout duration as needed
    });

    // Handle speaker mode updates
    socket.on('speaker_mode', (data) => {
      setMode(data.response_from);

      // Reset the timeout each time we receive a `speaker_mode`
      clearTimeout(modeTimeout);
      modeTimeout = setTimeout(() => {
        setMode("");
      }, 1000); // Set mode to "loading" if no update within 2 seconds
    });

    return () => {
      socket.disconnect();
      clearTimeout(modeTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      {/* Loading Component */
        // console.log("AUDIO_DATA:",audioData)
        // console.log(mode)
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
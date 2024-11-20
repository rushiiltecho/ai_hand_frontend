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
  const [chatHistory, setChatHistory] = useState([]); // Stores finalized messages
  const [tempUserMessage, setTempUserMessage] = useState(''); // Temporary user message
  const [tempAiMessage, setTempAiMessage] = useState(''); // Temporary AI message
  const [audioData, setAudioData] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    let modeTimeout;
    let userTypingTimeout;
    let aiTypingTimeout;

    socket.on('input_transcript', (data) => {
      setInputTranscript(data.text);
      setTempUserMessage(data.text);

      // Clear existing timeout and set a new one to detect when the user is done speaking
      clearTimeout(userTypingTimeout);
      userTypingTimeout = setTimeout(() => {
        setChatHistory(prevHistory => [
          ...prevHistory,
          { sender: 'user', text: data.text.trim() }
        ]);
        setTempUserMessage(''); // Clear temporary state
      }, 500); // Adjust timeout for user input finalization
    });

    socket.on('ai_output_transcript', (data) => {
      setAiOutputTranscript(data.text);
      setTempAiMessage(data.text);

      // Clear existing timeout and set a new one to detect when AI is done responding
      clearTimeout(aiTypingTimeout);
      aiTypingTimeout = setTimeout(() => {
        setChatHistory(prevHistory => [
          ...prevHistory,
          { sender: 'ai', text: data.text.trim() }
        ]);
        setTempAiMessage(''); // Clear temporary state
      }, 500); // Adjust timeout for AI response finalization
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

    socket.on('speaker_mode', (data) => {
      setMode(data.response_from);
      clearTimeout(modeTimeout);
      modeTimeout = setTimeout(() => {
        setMode("");
      }, 1000);
    });

    return () => {
      socket.disconnect();
      clearTimeout(modeTimeout);
      clearTimeout(userTypingTimeout);
      clearTimeout(aiTypingTimeout);
    };
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div>
          <DynamicVoiceLine activeMode={mode}/>
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
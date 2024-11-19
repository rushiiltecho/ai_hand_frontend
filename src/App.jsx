import Transcription from "./components/transcription_display";
import React, { useEffect, useState } from 'react';
import { DynamicVoiceLine } from "./components/dynamic_voice_lines";
import FramesToBrowser from "./components/frames_to_browser";
import io from "socket.io-client";

const socket = io("http://localhost:5000");  // Replace with the correct URL if needed

export function App() {
  // Define state to manage the mode and loading status
  const [mode, setMode] = useState("loading");
  useEffect(() => {
    // Listen for `input_transcript` and `ai_output_transcript` events
    socket.on("speaker_mode", (data) => {
        console.log(data.response_from)
        setMode(data.response_from);
    });

    // Cleanup function to disconnect the socket on unmount
    return () => {
      console.log(mode)
      socket.off("speaker_mode");
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

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      {/* Loading Component */}
        <div>
          <div className="relative group cursor-pointer">
            <div
              className={`absolute -inset-2 bg-gradient-to-r ${gradientClasses} rounded-lg blur  opacity-25 transition duration-1000 animate-pulse-gradient`}
              style={{ opacity: mode === "user" || mode === "AI" ? "1" : "0" }}
            ></div>
            <div className={`relative px-3 py-3 bg-[#111827]/60 ring-1 ring-gray-900/5 rounded-lg leading-none flex items-top justify-start space-x-6`}>
              <div className="space-y-2">
                <FramesToBrowser />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="p-8">
            <Transcription/>
          </div>
        </div>
    </div>
  );
}

export default App;
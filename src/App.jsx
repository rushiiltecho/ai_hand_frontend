import Transcription from "./components/transcription_display";
import React, { useEffect, useState } from 'react';
import { DynamicVoiceLine } from "./components/dynamic_voice_lines";
import FramesToBrowser from "./components/frames_to_browser";
import io from "socket.io-client";


export function App() {

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      {/* Loading Component */}
        <div>
          <FramesToBrowser />
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
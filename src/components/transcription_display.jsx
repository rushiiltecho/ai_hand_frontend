import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown';

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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>User Input:</h2>
        <div 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            minHeight: '50px', 
            backgroundColor: 'transparent' 
          }}
        >
          {inputTranscript}
        </div>
      </div>

      <div>
        <h2>AI Output:</h2>
        <div 
          style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            minHeight: '50px', 
            backgroundColor: 'transparent' 
          }}
        >
          {/* Render the AI output as Markdown */}
          <ReactMarkdown>{aiOutputTranscript}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export default Transcription;

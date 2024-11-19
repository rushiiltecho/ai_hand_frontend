import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { Mic, X, Send, Pause } from 'lucide-react';

// Types
// type MessageRole = 'user' | 'assistant';
// type ConnectionStatus = 'disconnected' | 'connected' | 'error';

// interface Message {
//   role: MessageRole;
//   content: string;
// }

const VoiceTextInput = () => {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  
  const websocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection setup
  const connectWebSocket = () => {
    const wsUrl = getWebSocketUrl();
    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      setConnectionStatus('connected');
    };

    websocketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'text':
            setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
            break;
          case 'error':
            console.error('Server error:', data.message);
            break;
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };

    websocketRef.current.onclose = () => {
      setConnectionStatus('disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    websocketRef.current.onerror = () => {
      setConnectionStatus('error');
    };
  };

  // Determine WebSocket URL based on environment
  const getWebSocketUrl = () => {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    return isLocalhost 
      ? 'ws://localhost:5000'
      : `ws://${window.location.hostname}:5000`;
  };

  // Connect to WebSocket on component mount
  useEffect(() => {
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      websocketRef.current?.close();
    };
  }, []);

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];

        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          const reader = new FileReader();
          reader.onload = () => {
            websocketRef.current?.send(JSON.stringify({
              type: 'audio',
              bytes: Array.from(new Uint8Array(reader.result))
            }));
          };

          reader.readAsArrayBuffer(audioBlob);
        }
      };

      mediaRecorderRef.current.start(250);
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Toggle recording state
  const toggleRecording = () => {
    isRecording ? stopRecording() : startRecording();
  };

  // Send text message
  const handleSend = () => {
    if (inputText.trim() && websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'text',
        text: inputText
      }));
      setMessages(prev => [...prev, { role: 'user', content: inputText }]);
      setInputText('');
    }
  };

  // Handle keyboard events in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-100 self-end text-right' 
                : 'bg-gray-100 self-start text-left'
            }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className="p-4 border-t flex items-center space-x-2">
        {/* Voice/Text Toggle */}
        <button 
          onClick={() => setIsVoiceMode(!isVoiceMode)}
          className="p-2 bg-gray-200 rounded-full"
        >
          {isVoiceMode ? <X /> : <Mic />}
        </button>

        {isVoiceMode ? (
          // Voice Recording Mode
          <button 
            onClick={toggleRecording}
            className={`flex-grow p-3 rounded-lg ${
              isRecording ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        ) : (
          // Text Input Mode
          <div className="flex-grow flex items-center space-x-2">
            <textarea 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow p-2 border rounded-lg resize-none"
              rows={1}
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-blue-500 text-white rounded-full"
            >
              <Send size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="text-center text-sm text-gray-500 p-2">
        Connection Status: {connectionStatus}
      </div> </div>
  );
};

export default VoiceTextInput;
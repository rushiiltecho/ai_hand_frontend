// ./components/chat_history.jsx
import React, { useEffect, useRef } from 'react';

const ChatHistory = ({ chatHistory, tempUserMessage, tempAiMessage }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, tempUserMessage, tempAiMessage]);

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto">
      {chatHistory.map((message, index) => (
        <div 
          key={index} 
          className={`flex mb-4 ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
        >
          <div 
            className={`max-w-xs px-4 py-2 rounded-lg ${
              message.sender === 'ai' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {message.text}
          </div>
        </div>
      ))}

      {/* Display temporary user message */}
      {tempUserMessage && (
        <div className="flex justify-end mb-4">
          <div className="max-w-xs px-4 py-2 rounded-lg bg-green-400 text-white">
            {tempUserMessage}
          </div>
        </div>
      )}

      {/* Display temporary AI message */}
      {tempAiMessage && (
        <div className="flex justify-start mb-4">
          <div className="max-w-xs px-4 py-2 rounded-lg bg-blue-400 text-white">
            {tempAiMessage}
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatHistory;

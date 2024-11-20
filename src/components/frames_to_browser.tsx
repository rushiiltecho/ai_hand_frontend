import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

interface VideoFrameData {
  data: string; // Assuming data is a string (base64 encoded image)
}

export function FramesToBrowser( {videoFrame , mode}: {videoFrame: string | null , mode: string | null}) {

  const gradientClasses =
    mode === 'user'
      ? 'from-blue-500 to-green-500'
      : mode === 'AI'
      ? 'from-purple-500 to-pink-500'
      : '';

  return (
    <div>
      <div className="relative group cursor-pointer">
        <div
          className={`absolute -inset-2 bg-gradient-to-r ${gradientClasses} rounded-[1.75rem] blur opacity-25 transition duration-1000 animate-pulse-gradient`}
          style={{ opacity: mode === 'user' || mode === 'AI' ? '1' : '0' }}
        ></div>
        <div className="relative px-4 py-4 bg-[#111827]/60 ring-1 ring-gray-900/5 rounded-[2.9rem] leading-none flex items-top justify-start space-x-6">
          <div className="space-y-2">
            {videoFrame ? (
              <img
                src={videoFrame}
                alt="Live Video"
                style={{
                  width: '800px',
                  height: '600px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '800px',
                  height: '600px',
                  objectFit: 'cover',
                }}
                className="rounded-[2rem] backdrop-blur-sm bg-white/55"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FramesToBrowser;

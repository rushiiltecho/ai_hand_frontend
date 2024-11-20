import React, { useEffect, useRef } from 'react';
import io , { Socket } from 'socket.io-client';

interface VideoFrameData {
  data: string; // Assuming data is a string (base64 encoded image)
}

export const FramesToBrowser = ({mode, videoRef}:{mode:string | null, videoRef: any}) => {
  // const videoRef = useRef<HTMLImageElement>(null);

  // useEffect(() => {
  //   // Initialize the Socket.IO client
  //   const socket: Socket = io('http://localhost:5000', {
  //     transports: ['websocket'],
  //   });

  //   // Listen for the 'video_frame' event
  //   socket.on('video_frame', (data: ArrayBuffer) => {
  //     // Create a Blob from the binary data
  //     const blob = new Blob([data], { type: 'image/jpeg' });

  //     // Create a URL for the Blob and set it  as the source of an <img> element
  //     const url = URL.createObjectURL(blob);

  //     if (videoRef.current) {
  //       videoRef.current.src = url;
  //     }
  //   });

  //   // Cleanup the socket connection on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const gradientClasses =
    mode === 'user'
      ? 'from-blue-500 to-green-500'
      : mode === 'AI'
      ? 'from-purple-500 to-pink-500'
      : '';
  console.log(videoRef)

  return (
    <div>
      <div className="relative group cursor-pointer">
        <div
          className={`absolute -inset-2 bg-gradient-to-r ${gradientClasses} rounded-[2.9rem] blur opacity-25 transition duration-1000 animate-pulse-gradient`}
          style={{ opacity: mode === 'user' || mode === 'AI' ? '1' : '0' }}
        ></div>
        <div className="relative px-4 py-4 bg-[#111827]/60 ring-1 ring-gray-900/5 rounded-[2.9rem] leading-none flex items-top justify-start space-x-6">
          <div className="space-y-2">
            {videoRef ? (
              <img
                ref={videoRef}
                alt="Live Video"
                style={{
                  width: '800px',
                  height: '600px',
                  objectFit: 'cover',
                }}
                className="rounded-[2rem] backdrop-blur-sm bg-white/55"

              />
            ) : (
              <div
                style={{
                  width: '800px',
                  height: '600px',
                  objectFit: 'cover',
                }}
                className="rounded-[2rem] backdrop-blur-sm bg-white/55 justify-center text-center"
              >
                {/* <h1>Please WAIT</h1> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default FramesToBrowser;

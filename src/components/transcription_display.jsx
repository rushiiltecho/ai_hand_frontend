/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import styled from '@emotion/styled';

// Use styled components minimally, applying Tailwind classes directly in JSX
const Container = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export function Transcription({inputTranscript , aiOutputTranscript}) {

  return (
    <Container className="flex flex-col gap-6 font-sans">
      {/* <TranscriptBlock title="User Input" content={inputTranscript} /> */}
      <TranscriptBlock title="AI Output">
        <ReactMarkdown>{aiOutputTranscript}</ReactMarkdown>
      </TranscriptBlock>
    </Container>
  );
}

export const TranscriptBlock = ({ title, content, children }) => (
  <div className="p-4 rounded-lg shadow-md border border-white/20 backdrop-blur-lg bg-white/10">
    <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
    <div className="text-white text-base leading-relaxed min-h-[50px]">
      {content || children}
    </div>
  </div>
);

export default Transcription;

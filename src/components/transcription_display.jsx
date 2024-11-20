/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import styled from '@emotion/styled';
import { DynamicVoiceLine } from './dynamic_voice_lines';

const Container = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
`;

// Transcription Component with DynamicVoiceLine as Background
export function Transcription({ inputTranscript, aiOutputTranscript, activeMode }) {
  return (
    <Container className="flex flex-col gap-6 font-sans">
      {/* Background animation layer */}
      <DynamicVoiceLine activeMode={activeMode} />

      {/* Glassmorphic Transcript Blocks */}
      {/* <TranscriptBlock title="User Input" content={inputTranscript} /> */}
      <TranscriptBlock title="AI Output">
        <ReactMarkdown>{aiOutputTranscript}</ReactMarkdown>
      </TranscriptBlock>
    </Container>
  );
}

// TranscriptBlock Component with Glassmorphism
export const TranscriptBlock = ({ title, content, children }) => (
  <div className="p-4 rounded-lg shadow-lg border border-white/20 backdrop-blur-lg bg-white/5">
    <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
    <div className="text-white text-base leading-relaxed min-h-[50px]">
      {content || children}
    </div>
  </div>
);

export default Transcription;

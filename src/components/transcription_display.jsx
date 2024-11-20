/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import ReactMarkdown from 'react-markdown';
import styled from '@emotion/styled';

// Styled container using Emotion and Tailwind
const Container = styled.div`
  @apply max-w-xl mx-auto p-6 flex flex-col gap-6 font-sans;
`;

// Styled component for each transcript block
const TranscriptBlockContainer = styled.div`
  @apply bg-gray-100 p-4 rounded-lg shadow-md;
`;

// Title styling for each transcript block
const Title = styled.h2`
  @apply text-lg font-semibold text-gray-700 mb-2;
`;

// Content styling for the text inside each block
const Content = styled.div`
  @apply text-gray-600 text-base leading-relaxed min-h-[50px];
`;

function Transcription() {
  const [inputTranscript, setInputTranscript] = useState('');
  const [aiOutputTranscript, setAiOutputTranscript] = useState('');

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('input_transcript', (data) => {
      setInputTranscript(data.text);
    });

    socket.on('ai_output_transcript', (data) => {
      setAiOutputTranscript(data.text);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container>
      <TranscriptBlock title="User Input" content={inputTranscript} />
      <TranscriptBlock title="AI Output">
        <ReactMarkdown>{aiOutputTranscript}</ReactMarkdown>
      </TranscriptBlock>
    </Container>
  );
}

// Reusable TranscriptBlock component with Emotion and Tailwind
const TranscriptBlock = ({ title, content, children }) => (
  <TranscriptBlockContainer>
    <Title>{title}</Title>
    <Content>{content || children}</Content>
  </TranscriptBlockContainer>
);

export default Transcription;

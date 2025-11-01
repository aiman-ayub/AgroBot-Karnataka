
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';

// Fix: Add comprehensive type definitions for the non-standard Web Speech API.
// This resolves errors related to missing properties on `window` and provides
// strong types for the SpeechRecognition instances and events.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}


interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: (lang: Language) => void;
  stopListening: () => void;
  setTranscript: React.Dispatch<React.SetStateAction<string>>;
  isSupported: boolean;
}

const getSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
        return window.SpeechRecognition || window.webkitSpeechRecognition;
    }
    return null;
}

// Fix: Rename constant to avoid conflict with the `SpeechRecognition` interface type.
const SpeechRecognitionAPI = getSpeechRecognition();


export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // Fix: With type definitions and renamed constant, this type is now correctly resolved.
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const isSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSupported) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [isSupported]);

  const startListening = (lang: Language) => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.lang = lang;
      setTranscript(''); // Clear previous transcript
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return { isListening, transcript, startListening, stopListening, setTranscript, isSupported };
};

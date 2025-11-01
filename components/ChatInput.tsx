import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface ChatInputProps {
  onSendMessage: (text: string, image?: File) => void;
  isLoading: boolean;
  language: Language;
}

const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14a2 2 0 0 1-2-2V6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2Zm-2-6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V6Zm8 5a1 1 0 0 1-2 0V9a5 5 0 0 0-10 0v2a1 1 0 1 1-2 0V9a7 7 0 0 1 14 0v2ZM6 19a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Z"/>
    </svg>
);

const StopIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd"/>
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/>
    </svg>
);

const PaperClipIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-8.609 8.609a4.5 4.5 0 0 0 6.364 6.364l7.07-7.07a3 3 0 0 0-4.242-4.242l-5.657 5.657a1.5 1.5 0 1 0 2.121 2.121l4.243-4.242a.75.75 0 0 1 1.06 1.06l-4.243 4.242a3 3 0 1 1-4.242-4.242l5.657-5.657a4.5 4.5 0 0 1 6.364 6.364l-7.07 7.07a6 6 0 0 1-8.485-8.485l8.609-8.609a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
);


export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, language }) => {
  const [text, setText] = useState('');
  const { isListening, transcript, startListening, stopListening, setTranscript, isSupported } = useSpeechRecognition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    return () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };
  }, [previewUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || selectedFile) && !isLoading) {
      onSendMessage(text, selectedFile ?? undefined);
      setText('');
      setTranscript('');
      setSelectedFile(null);
      setPreviewUrl(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleVoiceClick = () => {
      if (isListening) {
          stopListening();
      } else {
          startListening(language);
      }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
          }
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleAttachClick = () => {
      fileInputRef.current?.click();
  };

  const removeAttachment = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        {previewUrl && (
            <div className="relative inline-block mb-2 ml-12">
                <img src={previewUrl} alt="Selected preview" className="h-20 w-20 object-cover rounded-lg"/>
                <button onClick={removeAttachment} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center text-xs">
                    &#x2715;
                </button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <button type="button" onClick={handleAttachClick} className="p-3 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 transition-colors">
                <PaperClipIcon className="w-6 h-6" />
            </button>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                disabled={isLoading}
            />
            {isSupported && (
                <button type="button" onClick={handleVoiceClick} className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                {isListening ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                </button>
            )}
            <button type="submit" disabled={isLoading || (!text.trim() && !selectedFile)} className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800 disabled:cursor-not-allowed transition-colors">
                <SendIcon className="w-6 h-6" />
            </button>
        </form>
    </div>
  );
};

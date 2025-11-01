import React from 'react';
import { Message as MessageType, Sender } from '../types';

interface MessageProps {
  message: MessageType;
}

// Simple markdown image parser
const renderMessageContent = (text: string) => {
    const parts = text.split(/(!\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
        const match = part.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
            const [, alt, src] = match;
            return <img key={index} src={src} alt={alt} className="rounded-lg my-2 max-w-full h-auto" />;
        }
        // Replace newlines with <br> tags for rendering
        return part.split('\n').map((line, i) => (
            <React.Fragment key={`${index}-${i}`}>
                {line}
                {i < part.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));
    });
};

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.User;

  const bubbleClasses = isUser
    ? 'bg-green-600 text-white self-end rounded-tl-xl rounded-tr-xl rounded-bl-xl'
    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-tr-xl rounded-tl-xl rounded-br-xl';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses} mb-4`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 shadow ${bubbleClasses}`}>
        {isUser && message.imageUrl && (
            <img src={message.imageUrl} alt="User upload" className="rounded-lg mb-2 max-w-full h-auto" />
        )}
        <p className="text-sm">{renderMessageContent(message.text)}</p>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Message as MessageType, Sender, Language } from './types';
import { getAgriBotResponse } from './services/geminiService';
import { INITIAL_MESSAGES, MENU_OPTIONS, CALL_TO_ACTION_MESSAGES, WELCOME_SCREEN_TEXTS } from './constants';
import { Message } from './components/Message';
import { ChatInput } from './components/ChatInput';
import { MenuOptions } from './components/MenuOptions';

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591" />
    </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
);

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            resolve(result);
        };
        reader.onerror = (error) => reject(error);
    });
};

interface WelcomeScreenProps {
  onStartChat: () => void;
  onFaqClick: (query: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

// Helper component to render text with <strong> and <br> tags safely
const MarkupRenderer: React.FC<{ text: string }> = ({ text }) => {
    const segments = text.split(/(<br\s*\/?>)/g); // Split by <br /> tag, keeping the delimiter
    return (
        <>
            {segments.map((segment, index) => {
                if (segment.match(/<br\s*\/?>/)) {
                    return <br key={index} />;
                }
                const parts = segment.split(/<strong>(.*?)<\/strong>/g);
                return (
                    <React.Fragment key={index}>
                        {parts.map((part, i) =>
                            i % 2 === 1 
                            ? <strong key={i} className="font-semibold text-green-700 dark:text-green-400">{part}</strong> 
                            : part
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat, onFaqClick, language, setLanguage }) => {
  const texts = WELCOME_SCREEN_TEXTS[language];
  
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl text-center">
            <div className='flex justify-center items-center space-x-4 mb-6' title={texts.langTooltip}>
                <button 
                    onClick={() => setLanguage(Language.EN)} 
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${language === Language.EN ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                    English
                </button>
                 <button 
                    onClick={() => setLanguage(Language.KN)} 
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${language === Language.KN ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                    ಕನ್ನಡ
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <img 
                    src="https://businessinspection.com.bd/wp-content/uploads/2022/08/Top-Agro-Based-Company-1.jpg" 
                    alt="Agro-based industries banner" 
                    className="w-full h-48 sm:h-56 object-cover"
                />
                
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        {texts.title}
                    </h2>
                    <p className="text-md text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed">
                        <MarkupRenderer text={texts.info} />
                    </p>
                    <button
                        onClick={onStartChat}
                        title={texts.buttonTooltip}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 duration-300 ease-in-out shadow-lg hover:shadow-xl text-lg animate-pulse"
                    >
                        {texts.button}
                    </button>
                     <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
                        {texts.faqLinks.map(link => (
                            <button 
                                key={link.text} 
                                onClick={() => onFaqClick(link.query)} 
                                className="bg-green-100 dark:bg-gray-700 text-green-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-xs hover:bg-green-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                            >
                                {link.icon && <span className="text-sm">{link.icon}</span>}
                                {link.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};


function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const resetChat = (lang: Language) => {
    setShowMenu(true);
    setMessages([
      {
        id: 'initial',
        text: INITIAL_MESSAGES[lang],
        sender: Sender.Bot,
      }
    ]);
  };
  
  useEffect(() => {
    if (hasStarted) {
        resetChat(language);
    }
  }, [language, hasStarted]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string, imageFile?: File) => {
    console.log('Analytics: User action:', text); // For optional analytics
    if (showMenu) {
        setShowMenu(false);
    }
    
    let imageUrl: string | undefined = undefined;
    if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: Sender.User,
      imageUrl,
    };
    
    // Use a function for setting messages to get the latest state
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    let imagePayload: { data: string; mimeType: string } | undefined = undefined;
    if (imageFile) {
        try {
            const base64Data = await fileToBase64(imageFile);
            imagePayload = { data: base64Data, mimeType: imageFile.type };
        } catch (error) {
            console.error("Error converting file to base64:", error);
            const errorMessage: MessageType = {
              id: (Date.now() + 1).toString(),
              text: "Sorry, there was an error processing your image. Please try another one.",
              sender: Sender.Bot,
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }
    }

    try {
      // Pass the previous messages state to the API call, excluding the new user message
      const historyWithoutCurrentUserMessage = messages;
      const botResponseText = await getAgriBotResponse(text, historyWithoutCurrentUserMessage, imagePayload);
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: Sender.Bot,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: Sender.Bot,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      if (imageUrl) {
        // Clean up the object URL to avoid memory leaks
        URL.revokeObjectURL(imageUrl);
      }
    }
  };
  
  const handleLanguageToggle = () => {
      setLanguage(prev => prev === Language.EN ? Language.KN : Language.EN);
  };

  const handleFaqClick = (query: string) => {
    setHasStarted(true);
    // Use a timeout to ensure the chat UI is rendered before sending the message
    setTimeout(() => {
        handleSendMessage(query);
    }, 100);
  };


  return (
    <div className="flex flex-col h-screen font-sans bg-green-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-green-700 dark:text-green-400">AgroBot 🌾</h1>
        <div className="flex items-center space-x-4">
            {hasStarted && (
              <button onClick={handleLanguageToggle} className="text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  {language === Language.EN ? 'ಕನ್ನಡ' : 'English'}
              </button>
            )}
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
        </div>
      </header>
      
      {!hasStarted ? (
        <WelcomeScreen 
          onStartChat={() => setHasStarted(true)} 
          language={language}
          setLanguage={setLanguage}
          onFaqClick={handleFaqClick}
        />
      ) : (
        <>
          <main className="flex-grow p-4 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
                {messages.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}
                {showMenu && (
                    <>
                        <MenuOptions options={MENU_OPTIONS[language]} onOptionClick={handleSendMessage} />
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 p-2">
                            {CALL_TO_ACTION_MESSAGES[language]}
                        </p>
                    </>
                )}
                {isLoading && (
                  <div className="flex justify-start mb-4">
                    <div className="p-3 shadow rounded-tr-xl rounded-tl-xl rounded-br-xl bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
            </div>
          </main>

          <footer className="sticky bottom-0">
            <div className="max-w-3xl mx-auto">
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} language={language} />
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;

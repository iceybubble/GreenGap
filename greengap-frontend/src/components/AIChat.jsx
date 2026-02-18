import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AIChat.css";

export default function AIChat({ language = 'en', apiUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Use provided apiUrl or fallback
  const API_URL = apiUrl || import.meta.env.VITE_API_URL || "https://greengap-backend.onrender.com";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: getWelcomeMessage(language),
        },
      ]);
    }
  }, [isOpen, language]);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
    };
  }, []);

  const getWelcomeMessage = (lang) => {
    const welcomes = {
      en: "👋 Hi! I'm your AI sustainability assistant powered by Google Gemini and Pathway RAG. Ask me anything about reducing your carbon footprint, preventing rebound effects, or improving energy efficiency!",
      es: "👋 ¡Hola! Soy tu asistente de sostenibilidad impulsado por IA. ¡Pregúntame cualquier cosa sobre reducir tu huella de carbono!",
      fr: "👋 Bonjour! Je suis votre assistant de durabilité alimenté par l'IA. Posez-moi des questions sur la réduction de votre empreinte carbone!",
      de: "👋 Hallo! Ich bin Ihr KI-gestützter Nachhaltigkeitsassistent. Fragen Sie mich alles über die Reduzierung Ihres CO₂-Fußabdrucks!",
      zh: "👋 你好！我是您的人工智能可持续发展助手。询问我有关减少碳足迹的��何问题！",
      hi: "👋 नमस्ते! मैं आपका AI स्थिरता सहायक हूं। मुझसे कार्बन फुटप्रिंट कम करने के बारे में कुछ भी पूछें!",
      ar: "👋 مرحبا! أنا مساعد الاستدامة الخاص بك المدعوم بالذكاء الاصطناعي. اسألني أي شيء عن تقليل بصمتك الكربونية!",
      pt: "👋 Olá! Sou seu assistente de sustentabilidade alimentado por IA. Pergunte-me qualquer coisa sobre reduzir sua pegada de carbono!",
    };
    return welcomes[lang] || welcomes.en;
  };

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      console.log('Sending message to:', `${API_URL}/chat`);
      console.log('Message:', textToSend);
      console.log('Language:', language);
      
      const response = await axios.post(
        `${API_URL}/chat`,
        {
          message: textToSend,
          language: language,
        },
        {
          timeout: 60000, // 60 second timeout
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response received:', response.data);

      // Handle backend response format (answer field)
const aiResponse = response.data.answer || response.data.response || response.data.text || "I received your message but couldn't generate a response.";

const assistantMessage = {
  role: "assistant",
  content: aiResponse,
};
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        response: error.response,
      });
      
      let errorMsg = " Sorry, I encountered an error. ";
      
      if (error.code === 'ECONNABORTED') {
        errorMsg += "Request timed out. The backend might be sleeping (Render free tier). Please wait 30 seconds and try again.";
      } else if (error.response?.status === 504) {
        errorMsg += "The server is waking up from sleep. Please wait 30-60 seconds and try again.";
      } else if (error.response?.status === 500) {
        errorMsg += "Backend server error. The AI service might be initializing.";
      } else if (error.response?.status === 502 || error.response?.status === 503) {
        errorMsg += "Backend is temporarily unavailable. It's likely waking up from sleep. Please try again in 1 minute.";
      } else if (error.message === 'Network Error') {
        errorMsg += "Cannot connect to backend. Please check if the backend is running at: " + API_URL;
      } else if (error.response?.data?.detail) {
        errorMsg += error.response.data.detail;
      } else {
        errorMsg += "Please try again in a moment.";
      }
      
      const errorMessage = {
        role: "assistant",
        content: errorMsg,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceRecognition = () => {
  // Check browser support
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
    return;
  }

  // If already listening, stop the current recognition
  if (isListening && recognitionRef.current) {
    try {
      recognitionRef.current.abort();
      setIsListening(false);
      recognitionRef.current = null;
    } catch (e) {
      console.warn('Error aborting recognition:', e);
    }
    return;
  }

  // Stop any existing recognition before starting new one
  if (recognitionRef.current) {
    try {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    } catch (e) {
      // Ignore abort errors
    }
    // Wait a bit before starting new recognition
    setTimeout(() => {
      startNewRecognition();
    }, 100);
    return;
  }

  startNewRecognition();
};

const startNewRecognition = () => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    const languageCodes = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      zh: 'zh-CN',
      hi: 'hi-IN',
      ar: 'ar-SA',
      pt: 'pt-BR',
    };

    recognition.lang = languageCodes[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      setInputValue(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        // Don't alert, just log
        console.warn('No speech detected');
      } else if (event.error === 'network') {
        // Network errors during speech recognition are not critical
        console.warn('Network error during speech recognition - this is usually harmless');
      } else if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else if (event.error !== 'aborted') {
        console.warn(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
      recognitionRef.current = null;
      alert('Failed to start voice recognition. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={`floating-chat-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI chat assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="8" cy="10" r="1.5"/>
            <circle cx="12" cy="10" r="1.5"/>
            <circle cx="16" cy="10" r="1.5"/>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-content">
              <span className="chat-icon">🤖</span>
              <div>
                <h3>AI Assistant</h3>
                <p className="chat-status">
                  <span className="status-dot"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="close-chat-btn"
              aria-label="Close chat"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === "user" ? "user-message" : "assistant-message"}`}
              >
                <div className="message-content">{msg.content}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message assistant-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-footer">
            <p className="chat-info">Powered by Pathway AI + Gemini 2.5</p>
          </div>

          <div className="chat-input-container">
            <button
              className={`voice-btn ${isListening ? "listening" : ""}`}
              onClick={startVoiceRecognition}
              title={`Voice input (${language.toUpperCase()})`}
              aria-label="Start voice input"
            >
              {isListening ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </button>
            <input
              type="text"
              className="chat-input"
              placeholder="Ask about sustainability..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
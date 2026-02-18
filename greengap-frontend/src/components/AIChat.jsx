import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AIChat.css";

export default function AIChat({ language = 'en' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Map language codes to speech recognition locales
      const langMap = {
        'en': 'en-US',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'zh': 'zh-CN',
        'hi': 'hi-IN',
        'ar': 'ar-SA',
        'pt': 'pt-BR'
      };
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = langMap[language] || 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access in your browser settings.');
        }
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: textToSend,
        language: language
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.data.answer,
        powered_by: response.data.powered_by
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Sorry, I'm having trouble connecting. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "How do I prevent rebound effects?",
    "What is peak hour optimization?",
    "How can I improve behavior scores?",
    "Tell me about carbon reduction"
  ];

  return (
    <>
      {/* Chat Button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI chat"
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-content">
              <span className="chat-title">🤖 AI Assistant</span>
              <span className="chat-status">● Online</span>
            </div>
            <button 
              className="close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>👋 Hi! I'm your sustainability AI assistant.</p>
                <p>Try these quick questions:</p>
                <div className="quick-questions">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="quick-question-btn"
                      onClick={() => sendMessage(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                  {msg.powered_by && (
                    <div className="message-footer">
                      <small>🔋 {msg.powered_by}</small>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Ask about sustainability..."
              disabled={loading}
            />
            <button 
              onClick={toggleVoiceInput}
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              disabled={loading}
              aria-label="Voice input"
              title={isListening ? "Listening..." : "Click to speak"}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
            <button 
              onClick={() => sendMessage()} 
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              {loading ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
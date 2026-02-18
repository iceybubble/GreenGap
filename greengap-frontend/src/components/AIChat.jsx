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

  const getWelcomeMessage = (lang) => {
    const welcomes = {
      en: " Hi! I'm your AI sustainability assistant powered by Google Gemini and Pathway RAG. Ask me anything about reducing your carbon footprint, preventing rebound effects, or improving energy efficiency!",
      es: " ¡Hola! Soy tu asistente de sostenibilidad impulsado por IA. ¡Pregúntame cualquier cosa sobre reducir tu huella de carbono!",
      fr: " Bonjour! Je suis votre assistant de durabilité alimenté par l'IA. Posez-moi des questions sur la réduction de votre empreinte carbone!",
      de: " Hallo! Ich bin Ihr KI-gestützter Nachhaltigkeitsassistent. Fragen Sie mich alles über die Reduzierung Ihres CO₂-Fußabdrucks!",
      zh: " 你好！我是您的人工智能可持续发展助手。询问我有关减少碳足迹的任何问题！",
      hi: " नमस्���े! मैं आपका AI स्थिरता सहायक हूं। मुझसे कार्बन फुटप्रिंट कम करने के बारे में कुछ भी पूछें!",
      ar: " مرحبا! أنا مساعد الاستدامة الخاص بك المدعوم بالذكاء الاصطناعي. اسألني أي شيء عن تقليل بصمتك الكربونية!",
      pt: " Olá! Sou seu assistente de sustentabilidade alimentado por IA. Pergunte-me qualquer coisa sobre reduzir sua pegada de carbono!",
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
      const response = await axios.post(`${API_URL}/chat`, {
        message: textToSend,
        language: language,
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: ` Sorry, I encountered an error connecting to the backend. ${
          error.response?.status === 504 ? 
          "The server might be waking up (free tier sleep). Please try again in 30 seconds." : 
          "Please try again."
        }`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

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

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
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
        {isOpen ? "✖" : "🤖"}
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
            <button onClick={() => setIsOpen(false)} className="close-chat-btn">
              ✖
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
              🎤
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
              📤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
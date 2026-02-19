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
      zh: "👋 你好！我是您的人工智能可持续发展助手。询问我有关减少碳足迹的任何问题！",
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
      
      // MOCK RESPONSES FOR DEMO MODE
      const mockResponses = {
        "rebound": " DEMO MODE: The rebound effect (Jevons Paradox) occurs when efficiency improvements lead to increased consumption. For example, after installing LED lights, people may leave them on 30-80% longer because the cost per hour is lower.\n\nTo prevent this:\n1) Use automated scheduling and timers\n2) Set usage caps with smart plugs\n3) Implement real-time monitoring\n4) Launch behavioral awareness campaigns\n\nIn production, this response would be powered by Pathway RAG (10 sustainability documents) + Google Gemini 2.5 for personalized, context-aware recommendations.",
        
        "energy": " DEMO MODE: To save energy effectively:\n\n1) Install smart thermostats (10-23% heating savings)\n2) Use LED lights with motion sensors\n3) Optimize HVAC with quarterly maintenance\n4) Shift consumption to off-peak hours (25-45% cost reduction)\n5) Conduct professional energy audits ($300-500) to identify 15-30% additional savings\n\nIn production, this would analyze YOUR specific usage patterns using AI to provide personalized recommendations.",
        
        "solar": " DEMO MODE: Solar panels provide 40-60% carbon footprint reduction with 5-7 year ROI including federal incentives.\n\nConsiderations:\n• Roof orientation (south-facing optimal)\n• Shading analysis\n• Local utility rates and net metering policies\n• Battery storage for maximum benefit\n\nIn production, I would calculate exact ROI based on your location, energy usage, and local incentives using real-time data.",
        
        "calculate": " DEMO MODE: Expected emissions calculation:\n\nBaseline Consumption × Efficiency Improvement Rate\nExample: 450 kWh baseline × 30% efficiency = 315 kWh expected\n\nHowever, rebound effects increase actual consumption to 375 kWh, creating a 'gap' of 60 kWh (hidden climate loss).\n\nRebound % = (375 - 315) / (450 - 315) × 100 = 44%\n\nIn production, this would use YOUR actual meter data for precise calculations.",
        
        "hello": " DEMO MODE: Hello! I'm GreenGap's AI assistant. In production, I'm powered by:\n\n• Pathway RAG (10 sustainability documents)\n• Google Gemini 2.5 Flash\n• Real-time behavioral analysis\n• Multi-language support (8 languages)\n\nCurrently showing demo responses because the backend is sleeping (Render free tier). Try asking about:\n• Rebound effects\n• Energy savings\n• Solar panels\n• Emission calculations\n\nBackend will wake up in 30-60 seconds if you refresh!",
        
        "help": " DEMO MODE: I can help you with:\n\n Understanding rebound effects\n Energy-saving strategies\n Solar panel analysis\n Emission calculations\n Behavioral interventions\n Sustainability best practices\n\nIn production, I analyze YOUR specific situation using:\n• Pathway RAG with verified sustainability research\n• Google Gemini 2.5 for natural language understanding\n• Real-time consumption data\n• Personalized recommendations\n\nCurrently in demo mode - backend is sleeping!",
        
        "pdf": " DEMO MODE: In production, you can export comprehensive PDF reports including:\n\n Executive Summary with sustainability index\n Rebound effect analysis and trends\n AI-generated recommendations\n Emissions breakdown (baseline vs actual)\n Behavioral insights and interventions\n\nClick the PDF button on the dashboard to download your personalized sustainability report!",
        
        "pathway": " DEMO MODE: Pathway RAG is our knowledge retrieval system that:\n\n Searches through 10 sustainability documents\n Includes IPCC reports, Energy Star guidelines, behavioral studies\n Finds context-relevant information for your questions\n Enhances Google Gemini responses with verified data\n Reduces AI hallucinations by grounding answers in facts\n\nThis ensures accurate, evidence-based sustainability recommendations!",
        
        "default": " DEMO MODE: Backend is currently sleeping (Render free tier spins down after 15 minutes of inactivity).\n\nIn production, I would:\n• Analyze your specific situation using Pathway RAG\n• Retrieve relevant knowledge from 10 sustainability documents\n• Generate personalized recommendations with Google Gemini 2.5\n• Detect rebound effects in real-time\n• Provide actionable insights\n\nThe platform features:\n Multi-language support (8 languages)\n Voice input capability\n Context-aware responses\n Evidence-based recommendations\n\nBackend will wake up automatically in 30-60 seconds. Try refreshing the dashboard or asking another question!"
      };
      
      // Find matching mock response
      const userMessageLower = textToSend.toLowerCase();
      let mockResponse = mockResponses.default;
      
      if (userMessageLower.includes("rebound") || userMessageLower.includes("jevons")) {
        mockResponse = mockResponses.rebound;
      } else if (userMessageLower.includes("energy") || userMessageLower.includes("save") || userMessageLower.includes("saving")) {
        mockResponse = mockResponses.energy;
      } else if (userMessageLower.includes("solar") || userMessageLower.includes("panel")) {
        mockResponse = mockResponses.solar;
      } else if (userMessageLower.includes("calculate") || userMessageLower.includes("emission") || userMessageLower.includes("math") || userMessageLower.includes("formula")) {
        mockResponse = mockResponses.calculate;
      } else if (userMessageLower.includes("hello") || userMessageLower.includes("hi") || userMessageLower.includes("hey")) {
        mockResponse = mockResponses.hello;
      } else if (userMessageLower.includes("help") || userMessageLower.includes("what can you do")) {
        mockResponse = mockResponses.help;
      } else if (userMessageLower.includes("pdf") || userMessageLower.includes("report") || userMessageLower.includes("export")) {
        mockResponse = mockResponses.pdf;
      } else if (userMessageLower.includes("pathway") || userMessageLower.includes("rag") || userMessageLower.includes("how do you work")) {
        mockResponse = mockResponses.pathway;
      }
      
      // Show mock response if backend is down
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status >= 500 || error.message === 'Network Error' || !error.response) {
        const mockMessage = {
          role: "assistant",
          content: mockResponse,
        };
        setMessages((prev) => [...prev, mockMessage]);
        setIsTyping(false);
        return;
      }
      
      // Original error handling for non-network errors
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
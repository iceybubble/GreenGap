import { useState } from "react";
import axios from "axios";
import "./AIChat.css";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm your Pathway AI sustainability assistant. Ask me about rebound effects, energy efficiency, carbon reduction, or behavior improvement!"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickQuestions = [
    "How do I prevent rebound effects?",
    "What is peak hour optimization?",
    "How to improve my behavior score?",
    "Tell me about carbon reduction"
  ];

  const sendMessage = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: "user", content: textToSend };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: textToSend
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: response.data.answer,
        powered_by: response.data.powered_by
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Sorry, I'm having trouble connecting. Please make sure the backend is running at http://127.0.0.1:8000"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="ai-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with Pathway AI"
        aria-label="Open AI chat"
      >
        🤖
        <span className="chat-badge">AI</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="chat-header">
            <div className="header-content">
              <h3>🤖 Pathway AI Assistant</h3>
              <span className="ai-status">● Online</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">✕</button>
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="quick-questions">
              <p className="quick-label">Quick questions:</p>
              {quickQuestions.map((q, idx) => (
                <button 
                  key={idx}
                  className="quick-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                  {msg.powered_by && (
                    <div className="powered-by">✨ {msg.powered_by}</div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
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
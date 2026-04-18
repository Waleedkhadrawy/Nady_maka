import React, { useState } from 'react';
import '../styles/components/ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'أهلًا! كيف يمكنني مساعدتك؟' },
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'الأسعار و طرق الدفع',
    'العضوية والخدمات',
    'الاستفسارات العامة',
    'الشكاوي',
    'استبيان',
  ];

  const toggle = () => setIsOpen((v) => !v);

  const sendMessage = (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    const userMsg = { id: Date.now(), from: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    // simple bot echo
    const botMsg = {
      id: Date.now() + 1,
      from: 'bot',
      text: 'تم استلام الرسالة: ' + userText,
    };
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 400);
  };

  return (
    <div className={`chat-widget ${isOpen ? 'open' : ''}`} dir="rtl">
      {!isOpen && (
        <button className="chat-toggle" aria-label="فتح الدردشة" onClick={toggle}>
          <span className="chat-icon">💬</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-brand">
              <div className="brand-mark">
                <img src={`${process.env.PUBLIC_URL}/images/logo.PNG`} alt="Makkah Yard" />
              </div>
              <div className="brand-title">مكة يارد</div>
            </div>
            <button className="chat-close" onClick={toggle} aria-label="إغلاق">
              ⌄
            </button>
          </div>

          <div className="chat-body">
            <div className="hero-banner" aria-hidden="true" />
            <div className="messages">
              {messages.map((m) => (
                <div key={m.id} className={`msg ${m.from}`}>{m.text}</div>
              ))}
            </div>
            <div className="quick-replies">
              {quickReplies.map((q) => (
                <button key={q} className="chip" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="اكتب رسالتك واضغط زر الإدخال"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button className="send" onClick={() => sendMessage()}>إرسال</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;

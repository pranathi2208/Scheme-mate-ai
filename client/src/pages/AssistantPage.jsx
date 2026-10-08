import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { assistantService, profileService } from '../services/localData';
import { Send, Bot, User, Info, ChevronRight } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 1,
  role: 'assistant',
  content: `Namaste! 🙏 I'm SchemeMate Assistant.\n\nI can help you:\n\n• Find government schemes you may be eligible for\n• Explain what documents you need\n• Guide you through the application process\n• Answer questions about specific schemes\n\nWhat would you like to know?`,
  suggestions: [
    'What schemes am I eligible for?',
    'Show me farmer schemes',
    'How do I apply for PM-KISAN?',
    'What documents do I need?',
  ],
};

export default function AssistantPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setLoading(true);

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: msg }]);

    // Simulate slight delay for UX
    setTimeout(() => {
      const profile  = profileService.get();
      const response = assistantService.respond(msg, profile);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content:     response.message,
        suggestions: response.suggestions,
        schemes:     response.schemes,
        action:      response.action,
      }]);
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={s.wrapper}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerInner}>
          <div style={s.botIcon}><Bot size={20} style={{ color: '#fff' }} /></div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--gray-900)' }}>{t('assistant.title')}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success-500)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{t('assistant.online')}</span>
            </div>
          </div>
        </div>
        <div style={s.modeBadge}>
          <Info size={12} />
          {t('assistant.modeNote')}
        </div>
      </div>

      {/* Messages */}
      <div style={s.messages}>
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} onSuggestion={sendMessage} />
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
            <div style={s.botAvatar}><Bot size={16} style={{ color: '#fff' }} /></div>
            <div style={{ ...s.bubble, ...s.bubbleAssistant, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ThinkingDots />
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{t('assistant.thinking')}</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={s.inputArea}>
        <div style={s.disclaimer}>
          <Info size={12} style={{ flexShrink: 0, color: 'var(--warning-500)' }} />
          <span>{t('assistant.disclaimer')}</span>
        </div>
        <div style={s.inputRow}>
          <textarea
            ref={inputRef}
            style={s.textarea}
            placeholder={t('assistant.placeholder')}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            maxLength={500}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            style={{
              ...s.sendBtn,
              background: input.trim() && !loading ? 'var(--primary-600)' : 'var(--gray-200)',
              color: input.trim() && !loading ? '#fff' : 'var(--gray-400)',
            }}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textAlign: 'right' }}>
          {t('assistant.charLimit', { count: input.length })}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg, onSuggestion }) {
  const isUser = msg.role === 'user';

  const formatContent = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: isUser ? 'flex-end' : 'flex-start', padding: '0.375rem 0', alignItems: 'flex-end' }}>
      {!isUser && <div style={s.botAvatar}><Bot size={16} style={{ color: '#fff' }} /></div>}

      <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        <div style={{ ...s.bubble, ...(isUser ? s.bubbleUser : s.bubbleAssistant) }}>
          <div style={{ fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-line', color: isUser ? '#fff' : 'var(--gray-800)' }}>
            {formatContent(msg.content)}
          </div>
        </div>

        {/* Scheme chips */}
        {msg.schemes?.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%' }}>
            {msg.schemes.map(scheme => (
              <Link
                key={scheme.id || scheme.slug}
                to={`/schemes/${scheme.slug || scheme.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.875rem', background: '#fff', border: '1px solid var(--gray-200)', borderRadius: '0.625rem', textDecoration: 'none', fontSize: '0.8125rem', color: 'var(--gray-800)', fontWeight: 500, transition: 'all 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-300)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
              >
                {scheme.name}
                <ChevronRight size={14} style={{ color: 'var(--primary-500)' }} />
              </Link>
            ))}
          </div>
        )}

        {/* Suggestion pills */}
        {msg.suggestions?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {msg.suggestions.map((sug, i) => (
              <button
                key={i} onClick={() => onSuggestion(sug)}
                style={{
                  padding: '0.35rem 0.75rem', borderRadius: '9999px',
                  border: '1.5px solid var(--primary-200)', background: 'var(--primary-50)',
                  color: 'var(--primary-700)', fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-100)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--primary-50)'}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && <div style={s.userAvatar}><User size={16} style={{ color: '#fff' }} /></div>}
    </div>
  );
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: '50%', background: 'var(--gray-400)',
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
    </div>
  );
}

const s = {
  wrapper:       { display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-height))', maxWidth: 800, margin: '0 auto', width: '100%', background: '#fff' },
  header:        { padding: '1rem 1.25rem', borderBottom: '1px solid var(--gray-200)', background: '#fff', flexShrink: 0 },
  headerInner:   { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' },
  botIcon:       { width: 40, height: 40, borderRadius: '0.875rem', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modeBadge:     { display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, marginTop: '0.25rem' },
  messages:      { flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', background: 'var(--gray-50)' },
  botAvatar:     { width: 32, height: 32, borderRadius: '0.625rem', background: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  userAvatar:    { width: 32, height: 32, borderRadius: '0.625rem', background: 'var(--gray-400)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble:        { padding: '0.75rem 1rem', borderRadius: '1rem', border: '1px solid transparent', maxWidth: '100%' },
  bubbleAssistant: { background: '#fff', borderColor: 'var(--gray-200)', borderTopLeftRadius: '0.25rem', boxShadow: 'var(--shadow-sm)' },
  bubbleUser:    { background: 'var(--primary-600)', borderTopRightRadius: '0.25rem' },
  inputArea:     { padding: '0.875rem 1.25rem', borderTop: '1px solid var(--gray-200)', background: '#fff', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  disclaimer:    { display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--gray-500)' },
  inputRow:      { display: 'flex', gap: '0.625rem', alignItems: 'flex-end' },
  textarea:      { flex: 1, padding: '0.75rem 1rem', border: '1.5px solid var(--gray-300)', borderRadius: '0.875rem', fontSize: '0.9375rem', resize: 'none', fontFamily: 'inherit', lineHeight: 1.5, outline: 'none', transition: 'border-color 0.15s' },
  sendBtn:       { width: 46, height: 46, borderRadius: '0.875rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 },
};

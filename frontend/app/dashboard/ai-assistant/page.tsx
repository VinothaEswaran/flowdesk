// @ts-nocheck
'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantPage() {
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [tab,        setTab]        = useState<'chat' | 'generate'>('chat');
  const [genType,    setGenType]    = useState('email');
  const [genResult,  setGenResult]  = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [genForm,    setGenForm]    = useState({
    client_name: '', project_name: '', amount: '', context: ''
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const res = await api.post('/ai/chat', {
        message: msg,
        history: messages,
      });
      setMessages([...newMessages, {
        role: 'assistant',
        content: res.data.reply || res.data.error || 'No response'
      }]);
    } catch (e) {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (genLoading) return;
    setGenLoading(true);
    setGenResult('');
    try {
      const res = await api.post('/ai/generate', {
        prompt_type:  genType,
        client_name:  genForm.client_name  || undefined,
        project_name: genForm.project_name || undefined,
        amount:       genForm.amount ? parseFloat(genForm.amount) : undefined,
        context:      genForm.context      || undefined,
      });
      setGenResult(res.data.result || res.data.error || 'No result');
    } catch (e) {
      setGenResult('Error generating. Try again.');
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>AI Assistant</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
          Generate emails, proposals, and insights instantly
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { key: 'chat',     label: '💬 AI Chat'      },
          { key: 'generate', label: '✨ AI Generator'  },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontWeight: '600',
              fontSize: '14px', cursor: 'pointer', border: 'none',
              background: tab === t.key ? '#7c3aed' : '#1f2937',
              color: tab === t.key ? 'white' : '#9ca3af',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <div style={{
          display: 'flex', flexDirection: 'column', flex: 1,
          background: '#1f2937', borderRadius: '12px',
          border: '1px solid #374151', overflow: 'hidden', minHeight: 0
        }}>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {messages.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px' }}>🤖</div>
                <div>
                  <h3 style={{ color: 'white', fontWeight: '600', fontSize: '18px' }}>FlowDesk AI</h3>
                  <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Ask me anything about freelancing!</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%', maxWidth: '480px' }}>
                  {[
                    'Write a follow-up email for delayed payment',
                    'Give me productivity tips for freelancers',
                    'How to write a good project proposal?',
                    'What tools should I use for project management?',
                  ].map((s, i) => (
                    <button key={i} onClick={() => sendMessage(s)}
                      style={{
                        textAlign: 'left', padding: '12px', background: '#374151',
                        border: '1px solid #4b5563', borderRadius: '8px',
                        color: '#d1d5db', fontSize: '13px', cursor: 'pointer'
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '12px 16px', borderRadius: '16px',
                  background: msg.role === 'user' ? '#7c3aed' : '#374151',
                  color: 'white', fontSize: '14px', lineHeight: '1.6',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius:  msg.role === 'user' ? '16px' : '4px',
                }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px', background: '#374151',
                  borderRadius: '16px', borderBottomLeftRadius: '4px',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 150, 300].map(delay => (
                      <div key={delay} style={{
                        width: '8px', height: '8px', background: '#7c3aed',
                        borderRadius: '50%', animation: 'bounce 1s infinite',
                        animationDelay: `${delay}ms`
                      }} />
                    ))}
                  </div>
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                style={{ marginBottom: '8px', fontSize: '12px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', display: 'block' }}>
                🗑 Clear conversation
              </button>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask FlowDesk AI anything..."
                disabled={loading}
                style={{
                  flex: 1, background: '#374151', border: '1px solid #4b5563',
                  borderRadius: '10px', padding: '12px 16px', color: 'white',
                  fontSize: '14px', outline: 'none',
                }}
              />
              <button onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  padding: '12px 16px', background: '#7c3aed', border: 'none',
                  borderRadius: '10px', color: 'white', cursor: 'pointer',
                  opacity: loading || !input.trim() ? 0.5 : 1
                }}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GENERATOR TAB ── */}
      {tab === 'generate' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '16px', overflowY: 'auto' }}>

          <div style={{ background: '#1f2937', borderRadius: '12px', border: '1px solid #374151', padding: '24px' }}>
            <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '16px' }}>⚡ Generate Content</h3>

            {/* Type buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '16px' }}>
              {[
                { key:'email',    icon:'📧', label:'Email'    },
                { key:'proposal', icon:'📄', label:'Proposal' },
                { key:'insights', icon:'💡', label:'Insights' },
                { key:'summary',  icon:'📝', label:'Summary'  },
              ].map(t => (
                <button key={t.key} onClick={() => setGenType(t.key)}
                  style={{
                    padding: '12px', borderRadius: '8px', cursor: 'pointer',
                    border: `1px solid ${genType === t.key ? '#7c3aed' : '#4b5563'}`,
                    background: genType === t.key ? '#7c3aed' : '#374151',
                    color: genType === t.key ? 'white' : '#9ca3af',
                    fontSize: '13px', fontWeight: '600'
                  }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{t.icon}</div>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { key:'client_name',  label:'Client Name',  placeholder:'e.g. John Doe'         },
                { key:'project_name', label:'Project Name', placeholder:'e.g. Website Redesign'  },
                { key:'amount',       label:'Amount (₹)',   placeholder:'e.g. 50000', type:'number' },
                { key:'context',      label:'Context',      placeholder:'Any extra context...'   },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:'block', fontSize:'12px', color:'#9ca3af', marginBottom:'4px' }}>{f.label}</label>
                  <input
                    type={f.type || 'text'}
                    value={genForm[f.key]}
                    onChange={e => setGenForm({...genForm, [f.key]: e.target.value})}
                    placeholder={f.placeholder}
                    style={{
                      width:'100%', background:'#374151', border:'1px solid #4b5563',
                      borderRadius:'8px', padding:'8px 12px', color:'white',
                      fontSize:'13px', outline:'none', boxSizing:'border-box'
                    }}
                  />
                </div>
              ))}
            </div>

            <button onClick={handleGenerate} disabled={genLoading}
              style={{
                width:'100%', padding:'12px', background:'#7c3aed', border:'none',
                borderRadius:'8px', color:'white', fontWeight:'600', cursor:'pointer',
                opacity: genLoading ? 0.6 : 1, fontSize:'14px'
              }}>
              {genLoading ? '⏳ Generating...' : '✨ Generate'}
            </button>
          </div>

          {/* Result */}
          {genResult && (
            <div style={{ background:'#1f2937', borderRadius:'12px', border:'1px solid #374151', padding:'24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' }}>
                <h3 style={{ color:'white', fontWeight:'600' }}>✅ Result</h3>
                <button
                  onClick={() => { navigator.clipboard.writeText(genResult); alert('Copied!'); }}
                  style={{ background:'#374151', border:'none', color:'#d1d5db', padding:'6px 12px', borderRadius:'6px', cursor:'pointer', fontSize:'12px' }}>
                  📋 Copy
                </button>
              </div>
              <p style={{ color:'#d1d5db', fontSize:'14px', lineHeight:'1.8', whiteSpace:'pre-wrap', margin:0 }}>
                {genResult}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { useMockData } from '../components/data/MockDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Send } from 'lucide-react';
import moment from 'moment';

export default function Chat() {
  const { currentUser, getFriends, messages, sendMessage } = useMockData();
  const [activeFriend, setActiveFriend] = useState(null);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const friends = getFriends();

  const getConversation = (friendId) =>
    messages
      .filter(m =>
        (m.from === currentUser.id && m.to === friendId) ||
        (m.from === friendId && m.to === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const getLastMsg = (friendId) => {
    const conv = getConversation(friendId);
    return conv.length > 0 ? conv[conv.length - 1] : null;
  };

  const conversation = activeFriend ? getConversation(activeFriend.id) : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.length]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || !activeFriend) return;
    sendMessage(activeFriend.id, trimmed);
    setText('');
  };

  // ── Conversation view ──
  if (activeFriend) {
    return (
      <div
        className="flex flex-col"
        style={{ height: 'calc(100dvh - 72px)', overflow: 'hidden' }}
      >
        {/* Fixed header */}
        <div
          className="flex items-center gap-3 px-0 py-2 flex-shrink-0 border-b"
          style={{ borderColor:'var(--border-hex)' }}
        >
          <Button
            variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0"
            onClick={() => setActiveFriend(null)}
          >
            <ChevronLeft size={20} />
          </Button>
          <img src={activeFriend.avatar} alt="" className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm truncate" style={{ color:'var(--text-header)' }}>
              {activeFriend.name}
            </p>
            <p style={{ fontSize:9, color:'var(--text-muted)' }}>{activeFriend.nick}</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 px-0">
          {conversation.map(msg => {
            const isMe = msg.from === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[78%] px-4 py-2.5 shadow-sm"
                  style={{
                    background: isMe ? 'var(--accent-hex)' : 'var(--bg-card)',
                    color: isMe ? '#fff' : 'var(--text-main)',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  }}
                >
                  <p style={{ fontSize:13, lineHeight:1.45 }}>{msg.content}</p>
                  <p style={{ fontSize:9, marginTop:3, opacity:0.65, textAlign:'right' }}>
                    {moment(msg.timestamp).format('HH:mm')}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* Fixed input */}
        <div
          className="flex gap-2 pt-3 flex-shrink-0 border-t"
          style={{ borderColor:'var(--border-hex)' }}
        >
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Escreva uma mensagem..."
            className="flex-1 rounded-xl border-0 h-10"
            style={{ background:'var(--bg-card)' }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            className="rounded-xl h-10 w-10 flex-shrink-0 text-white"
            style={{ background:'var(--accent-hex)' }}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    );
  }

  // ── Friends list ──
  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-header)' }}>Chat</h1>
      </div>

      {friends.map(friend => {
        const last = getLastMsg(friend.id);
        return (
          <button
            key={friend.id}
            className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all hover:shadow-md"
            style={{ background:'var(--bg-card)', border:'none', cursor:'pointer' }}
            onClick={() => setActiveFriend(friend)}
          >
            <img src={friend.avatar} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color:'var(--text-header)' }}>{friend.name}</p>
              {last && (
                <p className="text-xs truncate mt-0.5" style={{ color:'var(--text-muted)' }}>
                  {last.from === currentUser.id ? 'Você: ' : ''}{last.content}
                </p>
              )}
            </div>
            {last && (
              <span style={{ fontSize:9, color:'var(--text-muted)', flexShrink:0 }}>
                {moment(last.timestamp).format('HH:mm')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
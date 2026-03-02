import React, { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { useMockData } from "@/components/data/MockDataContext";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Send } from "lucide-react";

const BOTTOM_NAV_HEIGHT = 72; // ajuste se seu menu inferior tiver outra altura

export default function Chat() {
  const { getFriends, currentUser } = useMockData();

  const [activeFriend, setActiveFriend] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState({});
  const endRef = useRef(null);

  const friends = getFriends();

  const conversation = useMemo(() => {
    if (!activeFriend) return [];
    return messages[activeFriend.id] || [];
  }, [activeFriend, messages]);

  // Auto-scroll das mensagens
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "auto" });
  }, [conversation]);

  // ✅ TRAVA o scroll do html/body SOMENTE quando estiver em um chat aberto
  useEffect(() => {
    if (!activeFriend) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "relative";
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.width = prevBodyWidth;
    };
  }, [activeFriend]);

  const handleSend = () => {
    if (!text.trim() || !activeFriend) return;

    const newMsg = {
      id: Date.now().toString(),
      from: currentUser.id,
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeFriend.id]: [...(prev[activeFriend.id] || []), newMsg],
    }));

    setText("");
  };

  // ======================
  // LISTA DE CONVERSAS
  // ======================
  if (!activeFriend) {
    return (
      <div className="space-y-6 pb-4">
        <div className="space-y-1">
          <h1
            className="text-3xl font-extrabold"
            style={{ color: "var(--text-header)" }}
          >
            Chat
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Mensagens com seus amigos.
          </p>
        </div>

        <div className="space-y-3">
          {friends.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFriend(f)}
              className="w-full text-left rounded-2xl px-4 py-4 flex items-center gap-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-hex)",
              }}
            >
              <img
                src={f.avatar}
                alt={f.name}
                className="w-12 h-12 rounded-full object-cover"
                style={{ border: "3px solid var(--accent-hex)" }}
              />
              <div className="min-w-0 flex-1">
                <div
                  className="font-extrabold truncate"
                  style={{ color: "var(--text-header)" }}
                >
                  {f.name}
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "var(--text-muted)" }}
                >
                  Clique para abrir a conversa
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ======================
  // CONVERSA ATIVA (WhatsApp-like)
  // ✅ Tela fixa / sem scroll externo
  // ✅ Só mensagens rolam
  // ======================
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        bottom: BOTTOM_NAV_HEIGHT,
        left: "50%",
        transform: "translateX(-50%)",
        width: "60%",
        maxWidth: "900px",
        minWidth: "320px",
        zIndex: 30,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {/* Container “app chat” */}
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // não deixa rolar o container inteiro
        }}
      >
        {/* HEADER (fixo) */}
        <div
          className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-hex)",
            flex: "0 0 auto",
          }}
        >
          <button
            className="p-2 rounded-xl"
            onClick={() => setActiveFriend(null)}
            style={{ color: "var(--accent-deep)" }}
            aria-label="Voltar"
          >
            <ChevronLeft size={20} />
          </button>

          <img
            src={activeFriend.avatar}
            alt={activeFriend.name}
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: "3px solid var(--accent-hex)" }}
          />

          <div className="min-w-0">
            <div
              className="font-extrabold truncate"
              style={{ color: "var(--text-header)" }}
            >
              {activeFriend.name}
            </div>
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--accent-hex)" }}
            >
              Online agora
            </div>
          </div>
        </div>

        {/* MESSAGES (ÚNICO lugar que rola) */}
        <div
          className="px-2 py-4 space-y-3"
          style={{
            flex: "1 1 auto",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {conversation.map((m) => {
            const mine = m.from === currentUser.id;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="rounded-2xl px-4 py-3 max-w-[75%] shadow-sm"
                  style={{
                    background: mine
                      ? "rgba(193,59,117,0.9)"
                      : "rgba(234,221,227,0.9)",
                    color: mine ? "white" : "var(--text-main)",
                  }}
                >
                  <div className="text-sm">{m.content}</div>
                  <div
                    className="text-[11px] mt-1 text-right"
                    style={{ opacity: mine ? 0.85 : 0.6 }}
                  >
                    {moment(m.timestamp).format("HH:mm")}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        {/* INPUT (fixo) */}
        <div
          className="rounded-2xl px-3 py-3 flex items-center gap-3"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-hex)",
            flex: "0 0 auto",
          }}
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Mensagem..."
            className="border-0 bg-transparent focus-visible:ring-0 h-10"
            style={{ color: "var(--text-main)" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button
            onClick={handleSend}
            className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-hex)", color: "white" }}
            aria-label="Enviar"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

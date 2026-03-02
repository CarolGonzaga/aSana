import React, { useMemo, useState } from "react";
import { useMockData } from "@/components/data/MockDataContext";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";

export default function Friends() {
  const { getFriends } = useMockData();
  const [q, setQ] = useState("");

  const friends = getFriends();
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return friends;
    return friends.filter((f) =>
      `${f.name} ${f.nick}`.toLowerCase().includes(s),
    );
  }, [q, friends]);

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="space-y-1">
        <h1
          className="text-3xl font-extrabold"
          style={{ color: "var(--text-header)" }}
        >
          Amigos
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Conecte-se com outros leitores.
        </p>
      </div>

      {/* Search */}
      <div
        className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-hex)",
        }}
      >
        <Search size={18} style={{ color: "var(--text-muted)" }} />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar amigo por @nick..."
          className="border-0 bg-transparent focus-visible:ring-0 px-0 h-8"
          style={{ color: "var(--text-main)" }}
        />
      </div>

      {/* Section */}
      <div className="flex items-center gap-2">
        <span
          className="inline-block rounded-full"
          style={{ width: 6, height: 18, background: "var(--accent-hex)" }}
        />
        <h2
          className="text-sm font-bold tracking-widest"
          style={{ color: "var(--accent-deep)" }}
        >
          MEUS AMIGOS
        </h2>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((f) => (
          <button
            key={f.id}
            className="w-full text-left rounded-2xl px-4 py-4 flex items-center gap-4"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-hex)",
            }}
          >
            <img
              src={f.avatar}
              alt={f.name}
              className="w-14 h-14 rounded-full object-cover"
              style={{ border: "3px solid var(--accent-hex)" }}
            />
            <div className="min-w-0 flex-1">
              <div
                className="font-extrabold text-lg truncate"
                style={{ color: "var(--text-header)" }}
              >
                {f.name}
              </div>
              <div
                className="text-sm truncate"
                style={{ color: "var(--accent-deep)" }}
              >
                {f.nick}
              </div>
            </div>

            <ExternalLink size={18} style={{ color: "var(--accent-deep)" }} />
          </button>
        ))}
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useMockData } from "../components/data/MockDataContext";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

import {
  BookOpen,
  BookCheck,
  Star,
  Trophy,
  Flame,
  CalendarDays,
  Camera,
  Copy,
  Check,
  Lock,
  Palette,
  Accessibility,
  Trash2,
  LogOut,
} from "lucide-react";

import BookCover from "../components/shared/BookCover";

function safeValue(v) {
  return typeof v === "string" ? v : v == null ? "" : String(v);
}

function makePublicId(user) {
  // mock: se não existir, cria um id estável baseado no id do user
  const base = (user?.id || "u0").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const pad = (base + "0000").slice(0, 2) + "-" + (base + "0000").slice(-4);
  return user?.publicId || user?.public_id || pad || "AC-0000";
}

export default function Profile() {
  const {
    currentUser,
    getStats,
    getUserBooks,
    badges,

    // ✅ novos métodos (adicione no MockDataContext — bloco abaixo)
    updateProfile,
    updatePreferences,
    changePassword,
    deleteAccount,
    logout,
  } = useMockData();

  const stats = getStats();
  const books = getUserBooks(currentUser.id);

  const favs = useMemo(() => {
    return books
      .filter((b) => (b.rating || 0) >= 4)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6);
  }, [books]);

  // ─────────────────────────────────────────────
  // Identidade (form por seção)
  const [profileForm, setProfileForm] = useState({
    name: safeValue(currentUser?.name),
    email: safeValue(currentUser?.email || "ana.caroline@example.com"),
    nick: safeValue(currentUser?.nick),
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: safeValue(currentUser?.name),
      email: safeValue(currentUser?.email || "ana.caroline@example.com"),
      nick: safeValue(currentUser?.nick),
    });
  }, [currentUser]);

  // ─────────────────────────────────────────────
  // Preferências (form por seção)
  const [prefsForm, setPrefsForm] = useState({
    theme: currentUser?.preferences?.theme || "light", // light | dark | system
    largeText: !!currentUser?.preferences?.largeText,
    reduceMotion: !!currentUser?.preferences?.reduceMotion,
  });
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsSaving, setPrefsSaving] = useState(false);

  useEffect(() => {
    setPrefsForm({
      theme: currentUser?.preferences?.theme || "light",
      largeText: !!currentUser?.preferences?.largeText,
      reduceMotion: !!currentUser?.preferences?.reduceMotion,
    });
  }, [currentUser]);

  // ─────────────────────────────────────────────
  // Segurança (form por seção)
  const [pwdForm, setPwdForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  // ─────────────────────────────────────────────
  // Foto do perfil
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoSaving, setPhotoSaving] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  // ─────────────────────────────────────────────
  // Copiar ID
  const publicId = makePublicId(currentUser);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // fallback: nada
    }
  };

  // ─────────────────────────────────────────────
  // Handlers (salvar por seção)
  const saveProfileSection = async () => {
    setProfileSaved(false);
    setProfileSaving(true);
    try {
      await updateProfile?.({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        nick: profileForm.nick.trim(),
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 1500);
    } finally {
      setProfileSaving(false);
    }
  };

  const savePrefsSection = async () => {
    setPrefsSaved(false);
    setPrefsSaving(true);
    try {
      await updatePreferences?.({ ...prefsForm });
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 1500);
    } finally {
      setPrefsSaving(false);
    }
  };

  const savePasswordSection = async () => {
    setPwdSaved(false);

    const cur = pwdForm.current.trim();
    const next = pwdForm.next.trim();
    const conf = pwdForm.confirm.trim();

    if (!cur || !next || !conf) return;
    if (next.length < 6) return;
    if (next !== conf) return;

    setPwdSaving(true);
    try {
      await changePassword?.({ current: cur, next });
      setPwdForm({ current: "", next: "", confirm: "" });
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 1500);
    } finally {
      setPwdSaving(false);
    }
  };

  const savePhoto = async () => {
    if (!photoFile) return;

    setPhotoSaving(true);
    try {
      // mock: usa preview local como "url"
      await updateProfile?.({ avatar: photoPreview || currentUser.avatar });
      setShowPhoto(false);
      setPhotoFile(null);
    } finally {
      setPhotoSaving(false);
    }
  };

  // ─────────────────────────────────────────────
  // UI helpers
  const cardStyle = {
    background: "var(--bg-card)",
    border: "1px solid var(--border-hex)",
  };

  const sectionTitleStyle = {
    color: "var(--text-header)",
  };

  const labelStyle = {
    color: "var(--text-muted)",
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: "var(--text-header)" }}
          >
            Perfil
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Suas configurações místicas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => logout?.()}
            className="w-11 h-11 rounded-full flex items-center justify-center border"
            style={{
              background: "rgba(255,255,255,.35)",
              borderColor: "var(--border-hex)",
              color: "var(--accent-hex)",
            }}
            title="Sair"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Avatar + Public ID (como sua referência) */}
      <div className="rounded-2xl p-6 text-center" style={{ ...cardStyle }}>
        <div className="relative mx-auto w-fit">
          <div
            className="w-24 h-24 rounded-full overflow-hidden mx-auto shadow-md"
            style={{
              border: "3px solid var(--accent-hex)",
              background: "rgba(255,255,255,.35)",
            }}
          >
            <img
              src={currentUser.avatar || "/avatars/default.png"}
              alt={currentUser.name}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/avatars/default.png")}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPhoto(true)}
            className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            style={{ background: "var(--accent-hex)", color: "white" }}
            title="Alterar foto"
          >
            <Camera size={18} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{
              background: "rgba(255,255,255,.45)",
              border: "1px solid var(--border-hex)",
              color: "var(--text-main)",
            }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: "var(--accent-deep)" }}
            >
              ID Público:
            </span>
            <span className="text-xs font-semibold">{publicId}</span>

            <button
              type="button"
              onClick={handleCopy}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0,0,0,.04)",
                border: "1px solid rgba(0,0,0,.08)",
                color: "var(--accent-hex)",
              }}
              title="Copiar"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Seção: Dados cadastrais */}
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold" style={sectionTitleStyle}>
            Dados cadastrais
          </h2>

          <Button
            className="rounded-xl h-10 font-bold text-white"
            style={{ background: "var(--accent-hex)" }}
            onClick={saveProfileSection}
            disabled={profileSaving}
          >
            {profileSaved ? (
              <>
                <Check size={16} className="mr-2" />
                Salvo
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold mb-1" style={labelStyle}>
              Nome completo
            </div>
            <Input
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Seu nome"
            />
          </div>

          <div>
            <div className="text-xs font-bold mb-1" style={labelStyle}>
              E-mail
            </div>
            <Input
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div>
            <div className="text-xs font-bold mb-1" style={labelStyle}>
              Nickname
            </div>
            <Input
              value={profileForm.nick}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, nick: e.target.value }))
              }
              placeholder="@seunick"
            />
          </div>
        </div>
      </div>

      {/* Seção: Segurança */}
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Lock size={16} style={{ color: "var(--accent-hex)" }} />
            <h2 className="text-sm font-extrabold" style={sectionTitleStyle}>
              Segurança
            </h2>
          </div>

          <Button
            className="rounded-xl h-10 font-bold text-white"
            style={{ background: "var(--accent-hex)" }}
            onClick={savePasswordSection}
            disabled={pwdSaving}
            title="Salvar nova senha"
          >
            {pwdSaved ? (
              <>
                <Check size={16} className="mr-2" />
                Salvo
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold mb-1" style={labelStyle}>
              Senha atual
            </div>
            <Input
              type="password"
              value={pwdForm.current}
              onChange={(e) =>
                setPwdForm((p) => ({ ...p, current: e.target.value }))
              }
              placeholder="••••••••"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-bold mb-1" style={labelStyle}>
                Nova senha
              </div>
              <Input
                type="password"
                value={pwdForm.next}
                onChange={(e) =>
                  setPwdForm((p) => ({ ...p, next: e.target.value }))
                }
                placeholder="mín. 6 caracteres"
              />
            </div>

            <div>
              <div className="text-xs font-bold mb-1" style={labelStyle}>
                Confirmar nova senha
              </div>
              <Input
                type="password"
                value={pwdForm.confirm}
                onChange={(e) =>
                  setPwdForm((p) => ({ ...p, confirm: e.target.value }))
                }
                placeholder="repita a senha"
              />
            </div>
          </div>

          {pwdForm.next &&
            pwdForm.confirm &&
            pwdForm.next !== pwdForm.confirm && (
              <div
                className="text-xs font-semibold"
                style={{ color: "#b91c1c" }}
              >
                As senhas não coincidem.
              </div>
            )}
        </div>
      </div>

      {/* Seção: Preferências */}
      <div className="rounded-2xl p-5 space-y-4" style={cardStyle}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Palette size={16} style={{ color: "var(--accent-hex)" }} />
            <h2 className="text-sm font-extrabold" style={sectionTitleStyle}>
              Preferências
            </h2>
          </div>

          <Button
            className="rounded-xl h-10 font-bold text-white"
            style={{ background: "var(--accent-hex)" }}
            onClick={savePrefsSection}
            disabled={prefsSaving}
          >
            {prefsSaved ? (
              <>
                <Check size={16} className="mr-2" />
                Salvo
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-bold mb-1" style={labelStyle}>
              Tema
            </div>
            <select
              value={prefsForm.theme}
              onChange={(e) =>
                setPrefsForm((p) => ({ ...p, theme: e.target.value }))
              }
              className="h-10 w-full rounded-xl px-3 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid var(--border-hex)",
                color: "var(--text-main)",
              }}
            >
              <option value="light">Claro</option>
              <option value="dark">Noturno</option>
              <option value="system">Automático</option>
            </select>
          </div>

          <div
            className="rounded-2xl p-4 flex items-start justify-between gap-3"
            style={{
              background: "rgba(255,255,255,.35)",
              border: "1px solid var(--border-hex)",
            }}
          >
            <div className="flex items-start gap-2">
              <Accessibility size={16} style={{ color: "var(--accent-hex)" }} />
              <div>
                <div className="text-sm font-bold" style={sectionTitleStyle}>
                  Acessibilidade
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Ajustes para conforto visual e foco.
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <label className="inline-flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={prefsForm.largeText}
                  onChange={(e) =>
                    setPrefsForm((p) => ({ ...p, largeText: e.target.checked }))
                  }
                />
                Texto maior
              </label>

              <label className="inline-flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={prefsForm.reduceMotion}
                  onChange={(e) =>
                    setPrefsForm((p) => ({
                      ...p,
                      reduceMotion: e.target.checked,
                    }))
                  }
                />
                Reduzir animações
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Zona de perigo */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{
          background: "rgba(255,255,255,.20)",
          border: "1px solid rgba(185,28,28,0.25)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Trash2 size={16} style={{ color: "#b91c1c" }} />
            <h2 className="text-sm font-extrabold" style={{ color: "#7f1d1d" }}>
              Conta
            </h2>
          </div>

          <Button
            variant="outline"
            className="rounded-xl h-10 font-bold"
            onClick={() => deleteAccount?.()}
            style={{
              borderColor: "rgba(185,28,28,0.35)",
              color: "#7f1d1d",
            }}
          >
            Remover conta
          </Button>
        </div>

        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Esta ação será definitiva. Todos os seus dados serão apagados e não
          poderão ser recuperados.
        </div>
      </div>

      {/* Dialog: Alterar foto */}
      <Dialog open={showPhoto} onOpenChange={setShowPhoto}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-header)" }}>
              Alterar foto do perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{
                background: "rgba(255,255,255,.35)",
                border: "1px solid var(--border-hex)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden border"
                style={{ borderColor: "rgba(255,255,255,.8)" }}
              >
                <img
                  src={
                    photoPreview || currentUser.avatar || "/avatars/default.png"
                  }
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = "/avatars/default.png")
                  }
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-bold" style={sectionTitleStyle}>
                  Escolha uma imagem
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  PNG ou JPG. (Mock local)
                </div>
              </div>
            </div>

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setShowPhoto(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl text-white font-bold"
              style={{ background: "var(--accent-hex)" }}
              onClick={savePhoto}
              disabled={!photoFile || photoSaving}
            >
              Salvar foto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

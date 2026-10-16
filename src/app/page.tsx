'use client';

import React, { useState } from 'react';
import { useLinkProStore } from '@/lib/storage';
import { Header } from '@/components/Header';
import { ExchangeModal } from '@/components/ExchangeModal';
import { AffinityModal } from '@/components/AffinityModal';
import { ConnectionsList } from '@/components/ConnectionsList';
import { ProfileEditor } from '@/components/ProfileEditor';
import { Profile, ExchangeSession, AffinityResult } from '@/lib/types';
import { INTENT_LABELS } from '@/lib/affinity';
import {
  QrCode,
  Shield,
  SlidersHorizontal,
  Lock,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const {
    mode,
    setMode,
    currentProfile,
    updateProfile,
    connections,
    saveConnection,
    updatePrivateNote,
    deleteConnection,
    createExchangeSession,
    simulatePeerJoin,
  } = useLinkProStore();

  const [isExchangeOpen, setIsExchangeOpen] = useState(false);
  const [isAffinityOpen, setIsAffinityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [currentSession, setCurrentSession] = useState<ExchangeSession | null>(null);
  const [matchedPeer, setMatchedPeer] = useState<Profile | null>(null);
  const [calculatedAffinity, setCalculatedAffinity] = useState<AffinityResult | null>(null);

  const isPersonal = mode === 'personal';

  const handleOpenExchange = () => {
    const session = createExchangeSession();
    setCurrentSession(session);
    setIsExchangeOpen(true);
  };

  const handleStartAffinityCheck = (peerIndex: number) => {
    if (!currentSession) return;
    const { peerProfile, affinity } = simulatePeerJoin(currentSession, peerIndex);
    setMatchedPeer(peerProfile);
    setCalculatedAffinity(affinity);
    setIsExchangeOpen(false);
    setIsAffinityOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090A0E] text-zinc-100 flex flex-col pb-20 selection:bg-zinc-700 selection:text-white">
      {/* Header Minimalista */}
      <Header
        mode={mode}
        currentProfile={currentProfile}
        onModeChange={setMode}
        onOpenExchange={handleOpenExchange}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Aviso de Privacidad y Aislamiento de Perfiles */}
        <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'w-2 h-2 rounded-full',
                isPersonal ? 'bg-amber-400' : 'bg-emerald-400'
              )}
            />
            <div>
              <p className="text-xs font-medium text-zinc-200">
                {isPersonal ? 'Perfil Social & Personal Activo' : 'Perfil Profesional & Negocios Activo'}
              </p>
              <p className="text-[11px] text-zinc-400 leading-tight">
                {isPersonal
                  ? 'Tus datos corporativos y laborales permanecen aislados.'
                  : 'Tus redes sociales y números personales no serán revelados.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(true)}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/5 transition-colors"
            title="Editar credencial activa"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tarjeta Ejecutiva Principal (Credencial) */}
        <div className="p-5 rounded-2xl bg-[#111318] border border-white/5 shadow-xl relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <img
                src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={currentProfile.displayName}
                className="w-13 h-13 rounded-full object-cover ring-1 ring-zinc-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-zinc-100">
                    {currentProfile.displayName}
                  </h2>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-zinc-800 text-zinc-400 border border-white/5">
                    {isPersonal ? 'Social' : 'Pro'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1 leading-relaxed">
                  {currentProfile.headline}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3.5 pt-3 hairline-top flex items-center justify-between text-[11px] text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-zinc-400 uppercase text-[10px]">Objetivo:</span>
              <span className="text-zinc-300 font-medium">
                {INTENT_LABELS[currentProfile.intent] || currentProfile.intent}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
              <Lock className="w-2.5 h-2.5 text-zinc-400" />
              <span>{currentProfile.contacts.length} canales en bóveda</span>
            </div>
          </div>

          {/* Botón de Conexión Primario: Sobrio, Táctil y Nítido */}
          <div className="mt-4 pt-3.5 hairline-top">
            <button
              onClick={handleOpenExchange}
              className="w-full py-3 rounded-xl font-medium text-xs bg-zinc-100 text-zinc-950 hover:bg-white shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
            >
              <QrCode className="w-4 h-4 text-zinc-900" />
              <span>Compartir Credencial Presencial</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 mt-2 font-mono">
              <Shield className="w-3 h-3 text-zinc-400" />
              <span>Emparejamiento efímero con control de consentimiento</span>
            </div>
          </div>
        </div>

        {/* Libreta de Conexiones */}
        <ConnectionsList
          connections={connections}
          mode={mode}
          onOpenExchange={handleOpenExchange}
          onUpdateNote={updatePrivateNote}
          onDeleteConnection={deleteConnection}
        />
      </main>

      {/* Modales */}
      <ExchangeModal
        isOpen={isExchangeOpen}
        onClose={() => setIsExchangeOpen(false)}
        mode={mode}
        currentProfile={currentProfile}
        session={currentSession}
        onRefreshSession={() => setCurrentSession(createExchangeSession())}
        onStartAffinityCheck={handleStartAffinityCheck}
      />

      {matchedPeer && calculatedAffinity && (
        <AffinityModal
          isOpen={isAffinityOpen}
          onClose={() => setIsAffinityOpen(false)}
          mode={mode}
          myProfile={currentProfile}
          peerProfile={matchedPeer}
          affinity={calculatedAffinity}
          onConfirmConnection={saveConnection}
        />
      )}

      <ProfileEditor
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={currentProfile}
        onSaveProfile={updateProfile}
      />
    </div>
  );
}

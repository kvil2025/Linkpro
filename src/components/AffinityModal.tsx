'use client';

import React, { useState } from 'react';
import { Profile, ProfileMode, AffinityResult, ContactMethod, SavedConnection } from '@/lib/types';
import {
  X,
  Shield,
  Check,
  ArrowRight,
  MapPin,
  Lock,
  Instagram,
  Phone,
  Linkedin,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffinityModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ProfileMode;
  myProfile: Profile;
  peerProfile: Profile;
  affinity: AffinityResult;
  onConfirmConnection: (newConn: SavedConnection) => void;
}

export const AffinityModal: React.FC<AffinityModalProps> = ({
  isOpen,
  onClose,
  mode,
  myProfile,
  peerProfile,
  affinity,
  onConfirmConnection,
}) => {
  const [step, setStep] = useState<'consent' | 'breakdown' | 'grants'>('consent');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>(
    myProfile.contacts.map((c) => c.id)
  );
  const [location, setLocation] = useState('Encuentro presencial');
  const [privateNote, setPrivateNote] = useState('');

  if (!isOpen) return null;

  const isPersonal = mode === 'personal';

  const toggleContact = (id: string) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinishConnection = () => {
    const contactsGrantedByPeer = peerProfile.contacts;

    const newConn: SavedConnection = {
      id: 'conn_' + Math.random().toString(36).substring(2, 9),
      sessionId: 'sess_' + Date.now(),
      mode,
      myProfileId: myProfile.id,
      otherProfile: {
        id: peerProfile.id,
        displayName: peerProfile.displayName,
        avatarUrl: peerProfile.avatarUrl,
        headline: peerProfile.headline,
        intent: peerProfile.intent,
      },
      metAtLocation: location,
      metAtTimestamp: new Date().toISOString(),
      affinityResult: affinity,
      contactsReceived: contactsGrantedByPeer,
      myGrantsGiven: selectedContactIds,
      privateNote: privateNote.trim() || undefined,
    };

    onConfirmConnection(newConn);
    onClose();
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-zinc-300" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-zinc-300" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-zinc-300" />;
      case 'email':
        return <Mail className="w-4 h-4 text-zinc-300" />;
      default:
        return <Send className="w-4 h-4 text-zinc-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-[#111318] border border-white/10 rounded-2xl p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* FASE 1: CONSENTIMIENTO MUTUO */}
        {step === 'consent' && (
          <div className="flex flex-col items-center text-center pt-2">
            <div className="flex items-center -space-x-3 mb-5">
              <img
                src={myProfile.avatarUrl}
                alt={myProfile.displayName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#111318]"
              />
              <img
                src={peerProfile.avatarUrl}
                alt={peerProfile.displayName}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#111318]"
              />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Verificación de Afinidad — Modo {isPersonal ? 'Personal' : 'Profesional'}
            </span>

            <h3 className="text-lg font-semibold text-zinc-100">
              Comparación con {peerProfile.displayName}
            </h3>
            <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed">
              El motor evaluará coincidencias y complementariedad sobre los criterios autorizados por ambas partes. Ningún dato de contacto privado será expuesto.
            </p>

            <div className="w-full mt-6 flex flex-col gap-2">
              <button
                onClick={() => setStep('breakdown')}
                className="w-full py-2.5 rounded-xl font-medium text-xs bg-zinc-100 text-zinc-950 hover:bg-white transition-all flex items-center justify-center gap-2"
              >
                <span>Autorizar y Ver Resultados</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        {/* FASE 2: DESGLOSE ANALÍTICO DE AFINIDAD */}
        {step === 'breakdown' && (
          <div className="flex flex-col">
            <div className="flex items-start justify-between pb-3.5 hairline-bottom">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                  Informe de Coincidencia
                </span>
                <h3 className="text-base font-semibold text-zinc-100">
                  {peerProfile.displayName}
                </h3>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl font-mono font-medium text-zinc-100">
                    {affinity.overallScore !== null ? `${affinity.overallScore}%` : '—'}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {affinity.overallCoverage}% cobertura
                </span>
              </div>
            </div>

            {/* Complementariedad Profesional */}
            {affinity.complementarityNotes && affinity.complementarityNotes.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-zinc-900/90 border border-white/5">
                <span className="text-xs font-medium text-zinc-200 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  Complementariedad Detectada:
                </span>
                <ul className="space-y-1 text-xs text-zinc-400">
                  {affinity.complementarityNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-zinc-500">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Categorías */}
            <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {affinity.categories.map((cat, idx) => (
                <div key={idx} className="p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-zinc-200">{cat.title}</span>
                    <span className="text-xs font-mono text-zinc-400">
                      {cat.score !== null ? `${cat.score}%` : 'Insuficiente'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{cat.explanation}</p>

                  {cat.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cat.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-white/5"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 pt-3 hairline-top">
              <button
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 transition-colors"
              >
                Declinar
              </button>
              <button
                onClick={() => setStep('grants')}
                className="w-2/3 py-2.5 rounded-xl text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all flex items-center justify-center gap-1.5"
              >
                <span>Conectar y Otorgar Datos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* FASE 3: OTORGAMIENTO SELECTIVO (CONTACT GRANTS) */}
        {step === 'grants' && (
          <div className="flex flex-col">
            <h3 className="text-base font-semibold text-zinc-100">
              Control de Revelación de Datos
            </h3>
            <p className="text-xs text-zinc-400 mt-1 mb-4 leading-relaxed">
              Selecciona qué canales autorizas transferir a {peerProfile.displayName}:
            </p>

            <div className="space-y-2 mb-4">
              {myProfile.contacts.map((contact) => {
                const isSelected = selectedContactIds.includes(contact.id);
                return (
                  <button
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left',
                      isSelected
                        ? 'bg-zinc-800/80 border-white/20 text-zinc-100'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:border-white/10'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300">
                        {getContactIcon(contact.type)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-200">{contact.label || contact.type}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">{contact.value}</p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'w-4 h-4 rounded-md flex items-center justify-center border transition-all',
                        isSelected
                          ? 'bg-zinc-100 border-zinc-100 text-zinc-950'
                          : 'border-zinc-700'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-3 hairline-top">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  Ubicación o Evento
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej: Conferencia Tech, Bar Vitacura..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-zinc-400" />
                  Nota Privada de Contexto (Solo para ti)
                </label>
                <textarea
                  rows={2}
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="ej: Conversamos sobre escalabilidad y fondos..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleFinishConnection}
              className="w-full mt-4 py-2.5 rounded-xl font-medium text-xs bg-zinc-100 text-zinc-950 hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Guardar Conexión en Bóveda</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

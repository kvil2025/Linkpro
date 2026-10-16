'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Profile, ProfileMode, ExchangeSession } from '@/lib/types';
import { X, Copy, Check, Clock, QrCode, KeyRound, Shield, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_PEERS } from '@/lib/mock-data';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ProfileMode;
  currentProfile: Profile;
  session: ExchangeSession | null;
  onRefreshSession: () => void;
  onStartAffinityCheck: (peerIndex: number) => void;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentProfile,
  session,
  onRefreshSession,
  onStartAffinityCheck,
}) => {
  const [tab, setTab] = useState<'qr' | 'code'>('qr');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [inputCode, setInputCode] = useState('');

  const isPersonal = mode === 'personal';
  const availablePeers = DEMO_PEERS[mode];

  useEffect(() => {
    if (!isOpen || !session) return;
    const expires = new Date(session.expiresAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expires - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, session]);

  if (!isOpen || !session) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const copyCode = () => {
    navigator.clipboard.writeText(session.shortCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrValue = `https://linkpro.id/handshake/${session.token}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[#111318] border border-white/10 rounded-2xl p-6 shadow-2xl relative flex flex-col items-center">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado de la Credencial */}
        <div className="w-full flex items-center justify-between pb-3 mb-4 hairline-bottom">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isPersonal ? 'bg-amber-400' : 'bg-emerald-400'
              )}
            />
            <span className="text-[11px] font-medium tracking-wide uppercase text-zinc-400">
              Credencial {isPersonal ? 'Personal' : 'Profesional'}
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            {formattedTime}
          </span>
        </div>

        {/* Selector Pestañas */}
        <div className="w-full grid grid-cols-2 bg-zinc-900/90 p-1 rounded-xl mb-5 border border-white/5">
          <button
            onClick={() => setTab('qr')}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              tab === 'qr' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <QrCode className="w-3.5 h-3.5" />
            Código QR
          </button>
          <button
            onClick={() => setTab('code')}
            className={cn(
              'flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              tab === 'code' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Ingreso Manual
          </button>
        </div>

        {tab === 'qr' ? (
          <div className="flex flex-col items-center w-full">
            {/* Contenedor del QR de Alta Precisión */}
            <div className="p-4 bg-white rounded-xl shadow-lg border border-neutral-200">
              <QRCodeSVG
                value={qrValue}
                size={190}
                level="M"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#0A0B0E"
              />
            </div>

            {/* Código Alfanumérico */}
            <div className="w-full mt-4 flex items-center justify-between bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                  Código de emparejamiento
                </span>
                <span className="text-xl font-mono font-semibold tracking-widest text-zinc-100">
                  {session.shortCode}
                </span>
              </div>
              <button
                onClick={copyCode}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                title="Copiar código"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>

            {/* Demostración Interactiva */}
            <div className="w-full mt-5 pt-4 hairline-top">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-zinc-400 font-medium">
                  Simular handshake presencial:
                </span>
              </div>

              <div className="space-y-1.5">
                {availablePeers.map((peer, idx) => (
                  <button
                    key={peer.id}
                    onClick={() => onStartAffinityCheck(idx)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/5 hover:border-white/10 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={peer.avatarUrl}
                        alt={peer.displayName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
                      />
                      <div>
                        <p className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {peer.displayName}
                        </p>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">
                          {peer.headline}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center py-3">
            <p className="text-xs text-zinc-400 text-center mb-4 leading-relaxed">
              Introduce los 6 dígitos proporcionados por el otro usuario para iniciar la verificación mutua:
            </p>
            <input
              type="text"
              maxLength={6}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000 000"
              className="w-full text-center text-2xl font-mono font-medium tracking-[0.25em] bg-zinc-900 border border-white/10 text-zinc-100 rounded-xl py-3 focus:outline-none focus:border-zinc-500 mb-4"
            />
            <button
              disabled={inputCode.length < 6}
              onClick={() => onStartAffinityCheck(0)}
              className={cn(
                'w-full py-2.5 rounded-xl font-medium text-xs transition-all',
                inputCode.length === 6
                  ? 'bg-zinc-100 text-zinc-900 hover:bg-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              )}
            >
              Comprobar Afinidad
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
          <Shield className="w-3 h-3 text-zinc-400" />
          <span>Ningún dato de contacto es transmitido en esta fase</span>
        </div>
      </div>
    </div>
  );
};

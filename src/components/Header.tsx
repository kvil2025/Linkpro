'use client';

import React from 'react';
import { ProfileMode, Profile } from '@/lib/types';
import { User, Shield, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  mode: ProfileMode;
  currentProfile: Profile;
  onModeChange: (mode: ProfileMode) => void;
  onOpenExchange: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  currentProfile,
  onModeChange,
  onOpenExchange,
  onOpenProfile,
}) => {
  const isPersonal = mode === 'personal';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel hairline-bottom px-4 py-2.5">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Identificador de Marca Minimalista */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-semibold text-xs tracking-wider text-zinc-100 shadow-inner">
            LP
          </div>
          <span className="font-semibold text-sm tracking-tight text-zinc-200">
            Link<span className="text-zinc-500 font-normal">Pro</span>
          </span>
        </div>

        {/* Control Segmentado Nativo (Personal vs Profesional) */}
        <div className="flex items-center bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/80">
          <button
            onClick={() => onModeChange('personal')}
            className={cn(
              'px-3 py-1 rounded-[6px] text-xs font-medium transition-all duration-150',
              isPersonal
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Personal
          </button>
          <button
            onClick={() => onModeChange('professional')}
            className={cn(
              'px-3 py-1 rounded-[6px] text-xs font-medium transition-all duration-150',
              !isPersonal
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            Profesional
          </button>
        </div>

        {/* Perfil del Usuario */}
        <button
          onClick={onOpenProfile}
          className="relative flex items-center gap-1.5 p-0.5 rounded-full hover:ring-1 hover:ring-zinc-600 transition-all"
          title="Configuración de Perfil"
        >
          {currentProfile?.avatarUrl ? (
            <img
              src={currentProfile.avatarUrl}
              alt={currentProfile.displayName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-zinc-700"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
          <span
            className={cn(
              'absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-black',
              isPersonal ? 'bg-amber-400' : 'bg-emerald-400'
            )}
          />
        </button>
      </div>
    </header>
  );
};

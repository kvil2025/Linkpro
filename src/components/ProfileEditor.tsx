'use client';

import React, { useState } from 'react';
import { Profile, ProfileMode, ContactType, ContactMethod } from '@/lib/types';
import { INTENT_LABELS } from '@/lib/affinity';
import { X, Check, Plus, Trash2, Shield, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onSaveProfile: (updated: Profile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [headline, setHeadline] = useState(profile.headline);
  const [intent, setIntent] = useState(profile.intent);
  const [contacts, setContacts] = useState<ContactMethod[]>(profile.contacts);

  const [newType, setNewType] = useState<ContactType>('instagram');
  const [newValue, setNewValue] = useState('');

  if (!isOpen) return null;

  const isPersonal = profile.mode === 'personal';

  const handleAddContact = () => {
    if (!newValue.trim()) return;
    const newContact: ContactMethod = {
      id: 'cnt_' + Date.now(),
      profileId: profile.id,
      type: newType,
      value: newValue.trim(),
      label: newType.toUpperCase(),
      isPrivate: true,
    };
    setContacts([...contacts, newContact]);
    setNewValue('');
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    onSaveProfile({
      ...profile,
      displayName: displayName.trim() || profile.displayName,
      headline: headline.trim() || profile.headline,
      intent,
      contacts,
    });
    onClose();
  };

  const personalIntents = ['conocer_gente', 'amistad', 'citas', 'actividades'];
  const professionalIntents = ['socios', 'inversion', 'empleo', 'clientes', 'colaboradores'];
  const availableIntents = isPersonal ? personalIntents : professionalIntents;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-md bg-[#111318] border border-white/10 rounded-2xl p-6 shadow-2xl relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            Ajustes de Perfil — {isPersonal ? 'Personal' : 'Profesional'}
          </span>
        </div>

        <h3 className="text-base font-semibold text-zinc-100 mb-4">
          Configuración de Identidad
        </h3>

        <div className="space-y-4">
          {/* Nombre visible */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
              Nombre Público
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Titular */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
              {isPersonal ? 'Descripción o Intereses' : 'Cargo o Especialidad Profesional'}
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Intención */}
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Objetivo en este Modo
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {availableIntents.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setIntent(item as any)}
                  className={cn(
                    'p-2 rounded-xl text-xs font-medium border text-left transition-all',
                    intent === item
                      ? 'bg-zinc-800 border-white/20 text-zinc-100'
                      : 'bg-zinc-900/40 border-white/5 text-zinc-400 hover:text-zinc-200'
                  )}
                >
                  {INTENT_LABELS[item] || item}
                </button>
              ))}
            </div>
          </div>

          {/* Bóveda de Contactos */}
          <div className="pt-3 hairline-top">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                Bóveda de Contactos Privados
              </label>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                <Lock className="w-2.5 h-2.5 text-zinc-400" />
                Solo bajo consentimiento
              </span>
            </div>

            <div className="space-y-1.5 mb-2.5 mt-2">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 bg-zinc-900/60 rounded-xl border border-white/5 text-xs"
                >
                  <div>
                    <span className="font-mono text-zinc-400 uppercase text-[10px] mr-2">
                      {c.type}:
                    </span>
                    <span className="font-mono text-zinc-200 text-xs">{c.value}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(c.id)}
                    className="p-1 hover:text-red-400 text-zinc-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-1.5">
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as ContactType)}
                className="bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="instagram">Instagram</option>
                <option value="phone">Móvil / WA</option>
                <option value="linkedin">LinkedIn</option>
                <option value="email">Email</option>
                <option value="portfolio">Portfolio</option>
              </select>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Identificador o enlace..."
                className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
              />
              <button
                onClick={handleAddContact}
                className="px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-5 py-2.5 rounded-xl font-medium text-xs bg-zinc-100 text-zinc-950 hover:bg-white transition-all flex items-center justify-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Guardar Configuración</span>
        </button>
      </div>
    </div>
  );
};

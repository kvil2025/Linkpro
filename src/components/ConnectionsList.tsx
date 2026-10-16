'use client';

import React, { useState } from 'react';
import { SavedConnection, ProfileMode, ContactMethod } from '@/lib/types';
import {
  MapPin,
  Calendar,
  Lock,
  Instagram,
  Phone,
  Linkedin,
  Mail,
  Send,
  Trash2,
  Edit3,
  Check,
  ExternalLink,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionsListProps {
  connections: SavedConnection[];
  mode: ProfileMode;
  onOpenExchange: () => void;
  onUpdateNote: (connectionId: string, note: string) => void;
  onDeleteConnection: (connectionId: string) => void;
}

export const ConnectionsList: React.FC<ConnectionsListProps> = ({
  connections,
  mode,
  onOpenExchange,
  onUpdateNote,
  onDeleteConnection,
}) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  const isPersonal = mode === 'personal';

  const startEditNote = (conn: SavedConnection) => {
    setEditingNoteId(conn.id);
    setDraftNote(conn.privateNote || '');
  };

  const saveNote = (connId: string) => {
    onUpdateNote(connId, draftNote.trim());
    setEditingNoteId(null);
  };

  const getContactLink = (contact: ContactMethod) => {
    switch (contact.type) {
      case 'instagram':
        return `https://instagram.com/${contact.value.replace('@', '')}`;
      case 'phone':
        return `https://wa.me/${contact.value.replace(/[^0-9]/g, '')}`;
      case 'linkedin':
        return contact.value.startsWith('http') ? contact.value : `https://${contact.value}`;
      case 'email':
        return `mailto:${contact.value}`;
      default:
        return contact.value.startsWith('http') ? contact.value : `https://${contact.value}`;
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5 text-zinc-300" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5 text-zinc-300" />;
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5 text-zinc-300" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-zinc-300" />;
      default:
        return <Send className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-[#111318] border border-white/5 rounded-2xl mt-4">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center mb-3 text-zinc-400">
          <QrCode className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-200">
          Sin conexiones guardadas en Modo {isPersonal ? 'Personal' : 'Profesional'}
        </h4>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs mb-4 leading-relaxed">
          {isPersonal
            ? 'Presenta tu código QR efímero para conectar con personas en eventos y evaluar compatibilidad mutua.'
            : 'Establece contactos con socios o colaboradores verificando complementariedad antes de compartir datos.'}
        </p>
        <button
          onClick={onOpenExchange}
          className="px-4 py-2 rounded-xl text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-white transition-all flex items-center gap-1.5"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Generar Credencial QR</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Conexiones en Bóveda ({connections.length})
        </h3>
        <span className="text-[11px] text-zinc-400 font-mono">
          {isPersonal ? 'Directorio Personal' : 'Directorio Pro'}
        </span>
      </div>

      {connections.map((conn) => {
        const dateObj = new Date(conn.metAtTimestamp);
        const formattedDate = dateObj.toLocaleDateString('es-CL', {
          day: 'numeric',
          month: 'short',
        });

        return (
          <div
            key={conn.id}
            className="p-4 rounded-xl bg-[#111318] border border-white/5 hover:border-white/10 transition-all shadow-sm"
          >
            {/* Cabecera */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={conn.otherProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                  alt={conn.otherProfile.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                />
                <div>
                  <h4 className="text-xs font-semibold text-zinc-100">
                    {conn.otherProfile.displayName}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">
                    {conn.otherProfile.headline}
                  </p>
                </div>
              </div>

              {/* Métrica de Afinidad */}
              <div className="text-right">
                <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-zinc-900 border border-white/5 text-zinc-200">
                  {conn.affinityResult.overallScore}%
                </span>
              </div>
            </div>

            {/* Metadatos de Encuentro */}
            <div className="flex items-center gap-3 mt-2.5 text-[10px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-zinc-400" />
                {formattedDate}
              </span>
              {conn.metAtLocation && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-zinc-400" />
                  {conn.metAtLocation}
                </span>
              )}
            </div>

            {/* Canales Autorizados Recibidos */}
            <div className="mt-3 pt-2.5 hairline-top">
              <div className="flex flex-wrap gap-1.5">
                {conn.contactsReceived.map((cnt) => (
                  <a
                    key={cnt.id}
                    href={getContactLink(cnt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[11px] font-medium text-zinc-200 border border-white/5 transition-colors"
                  >
                    {getContactIcon(cnt.type)}
                    <span className="font-mono">{cnt.value}</span>
                    <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nota Privada */}
            <div className="mt-3 p-2.5 rounded-lg bg-zinc-950/60 border border-white/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-zinc-400" />
                  Nota privada
                </span>
                {editingNoteId !== conn.id && (
                  <button
                    onClick={() => startEditNote(conn)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Editar</span>
                  </button>
                )}
              </div>

              {editingNoteId === conn.id ? (
                <div className="mt-1">
                  <textarea
                    rows={2}
                    value={draftNote}
                    onChange={(e) => setDraftNote(e.target.value)}
                    placeholder="Añade contexto o recordatorio..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-1.5">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="px-2 py-0.5 text-[10px] text-zinc-400 hover:text-zinc-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => saveNote(conn.id)}
                      className="px-2.5 py-0.5 bg-zinc-200 text-zinc-950 rounded text-[10px] font-medium"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-zinc-400 italic">
                  {conn.privateNote ? `“${conn.privateNote}”` : 'Sin nota registrada.'}
                </p>
              )}
            </div>

            {/* Eliminar */}
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={() => onDeleteConnection(conn.id)}
                className="text-[10px] text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors py-0.5 px-1.5"
                title="Revocar y eliminar"
              >
                <Trash2 className="w-3 h-3" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

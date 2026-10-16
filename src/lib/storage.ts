'use client';

import { useState, useEffect } from 'react';
import { Profile, ProfileMode, SavedConnection, ExchangeSession, AffinityResult, ContactMethod } from './types';
import { INITIAL_PROFILES, INITIAL_SAVED_CONNECTIONS, DEMO_PEERS } from './mock-data';
import { calculateAffinity } from './affinity';

const PROFILES_STORAGE_KEY = 'linkpro_profiles_v1';
const CONNECTIONS_STORAGE_KEY = 'linkpro_connections_v1';
const MODE_STORAGE_KEY = 'linkpro_mode_v1';

export function useLinkProStore() {
  const [mode, setModeState] = useState<ProfileMode>('personal');
  const [profiles, setProfiles] = useState<Record<ProfileMode, Profile>>(INITIAL_PROFILES);
  const [connections, setConnections] = useState<SavedConnection[]>(INITIAL_SAVED_CONNECTIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar estado inicial desde localStorage si existe
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(MODE_STORAGE_KEY);
      if (savedMode === 'personal' || savedMode === 'professional') {
        setModeState(savedMode);
      }

      const savedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (savedProfiles) {
        setProfiles(JSON.parse(savedProfiles));
      }

      const savedConn = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
      if (savedConn) {
        setConnections(JSON.parse(savedConn));
      }
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setMode = (newMode: ProfileMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(MODE_STORAGE_KEY, newMode);
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = (updatedProfile: Profile) => {
    const updated = {
      ...profiles,
      [updatedProfile.mode]: updatedProfile,
    };
    setProfiles(updated);
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveConnection = (newConnection: SavedConnection) => {
    const updated = [newConnection, ...connections.filter((c) => c.id !== newConnection.id)];
    setConnections(updated);
    try {
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updatePrivateNote = (connectionId: string, noteContent: string) => {
    const updated = connections.map((c) => {
      if (c.id === connectionId) {
        return { ...c, privateNote: noteContent };
      }
      return c;
    });
    setConnections(updated);
    try {
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteConnection = (connectionId: string) => {
    const updated = connections.filter((c) => c.id !== connectionId);
    setConnections(updated);
    try {
      localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Generar sesión efímera
  const createExchangeSession = (): ExchangeSession => {
    const currentProfile = profiles[mode];
    const token = 'tok_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const shortCode = Math.floor(100000 + Math.random() * 900000).toString();

    return {
      id: 'sess_' + Math.random().toString(36).substring(2, 9),
      initiatorProfileId: currentProfile.id,
      token,
      shortCode,
      mode,
      initiatorConsent: false,
      joinerConsent: false,
      status: 'pending',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutos TTL
      createdAt: new Date().toISOString(),
    };
  };

  // Simulación interactiva de emparejamiento con un peer demo
  const simulatePeerJoin = (session: ExchangeSession, peerIndex = 0): {
    peerProfile: Profile;
    affinity: AffinityResult;
  } => {
    const peersList = DEMO_PEERS[session.mode];
    const peerProfile = peersList[peerIndex % peersList.length];
    const myProfile = profiles[session.mode];

    const affinity = calculateAffinity(myProfile, peerProfile, session.mode);
    return { peerProfile, affinity };
  };

  return {
    isLoaded,
    mode,
    setMode,
    currentProfile: profiles[mode],
    profiles,
    updateProfile,
    connections: connections.filter((c) => c.mode === mode),
    allConnections: connections,
    saveConnection,
    updatePrivateNote,
    deleteConnection,
    createExchangeSession,
    simulatePeerJoin,
  };
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getDeviceType, type RemoteAction } from '@/lib/remoteSyncTypes';

export interface RemotePlayerState {
  sessionId: string;
  deviceType: 'mobile' | 'desktop';
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  rate: number;
  title: string;
  program?: string;
  exerciseIndex?: number;
  totalExercises?: number;
  exerciseName?: string;
  chapter?: number;
  totalChapters?: number;
  ts: number;
}

interface RemoteSyncContextValue {
  /** Players visible to this device (excluding self) */
  remotePlayers: RemotePlayerState[];
  /** Local session ids currently broadcasting from this tab */
  localSessionIds: Set<string>;
  /** Whether controller overlay should be visible right now */
  controllerActive: boolean;
  showController: boolean;
  setShowController: (v: boolean) => void;
  sendCommand: (targetSessionId: string, action: RemoteAction) => void;
  registerLocalPlayer: (sessionId: string) => void;
  unregisterLocalPlayer: (sessionId: string) => void;
}

const RemoteSyncContext = createContext<RemoteSyncContextValue | undefined>(undefined);

const STALE_MS = 8000;

export const RemoteSyncProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Record<string, RemotePlayerState>>({});
  const [showController, setShowController] = useState(false);
  const localIdsRef = useRef<Set<string>>(new Set());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const registerLocalPlayer = useCallback((id: string) => {
    localIdsRef.current.add(id);
  }, []);
  const unregisterLocalPlayer = useCallback((id: string) => {
    localIdsRef.current.delete(id);
    setPlayers((p) => {
      if (!p[id]) return p;
      const n = { ...p };
      delete n[id];
      return n;
    });
  }, []);

  // Subscribe to channel as observer
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel(`remote-sync:${user.id}`, {
      config: { broadcast: { self: false, ack: false } },
    });
    channelRef.current = channel;

    channel.on('broadcast', { event: 'player:state' }, ({ payload }: any) => {
      if (!payload?.sessionId) return;
      if (localIdsRef.current.has(payload.sessionId)) return;
      setPlayers((prev) => ({ ...prev, [payload.sessionId]: payload }));
    });
    channel.on('broadcast', { event: 'player:bye' }, ({ payload }: any) => {
      if (!payload?.sessionId) return;
      setPlayers((prev) => {
        if (!prev[payload.sessionId]) return prev;
        const n = { ...prev };
        delete n[payload.sessionId];
        return n;
      });
    });
    channel.subscribe();

    // Stale cleaner
    const interval = setInterval(() => {
      setPlayers((prev) => {
        const now = Date.now();
        let changed = false;
        const next: Record<string, RemotePlayerState> = {};
        for (const [k, v] of Object.entries(prev)) {
          if (now - v.ts < STALE_MS) next[k] = v;
          else changed = true;
        }
        return changed ? next : prev;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user]);

  const sendCommand = useCallback((targetSessionId: string, action: RemoteAction) => {
    const ch = channelRef.current;
    if (!ch) return;
    ch.send({
      type: 'broadcast',
      event: 'cmd',
      payload: { targetSessionId, action },
    });
  }, []);

  const remotePlayers = useMemo(() => Object.values(players), [players]);

  // Auto-controller: this device is mobile AND another device (desktop) is playing
  const isMobile = getDeviceType() === 'mobile';
  const controllerActive = useMemo(() => {
    if (!isMobile) return false;
    // No local active player on this device
    if (localIdsRef.current.size > 0) return false;
    return remotePlayers.some((p) => p.deviceType === 'desktop');
  }, [isMobile, remotePlayers]);

  const value: RemoteSyncContextValue = {
    remotePlayers,
    localSessionIds: localIdsRef.current,
    controllerActive,
    showController: showController || controllerActive,
    setShowController,
    sendCommand,
    registerLocalPlayer,
    unregisterLocalPlayer,
  };

  return <RemoteSyncContext.Provider value={value}>{children}</RemoteSyncContext.Provider>;
};

export const useRemoteSync = () => {
  const ctx = useContext(RemoteSyncContext);
  if (!ctx) throw new Error('useRemoteSync must be used within RemoteSyncProvider');
  return ctx;
};

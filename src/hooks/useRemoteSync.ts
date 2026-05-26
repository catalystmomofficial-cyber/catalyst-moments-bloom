import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRemoteSync as useRemoteSyncCtx } from '@/contexts/RemoteSyncContext';
import { getDeviceType, type RemoteAction, type RemotePlayerMeta } from '@/lib/remoteSyncTypes';

interface UseRemoteSyncOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  meta: RemotePlayerMeta;
  /** Handle non-video actions (next/prev/mark-complete/chapter) */
  onAction?: (action: RemoteAction) => void;
  enabled?: boolean;
}

/**
 * Attach a video element to the user's remote-sync channel so any other
 * device logged into the same account can act as a controller.
 */
export function useRemoteSync({ videoRef, meta, onAction, enabled = true }: UseRemoteSyncOptions) {
  const { user } = useAuth();
  const { registerLocalPlayer, unregisterLocalPlayer } = useRemoteSyncCtx();
  const sessionIdRef = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  const broadcastState = useCallback(() => {
    if (!user) return;
    const v = videoRef.current;
    const ch = channelRef.current;
    if (!ch || !v) return;
    ch.send({
      type: 'broadcast',
      event: 'player:state',
      payload: {
        sessionId: sessionIdRef.current,
        deviceType: getDeviceType(),
        isPlaying: !v.paused,
        currentTime: v.currentTime || 0,
        duration: isFinite(v.duration) ? v.duration : 0,
        volume: v.volume,
        rate: v.playbackRate,
        ...metaRef.current,
        ts: Date.now(),
      },
    });
  }, [user, videoRef]);

  useEffect(() => {
    if (!enabled || !user) return;
    const v = videoRef.current;
    if (!v) return;

    registerLocalPlayer(sessionIdRef.current);

    const channel = supabase.channel(`remote-sync-player:${user.id}:${sessionIdRef.current}`, {
      config: { broadcast: { self: false, ack: false } },
    });
    channelRef.current = channel;

    channel.on('broadcast', { event: 'cmd' }, ({ payload }: any) => {
      if (payload?.targetSessionId !== sessionIdRef.current) return;
      const action: RemoteAction = payload.action;
      const vid = videoRef.current;
      if (!vid) return;
      switch (action.type) {
        case 'play':
          vid.play().catch(() => {});
          break;
        case 'pause':
          vid.pause();
          break;
        case 'seek':
          vid.currentTime = Math.max(0, Math.min(vid.duration || 0, action.value));
          break;
        case 'seek-relative':
          vid.currentTime = Math.max(0, Math.min(vid.duration || 0, vid.currentTime + action.value));
          break;
        case 'volume':
          vid.volume = Math.max(0, Math.min(1, action.value));
          break;
        case 'rate':
          vid.playbackRate = action.value;
          break;
        case 'next':
        case 'prev':
        case 'mark-complete':
        case 'chapter':
          onActionRef.current?.(action);
          break;
      }
      setTimeout(broadcastState, 50);
    });

    // Also listen on the shared user channel for commands
    const sharedChannel = supabase.channel(`remote-sync:${user.id}`, {
      config: { broadcast: { self: false, ack: false } },
    });
    sharedChannel.on('broadcast', { event: 'cmd' }, ({ payload }: any) => {
      if (payload?.targetSessionId !== sessionIdRef.current) return;
      const action: RemoteAction = payload.action;
      const vid = videoRef.current;
      if (!vid) return;
      switch (action.type) {
        case 'play': vid.play().catch(() => {}); break;
        case 'pause': vid.pause(); break;
        case 'seek': vid.currentTime = Math.max(0, Math.min(vid.duration || 0, action.value)); break;
        case 'seek-relative': vid.currentTime = Math.max(0, Math.min(vid.duration || 0, vid.currentTime + action.value)); break;
        case 'volume': vid.volume = Math.max(0, Math.min(1, action.value)); break;
        case 'rate': vid.playbackRate = action.value; break;
        case 'next':
        case 'prev':
        case 'mark-complete':
        case 'chapter':
          onActionRef.current?.(action);
          break;
      }
      setTimeout(() => broadcastSharedState(sharedChannel), 50);
    });

    const broadcastSharedState = (ch: typeof sharedChannel) => {
      const vid = videoRef.current;
      if (!vid) return;
      ch.send({
        type: 'broadcast',
        event: 'player:state',
        payload: {
          sessionId: sessionIdRef.current,
          deviceType: getDeviceType(),
          isPlaying: !vid.paused,
          currentTime: vid.currentTime || 0,
          duration: isFinite(vid.duration) ? vid.duration : 0,
          volume: vid.volume,
          rate: vid.playbackRate,
          ...metaRef.current,
          ts: Date.now(),
        },
      });
    };

    sharedChannel.subscribe((status) => {
      if (status === 'SUBSCRIBED') broadcastSharedState(sharedChannel);
    });
    channel.subscribe();

    let last = 0;
    const onTime = () => {
      const now = Date.now();
      if (now - last < 1000) return;
      last = now;
      broadcastSharedState(sharedChannel);
    };
    const onChange = () => broadcastSharedState(sharedChannel);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onChange);
    v.addEventListener('pause', onChange);
    v.addEventListener('volumechange', onChange);
    v.addEventListener('ratechange', onChange);
    v.addEventListener('loadedmetadata', onChange);
    v.addEventListener('ended', onChange);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onChange);
      v.removeEventListener('pause', onChange);
      v.removeEventListener('volumechange', onChange);
      v.removeEventListener('ratechange', onChange);
      v.removeEventListener('loadedmetadata', onChange);
      v.removeEventListener('ended', onChange);
      sharedChannel.send({
        type: 'broadcast',
        event: 'player:bye',
        payload: { sessionId: sessionIdRef.current },
      });
      supabase.removeChannel(channel);
      supabase.removeChannel(sharedChannel);
      channelRef.current = null;
      unregisterLocalPlayer(sessionIdRef.current);
    };
  }, [user, enabled, videoRef, broadcastState, registerLocalPlayer, unregisterLocalPlayer]);

  useEffect(() => {
    broadcastState();
  }, [meta.exerciseIndex, meta.title, meta.exerciseName, meta.chapter, broadcastState]);
}

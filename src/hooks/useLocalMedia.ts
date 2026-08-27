import { useCallback, useEffect, useRef, useState } from "react";

export type MediaState = {
  stream: MediaStream | null;
  error: string | null;
  ready: boolean;
  micOn: boolean;
  camOn: boolean;
  level: number;
  devices: { audio: MediaDeviceInfo[]; video: MediaDeviceInfo[]; output: MediaDeviceInfo[] };
  audioDeviceId?: string | undefined;
  videoDeviceId?: string | undefined;
  outputDeviceId?: string | undefined;
};

type Options = { audio?: boolean; video?: boolean };

/**
 * Média local stabilisé : un seul getUserMedia par changement de périphérique,
 * les toggles micro/caméra agissent sur `track.enabled` (pas de re-négociation,
 * donc pas de clignotement vidéo).
 */
export function useLocalMedia(opts: Options = {}) {
  const { audio = true, video = true } = opts;
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [level, setLevel] = useState(0);
  const [devices, setDevices] = useState<{
    audio: MediaDeviceInfo[];
    video: MediaDeviceInfo[];
    output: MediaDeviceInfo[];
  }>({ audio: [], video: [], output: [] });
  const [audioDeviceId, setAudioDeviceId] = useState<string | undefined>(undefined);
  const [videoDeviceId, setVideoDeviceId] = useState<string | undefined>(undefined);
  const [outputDeviceId, setOutputDeviceId] = useState<string | undefined>(undefined);

  const stopMeter = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
  }, []);

  const startMeter = useCallback(
    (s: MediaStream) => {
      stopMeter();
      if (s.getAudioTracks().length === 0) return;
      try {
        const Ctx: typeof AudioContext =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        audioCtxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(s).connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        const loop = () => {
          analyser.getByteTimeDomainData(data);
          let peak = 0;
          for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
          setLevel((prev) => prev * 0.7 + peak * 0.3);
          rafRef.current = requestAnimationFrame(loop);
        };
        loop();
      } catch {
        /* VU-mètre indisponible */
      }
    },
    [stopMeter],
  );

  const refreshDevices = useCallback(async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        audio: list.filter((d) => d.kind === "audioinput"),
        video: list.filter((d) => d.kind === "videoinput"),
        output: list.filter((d) => d.kind === "audiooutput"),
      });
    } catch {
      /* ignore */
    }
  }, []);

  const acquire = useCallback(
    async (aId?: string, vId?: string) => {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        setError("Votre navigateur ne prend pas en charge la capture audio/vidéo.");
        setReady(true);
        return;
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      stopMeter();
      try {
        const next = await navigator.mediaDevices.getUserMedia({
          audio: audio ? (aId ? { deviceId: { exact: aId } } : true) : false,
          video: video
            ? {
                ...(vId ? { deviceId: { exact: vId } } : {}),
                width: { ideal: 1280 },
                height: { ideal: 720 },
                frameRate: { ideal: 30, max: 30 },
              }
            : false,
        });
        streamRef.current = next;
        setStream(next);
        setError(null);
        next.getAudioTracks().forEach((t) => (t.enabled = micOn));
        next.getVideoTracks().forEach((t) => (t.enabled = camOn));
        startMeter(next);
        void refreshDevices();
      } catch (e) {
        const name = (e as DOMException)?.name;
        setError(
          name === "NotAllowedError"
            ? "Accès micro/caméra refusé. Autorisez l'accès dans votre navigateur pour rejoindre en vidéo."
            : name === "NotFoundError"
              ? "Aucun périphérique audio/vidéo détecté."
              : "Impossible d'initialiser la caméra ou le micro.",
        );
        setStream(null);
      } finally {
        setReady(true);
      }
    },
    // micOn/camOn volontairement hors deps : appliqués via track.enabled
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [audio, video, refreshDevices, startMeter, stopMeter],
  );

  useEffect(() => {
    void acquire(audioDeviceId, videoDeviceId);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      stopMeter();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioDeviceId, videoDeviceId]);

  const toggleMic = useCallback(() => {
    setMicOn((prev) => {
      const next = !prev;
      streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  }, []);

  const toggleCam = useCallback(() => {
    setCamOn((prev) => {
      const next = !prev;
      streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = next));
      return next;
    });
  }, []);

  const setMic = useCallback((on: boolean) => {
    setMicOn(on);
    streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = on));
  }, []);

  const setCam = useCallback((on: boolean) => {
    setCamOn(on);
    streamRef.current?.getVideoTracks().forEach((t) => (t.enabled = on));
  }, []);

  /** Joue un court bip de test sur la sortie audio sélectionnée. */
  const testOutput = useCallback(async () => {
    try {
      const ctx = new AudioContext();
      const dest = ctx.createMediaStreamDestination();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 660;
      gain.gain.value = 0.12;
      osc.connect(gain).connect(dest);
      const el = document.createElement("audio");
      el.srcObject = dest.stream;
      const withSink = el as HTMLAudioElement & { setSinkId?: (id: string) => Promise<void> };
      if (outputDeviceId && typeof withSink.setSinkId === "function") {
        await withSink.setSinkId(outputDeviceId).catch(() => {});
      }
      await el.play().catch(() => {});
      osc.start();
      setTimeout(() => {
        osc.stop();
        el.pause();
        el.srcObject = null;
        void ctx.close();
      }, 700);
      return true;
    } catch {
      return false;
    }
  }, [outputDeviceId]);

  const [supportsOutputSelection, setSupportsOutputSelection] = useState(false);
  useEffect(() => {
    setSupportsOutputSelection("setSinkId" in HTMLMediaElement.prototype);
  }, []);

  const state: MediaState = {
    stream,
    error,
    ready,
    micOn,
    camOn,
    level,
    devices,
    audioDeviceId,
    videoDeviceId,
    outputDeviceId,
  };

  return {
    ...state,
    supportsOutputSelection,
    toggleMic,
    toggleCam,
    setMic,
    setCam,
    setAudioDeviceId,
    setVideoDeviceId,
    setOutputDeviceId,
    testOutput,
    retry: () => acquire(audioDeviceId, videoDeviceId),
  };
}

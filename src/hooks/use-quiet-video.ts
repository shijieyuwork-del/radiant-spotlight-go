import { useCallback, useEffect, useRef, useState } from "react";

/** Video never starts here automatically: only an explicit play action may start it. */
export function useQuietVideo(sourceKey: string, enabled = true) {
  const ref = useRef<HTMLVideoElement>(null);
  const [element, setElement] = useState<HTMLVideoElement | null>(null);
  const attachRef = useCallback((video: HTMLVideoElement | null) => {
    ref.current = video;
    setElement(video);
  }, []);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const [playing, setPlaying] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);

  const pause = useCallback(() => {
    ref.current?.pause();
    setPlaying(false);
  }, []);

  useEffect(() => {
    const video = element;
    if (!video) return;
    setPlaying(!video.paused);
    setPlaybackFailed(false);
    if (!enabled) video.pause();

    const onPlay = () => {
      if (!enabled || document.hidden) {
        video.pause();
        return;
      }
      // Include native-control players, so opening another diary also stops audio.
      document.querySelectorAll<HTMLMediaElement>("video, audio").forEach((other) => {
        if (other !== video && !other.paused) other.pause();
      });
      setPlaying(true);
      setPlaybackFailed(false);
    };
    const onPause = () => setPlaying(false);
    const onError = () => { setPlaying(false); setPlaybackFailed(true); };
    const onVisibility = () => { if (document.hidden) video.pause(); };
    const onOtherPlay = (event: Event) => { if (event.target !== video && !video.paused) video.pause(); };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onPause);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("play", onOtherPlay, true);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.15) video.pause();
      // Returning to the screen never resumes a video the visitor paused.
    }, { threshold: [0, 0.15] });
    observer?.observe(video);
    return () => {
      observer?.disconnect();
      video.pause();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onPause);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("play", onOtherPlay, true);
    };
  }, [element, sourceKey, enabled]);

  const play = useCallback(async () => {
    const video = ref.current;
    if (!video || !enabledRef.current || document.hidden) return false;
    setPlaybackFailed(false);
    try {
      await video.play();
      return !video.paused;
    } catch {
      setPlaying(false);
      setPlaybackFailed(true);
      return false;
    }
  }, []);

  const toggle = useCallback(() => {
    if (ref.current?.paused) void play();
    else pause();
  }, [play, pause]);

  return { ref, attachRef, playing, playbackFailed, play, pause, toggle };
}

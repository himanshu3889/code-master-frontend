import { useCallback, useEffect, useState } from 'react';

export default function useFullScreen() {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState<boolean>();

  const toggleFullScreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const fullscreenChangeHandler = (_e: Event) => {
      if (!document.fullscreenElement) {
        setIsFullScreenEnabled(false);
      } else {
        setIsFullScreenEnabled(true);
      }
    };
    document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    return () => {
      document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
    };
  }, []);

  return { isFullScreenEnabled, toggleFullScreen };
}

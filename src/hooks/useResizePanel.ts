import React, { useCallback, useEffect, useState } from 'react';
interface SizeState {
  div1: number;
  div2: number;
}
export default function useResizePanel({
  initialSize,
  containerRef,
  resizeHandler,
}: {
  initialSize: { div1: number; div2: number };
  containerRef: React.RefObject<HTMLDivElement>;
  resizeHandler: (e: any) => SizeState | null;
}) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sizes, setSizes] = useState<SizeState>(initialSize);

  const startDragging = useCallback((e: any) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resize = useCallback(
    (e: any) => {
      if (!isDragging || !containerRef.current) {
        return;
      }
      const caluclatedSizes = resizeHandler(e);
      if (caluclatedSizes) {
        setSizes({
          div1: caluclatedSizes.div1,
          div2: caluclatedSizes.div2,
        });
      }
    },
    [isDragging]
  );
  useEffect(() => {
    const handleMouseMove = (e: any) => {
      resize(e);
    };

    const handleMouseUp = () => {
      stopDragging();
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, resize, stopDragging]);

  return {
    sizes,
    startDragging,
  };
}

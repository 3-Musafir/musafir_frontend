import type { TouchEvent } from "react";
import { useCallback, useRef, useState } from "react";

type SwipeHandlers = {
  onTouchStart: (event: TouchEvent) => void;
  onTouchMove: (event: TouchEvent) => void;
  onTouchEnd: () => void;
};

interface UseSwipeCarouselOptions {
  thresholdPx?: number;
  onIndexChange?: (index: number) => void;
  onSwipe?: () => void;
}

export function useSwipeCarousel(
  length: number,
  options: UseSwipeCarouselOptions = {},
): { index: number; setIndex: (index: number) => void; bind: SwipeHandlers } {
  const { thresholdPx = 40, onIndexChange, onSwipe } = options;
  const [index, setIndexState] = useState(0);
  const startXRef = useRef<number | null>(null);
  const swipedRef = useRef(false);

  const setIndex = useCallback(
    (nextIndex: number) => {
      setIndexState(nextIndex);
      if (onIndexChange) {
        onIndexChange(nextIndex);
      }
    },
    [onIndexChange],
  );

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    if (length <= 1) return;
    startXRef.current = event.touches[0]?.clientX ?? null;
    swipedRef.current = false;
  }, [length]);

  const onTouchMove = useCallback(
    (event: React.TouchEvent) => {
      if (length <= 1) return;
      if (swipedRef.current) return;
      const startX = startXRef.current;
      if (startX === null) return;
      const currentX = event.touches[0]?.clientX ?? startX;
      const deltaX = currentX - startX;
      if (Math.abs(deltaX) < thresholdPx) return;

      const direction = deltaX < 0 ? 1 : -1;
      const nextIndex = (index + direction + length) % length;
      setIndex(nextIndex);
      swipedRef.current = true;
      if (onSwipe) {
        onSwipe();
      }
    },
    [index, length, onSwipe, setIndex, thresholdPx],
  );

  const onTouchEnd = useCallback(() => {
    startXRef.current = null;
    swipedRef.current = false;
  }, []);

  return { index, setIndex, bind: { onTouchStart, onTouchMove, onTouchEnd } };
}

import { useRef } from "react";

interface Swipe {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export function useSwipe({ onSwipeLeft, onSwipeRight }: Swipe) {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      onSwipeLeft();
    } else if (diff < -50) {
      onSwipeRight();
    }

    touchStartX.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}
import { useRef } from "react";

export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
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

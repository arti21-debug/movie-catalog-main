import { useRef } from "react";

interface Swipe {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

// хук свайпов по горизонтали для тач-устройств:
// свайп влево вызывает onSwipeLeft, вправо — onSwipeRight
export function useSwipe({ onSwipeLeft, onSwipeRight }: Swipe) {
  // X-координата начала касания; ref, а не state, потому что перерисовка не нужна
  const touchStartX = useRef<number | null>(null);

  // запоминаем, где палец коснулся экрана (берём первое касание)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // если начало касания не было зафиксировано, ничего не делаем
    if (touchStartX.current === null) return;

    // положение пальца в момент отрыва и смещение по оси X;
    // diff > 0 — палец ушёл влево, diff < 0 — вправо
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // свайпом считается смещение больше 50px, короткие движения игнорируются
    if (diff > 50) {
      onSwipeLeft();
    } else if (diff < -50) {
      onSwipeRight();
    }

    // сбрасываем, чтобы следующее касание считалось с чистого листа
    touchStartX.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}
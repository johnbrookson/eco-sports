"use client";

import { useEffect, useRef, useCallback, type ReactNode } from "react";

interface AutoCarouselProps {
  children: ReactNode;
  interval?: number;
  className?: string;
}

export function AutoCarousel({
  children,
  interval = 3000,
  className = "",
}: AutoCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  const scrollNext = useCallback(() => {
    const el = ref.current;
    if (!el || isPaused.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    if (scrollLeft >= maxScroll - 2) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      const cardWidth =
        (el.querySelector("[data-carousel-item]") as HTMLElement)
          ?.offsetWidth ?? 224;
      const gap = 20;
      el.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const id = setInterval(scrollNext, interval);
    return () => clearInterval(id);
  }, [scrollNext, interval]);

  return (
    <div
      ref={ref}
      className={className}
      onPointerEnter={() => (isPaused.current = true)}
      onPointerLeave={() => (isPaused.current = false)}
      onTouchStart={() => (isPaused.current = true)}
      onTouchEnd={() => {
        setTimeout(() => (isPaused.current = false), 2000);
      }}
    >
      {children}
    </div>
  );
}

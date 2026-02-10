import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { cn } from "@/lib/utils";

type CarouselImage = {
  src: string;
  alt: string;
};

type ImageCarouselProps = {
  images: CarouselImage[];
  ariaLabel: string;
  enableCoverflow?: boolean;
  className?: string;
  aspectClassName?: string;
};

export default function ImageCarousel({
  images,
  ariaLabel,
  enableCoverflow = false,
  className = "",
  aspectClassName = "aspect-[4/3] md:aspect-[16/9]",
}: ImageCarouselProps) {
  const total = images.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const id = useId();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mediaQuery.matches);
    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  const goTo = (index: number) => {
    const next = (index + total) % total;
    setActiveIndex(next);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(total - 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? 0;
    const delta = touchStartX.current - endX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className={cn("relative space-y-4", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} of {total}: {images[activeIndex]?.alt}
      </p>

      {enableCoverflow && isDesktop ? (
        <div
          className="relative h-80 overflow-hidden"
          style={{ perspective: "1200px" }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {images.map((image, index) => {
              const offset = index - activeIndex;
              const clamped = Math.max(-3, Math.min(3, offset));
              const isHidden = Math.abs(offset) > 3;
              const translateX = clamped * 90;
              const rotateY = clamped * -18;
              const scale = offset === 0 ? 1 : 0.86;
              const opacity = isHidden ? 0 : 0.6 + (offset === 0 ? 0.4 : 0);

              return (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => goTo(index)}
                  className="absolute transition-all duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                  style={{
                    transform: `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex: 10 - Math.abs(offset),
                    pointerEvents: isHidden ? "none" : "auto",
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div className="relative h-64 w-44 overflow-hidden rounded-2xl shadow-card md:h-72 md:w-52">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 768px) 220px, 180px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={cn("relative overflow-hidden rounded-2xl", aspectClassName)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            id={`carousel-track-${id}`}
          >
            {images.map((image) => (
              <div key={image.src} className="relative h-full w-full shrink-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrev}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-text transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label="Previous slide"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-text transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            aria-label="Next slide"
          >
            Next
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {images.map((_, index) => (
            <button
              key={`${id}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                "h-2.5 w-2.5 rounded-full border",
                index === activeIndex
                  ? "border-brand-primary bg-brand-primary"
                  : "border-gray-300 bg-white"
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

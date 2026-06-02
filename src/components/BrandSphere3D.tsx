import dynamic from "next/dynamic";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const BrandSphereCanvas = dynamic(() => import("@/components/BrandSphereCanvas"), {
  ssr: false,
});

const getHasAnimated = () => {
  if (typeof window === "undefined") return false;
  return (window as typeof window & { __brandSphereAnimated?: boolean })
    .__brandSphereAnimated === true;
};

const setHasAnimated = () => {
  if (typeof window === "undefined") return;
  (window as typeof window & { __brandSphereAnimated?: boolean })
    .__brandSphereAnimated = true;
};

type BrandSphere3DProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

const supportsWebGL = () => {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") ||
      canvas.getContext("webgl2")
    );
  } catch {
    return false;
  }
};

const usePrefersReducedMotion = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return prefersReduced;
};

export default function BrandSphere3D({
  children,
  className,
  contentClassName,
}: BrandSphere3DProps) {
  const [canRender, setCanRender] = useState(true);
  const [textVisible, setTextVisible] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);
  const [bubblePopped, setBubblePopped] = useState(false);
  const [contentSize, setContentSize] = useState({ width: 360, height: 260 });
  const timeoutRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const enableParallax = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768;
  }, []);


  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!contentRef.current || typeof window === "undefined") return undefined;

    const node = contentRef.current;
    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setContentSize({
        width: Math.max(280, rect.width),
        height: Math.max(190, rect.height),
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const supported = supportsWebGL();
    setCanRender(supported);
    if (!supported || prefersReducedMotion) {
      setSkipAnimation(true);
      setTextVisible(true);
      return;
    }
    if (getHasAnimated()) {
      setSkipAnimation(true);
      setTextVisible(true);
      return;
    }
    setSkipAnimation(false);
    setTextVisible(false);
    setHasAnimated();
  }, [prefersReducedMotion]);

  const handleFormationComplete = () => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    if (skipAnimation) {
      return;
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setTextVisible(true);
    }, 900);
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden brand-sphere-shell",
        bubblePopped && "brand-sphere-popped",
        className,
      )}
    >
      <noscript>
        <style>{`.brand-sphere-text{opacity:1!important;transform:none!important;}`}</style>
      </noscript>
      {canRender ? (
        <div
          aria-hidden="true"
          className="absolute -inset-y-20 left-1/2 -translate-x-1/2"
          style={{ width: "min(100vw, calc(100% + 8rem))" }}
        >
          <BrandSphereCanvas
            reducedMotion={prefersReducedMotion}
            enableParallax={enableParallax}
            onFormationComplete={handleFormationComplete}
            onBubblePop={() => setBubblePopped(true)}
            shouldAnimate={!prefersReducedMotion && !skipAnimation}
            contentSize={contentSize}
          />
        </div>
      ) : null}
      <div
        ref={contentRef}
        className={cn(
          "brand-sphere-text relative z-10 mx-auto w-fit max-w-full pointer-events-none transition-all duration-800 ease-out",
          textVisible
            ? bubblePopped
              ? "opacity-100 -translate-y-6 md:-translate-y-8"
              : "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

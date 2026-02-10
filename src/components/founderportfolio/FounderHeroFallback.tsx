import Image from "next/image";
import { cn } from "@/lib/utils";

type FounderHeroFallbackProps = {
  imageSrc?: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export default function FounderHeroFallback({
  imageSrc = "/mainfounderphoto.jpeg",
  alt,
  className = "",
  priority = false,
}: FounderHeroFallbackProps) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 1200px"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/60 to-transparent" />
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-brand-primary/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-canvas-line/70 blur-3xl" />
    </div>
  );
}

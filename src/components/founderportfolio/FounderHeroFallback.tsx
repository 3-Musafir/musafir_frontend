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
    <div
      className={cn(
        "relative min-h-[300px] overflow-hidden bg-canvas-soft md:min-h-[440px]",
        className
      )}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, 560px"
        className="object-cover object-[52%_42%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
    </div>
  );
}

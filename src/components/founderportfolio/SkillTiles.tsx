import Image from "next/image";

type SkillTile = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

type SkillTilesProps = {
  skills: SkillTile[];
};

export default function SkillTiles({ skills }: SkillTilesProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <div
          key={skill.title}
          className="group relative min-h-72 overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 text-white shadow-soft transform-gpu transition-transform duration-500 motion-safe:hover:-translate-y-1 motion-safe:hover:[transform:perspective(1200px)_rotateX(4deg)_rotateY(-4deg)_scale(1.02)] md:min-h-80 lg:min-h-72"
        >
          <Image
            src={skill.image}
            alt={skill.alt}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          <div className="relative z-10 flex min-h-72 flex-col justify-end p-5 md:min-h-80 lg:min-h-72">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">{skill.title}</p>
            <p className="mt-2 text-sm text-white/90 leading-relaxed">{skill.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

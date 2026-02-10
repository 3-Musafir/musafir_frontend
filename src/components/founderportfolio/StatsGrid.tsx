type Stat = {
  value: string;
  label: string;
};

type StatsGridProps = {
  stats: Stat[];
};

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-2xl font-semibold text-heading">{stat.value}</p>
          <p className="mt-1 text-sm text-text">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

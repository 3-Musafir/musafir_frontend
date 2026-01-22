import type React from "react";

export const BarChart = ({
  children,
  data,
  margin,
}: {
  children: React.ReactNode;
  data: any[];
  margin?: { top: number; right: number; bottom: number; left: number };
}) => {
  return <svg viewBox={`0 0 100 100`}>{children}</svg>;
};

export const Bar = ({ dataKey, fill }: { dataKey: string; fill: string }) => {
  return <rect />;
};

export const XAxis = ({
  dataKey,
  tick,
  interval,
}: {
  dataKey: string;
  tick: { fontSize: number };
  interval: number;
}) => {
  return null;
};

export const YAxis = ({ hide }: { hide?: boolean }) => {
  return null;
};

export const ResponsiveContainer = ({
  children,
  width,
  height,
}: {
  children: React.ReactNode;
  width: string | number;
  height: string | number;
}) => {
  return <div>{children}</div>;
};

export const Tooltip = () => {
  return null;
};

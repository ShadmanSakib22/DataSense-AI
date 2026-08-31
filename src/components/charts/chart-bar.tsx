'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartBarProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
  config: ChartConfig;
  height?: number;
}

export function ChartBar({ data, xKey, yKeys, config, height = 300 }: ChartBarProps) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {yKeys.map(key => (
          <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

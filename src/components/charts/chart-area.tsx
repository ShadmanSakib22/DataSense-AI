'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartAreaProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
  config: ChartConfig;
  height?: number;
}

export function ChartArea({ data, xKey, yKeys, config, height = 300 }: ChartAreaProps) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {yKeys.map(key => (
          <Area key={key} dataKey={key} fill={`var(--color-${key})`} stroke={`var(--color-${key})`} fillOpacity={0.2} />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

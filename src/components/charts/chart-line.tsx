'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartLineProps {
  data: Record<string, unknown>[];
  xKey: string;
  yKeys: string[];
  config: ChartConfig;
  height?: number;
}

export function ChartLine({ data, xKey, yKeys, config, height = 300 }: ChartLineProps) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <LineChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {yKeys.map(key => (
          <Line key={key} dataKey={key} stroke={`var(--color-${key})`} strokeWidth={2} dot={false} />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

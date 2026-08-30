'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartRadarProps {
  data: Record<string, unknown>[];
  yKeys: string[];
  config: ChartConfig;
  height?: number;
}

export function ChartRadar({ data, yKeys, config, height = 300 }: ChartRadarProps) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <ChartTooltip content={<ChartTooltipContent />} />
        {yKeys.map((key, i) => (
          <Radar key={key} dataKey={key} stroke={`var(--color-${i + 1})`} fill={`var(--color-${i + 1})`} fillOpacity={0.2} />
        ))}
      </RadarChart>
    </ChartContainer>
  );
}

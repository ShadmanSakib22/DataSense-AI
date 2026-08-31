'use client';

import { Pie, PieChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartPieProps {
  data: Record<string, unknown>[];
  config: ChartConfig;
  height?: number;
}

export function ChartPie({ data, config, height = 300 }: ChartPieProps) {
  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Pie data={data} dataKey="value" nameKey="name" fill="var(--color-1)" />
      </PieChart>
    </ChartContainer>
  );
}

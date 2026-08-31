'use client';

import { AreaChart, BarChart, LineChart, PieChart, Radar } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChartType } from '@/lib/chart-defaults';

const CHART_TYPES: { type: ChartType; label: string; icon: typeof BarChart }[] = [
  { type: 'area', label: 'Area', icon: AreaChart },
  { type: 'bar', label: 'Bar', icon: BarChart },
  { type: 'line', label: 'Line', icon: LineChart },
  { type: 'pie', label: 'Pie', icon: PieChart },
  { type: 'radar', label: 'Radar', icon: Radar },
];

interface ChartTypePickerProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export function ChartTypePicker({ value, onChange }: ChartTypePickerProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => { if (v) onChange(v as ChartType); }}
      size="sm"
    >
      {CHART_TYPES.map(({ type, label, icon: Icon }) => (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <ToggleGroupItem value={type} aria-label={label}>
              <Icon className="size-3.5" />
            </ToggleGroupItem>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}

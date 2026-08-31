'use client';

import { AreaChart, BarChart, LineChart, PieChart, Radar } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChartType } from '@/lib/chart-defaults';

const CHART_TYPES: { type: ChartType; label: string; icon: typeof BarChart; requires: string }[] = [
  { type: 'bar', label: 'Bar', icon: BarChart, requires: '' },
  { type: 'line', label: 'Line', icon: LineChart, requires: 'Date column' },
  { type: 'area', label: 'Area', icon: AreaChart, requires: 'Date column' },
  { type: 'pie', label: 'Pie', icon: PieChart, requires: '≤8 rows' },
  { type: 'radar', label: 'Radar', icon: Radar, requires: '≥3 columns' },
];

interface ChartTypePickerProps {
  value: ChartType;
  eligibleTypes: ChartType[];
  onChange: (type: ChartType) => void;
}

export function ChartTypePicker({ value, eligibleTypes, onChange }: ChartTypePickerProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => { if (v) onChange(v as ChartType); }}
      size="sm"
    >
      {CHART_TYPES.map(({ type, label, icon: Icon, requires }) => {
        const isEligible = eligibleTypes.includes(type);
        return (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value={type}
                aria-label={label}
                disabled={!isEligible}
              >
                <Icon className="size-3.5" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isEligible ? label : `${label} (${requires})`}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </ToggleGroup>
  );
}

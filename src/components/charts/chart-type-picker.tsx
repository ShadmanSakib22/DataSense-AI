'use client';

import { AreaChart, BarChart, LineChart, PieChart, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
    <div className="flex gap-1">
      {CHART_TYPES.map(({ type, label, icon: Icon }) => (
        <Button
          key={type}
          variant={value === type ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(type)}
          className={cn('gap-1.5', value === type && 'bg-primary text-primary-foreground')}
        >
          <Icon className="size-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}

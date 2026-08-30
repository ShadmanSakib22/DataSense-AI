import { describe, it, expect } from 'vitest';
import { suggestChartType } from './chart-defaults';

describe('suggestChartType', () => {
  it('suggests line for date + numeric', () => {
    const cols = ['date', 'revenue'];
    const rows = [['2024-01-01', 100], ['2024-01-02', 200]];
    expect(suggestChartType(cols, rows)).toBe('line');
  });

  it('suggests pie for few categories', () => {
    const cols = ['category', 'count'];
    const rows = [['A', 10], ['B', 20], ['C', 30]];
    expect(suggestChartType(cols, rows)).toBe('pie');
  });

  it('suggests bar by default', () => {
    const cols = ['name', 'value'];
    const rows = [['x', 1], ['y', 2], ['z', 3], ['w', 4], ['v', 5], ['u', 6], ['t', 7], ['s', 8], ['r', 9]];
    expect(suggestChartType(cols, rows)).toBe('bar');
  });

  it('suggests bar for empty data', () => {
    expect(suggestChartType(['a', 'b'], [])).toBe('bar');
  });
});

import { describe, it, expect } from 'vitest';
import { parseXlsxFile } from '../import-xlsx';

describe('parseXlsxFile', () => {
  it('exports a function', () => {
    expect(typeof parseXlsxFile).toBe('function');
  });
});

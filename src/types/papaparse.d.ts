/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'papaparse' {
  interface ParseConfig {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    dynamicTyping?: boolean;
    preview?: number;
    skipEmptyLines?: boolean | 'greedy';
    comments?: boolean | string;
    transform?: (value: string, field: string | number) => any;
    complete?: (results: ParseResult<any>, file?: string) => void;
    error?: (error: ParseError, file?: string) => void;
    chunk?: (results: ParseResult<any>, parser: Parser) => void;
    fastMode?: boolean;
    withCredentials?: boolean;
    download?: boolean;
    worker?: boolean;
    transformHeader?: (header: string) => string;
    step?: (results: ParseResult<any>, parser: Parser) => void;
  }

  interface ParseResult<T> {
    data: T[];
    errors: ParseError[];
    meta: {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      fields: string[];
      truncated: boolean;
    };
  }

  interface ParseError {
    type: 'Quotes' | 'Delimiter' | 'FieldMismatch';
    code: string;
    message: string;
    row: number;
  }

  interface Parser {
    abort(): void;
  }

  export function parse<T = any>(input: string | File | NodeJS.ReadableStream, config?: ParseConfig): ParseResult<T>;
  export function parse<T = any>(input: string | File | NodeJS.ReadableStream, config?: ParseConfig & { complete: (results: ParseResult<T>, file?: string) => void }): void;
  export function unparse(data: any[], config?: { delimiter?: string; newline?: string; header?: boolean }): string;
  export function unparse(data: Record<string, any>[], config?: { delimiter?: string; newline?: string; header?: boolean }): string;
}
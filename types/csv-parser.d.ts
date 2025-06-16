declare module 'csv-parser' {
  import { Readable } from 'stream';

  interface CsvParserOptions {
    separator?: string;
    newline?: string;
    headers?: string[] | boolean;
    mapHeaders?: ({ header, index }: { header: string; index: number }) => string | null;
    mapValues?: ({ header, index, value }: { header: string; index: number; value: any }) => any;
    strict?: boolean;
    skipLines?: number;
    maxRowBytes?: number;
  }

  function csvParser(options?: CsvParserOptions): NodeJS.ReadWriteStream;

  export = csvParser;
}

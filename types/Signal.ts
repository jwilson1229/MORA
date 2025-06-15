// Updated Signal with consistent structure
export type Signal = {
  message?: string;
  region: string;
  type: 'reddit' | 'news' | 'weather' | 'power' | 'manual';
  source: string;
  indicators: string[];
  content: string;
  problem: string;
  tags: string[];
  url: string;
  store?: string;
};
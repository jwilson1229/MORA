// mora-agro/regionGroups.ts

/**
 * This file defines high-level region groups and maps them to countries.
 * Each country will be scanned for signals using the region group as its umbrella.
 */

export const regionGroups: Record<string, string[]> = {
  'East Africa': ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
  'West Africa': ['Nigeria', 'Ghana', 'Ivory Coast', 'Senegal', 'Cameroon'],
  'South Asia': ['India', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Pakistan'],
  'Southeast Asia': ['Philippines', 'Vietnam', 'Thailand', 'Indonesia', 'Malaysia'],
  'Latin America': ['Brazil', 'Mexico', 'Colombia', 'Peru', 'Argentina'],
  'Middle East': ['Egypt', 'Jordan', 'Iraq', 'Saudi Arabia', 'UAE'],
};

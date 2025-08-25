export const INDIA_TOPOJSON_URL =
  'https://cdn.jsdelivr.net/npm/india-geojson@1/india-states.json';

export const REGION_NAMES: Record<string, string> = {
  'IN-MH': 'Maharashtra',
  'IN-GJ': 'Gujarat',
  'IN-DL': 'Delhi',
  'IN-KA': 'Karnataka',
  'IN-TN': 'Tamil Nadu',
  'IN-UP': 'Uttar Pradesh',
  'IN-RJ': 'Rajasthan',
  'IN-WB': 'West Bengal',
};

export function regionName(code: string): string {
  return REGION_NAMES[code] || code;
}

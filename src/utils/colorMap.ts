/**
 * Color name to hex mapping utility
 * Provides a centralized color map for converting color names to hex values
 */

// Comprehensive color name to hex mapping
export const COLOR_MAP: Record<string, string> = {
  // Basic colors
  'white': '#FFFFFF',
  'black': '#000000',
  'gray': '#808080',
  'grey': '#808080',
  'light gray': '#D3D3D3',
  'lightgrey': '#D3D3D3',
  'light grey': '#D3D3D3',
  
  // Primary colors
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'pink': '#FFC0CB',
  'purple': '#800080',
  
  // Navy and blues
  'navy': '#000080',
  'royal blue': '#4169E1',
  'royalblue': '#4169E1',
  'sky blue': '#87CEEB',
  'skyblue': '#87CEEB',
  
  // Greens
  'forest green': '#228B22',
  'forestgreen': '#228B22',
  'mint green': '#98FF98',
  'mintgreen': '#98FF98',
  'olive': '#808000',
  'olive drab': '#6B8E23',
  'olivedrab': '#6B8E23',
  
  // Browns and tans
  'brown': '#A52A2A',
  'tan': '#D2B48C',
  'beige': '#F5F5DC',
  'beige-gray': '#9F9F9F',
  'beigegray': '#9F9F9F',
  'khaki': '#C3B091',
  
  // Reds and maroons
  'maroon': '#800000',
  'burgundy': '#800020',
  'crimson': '#DC143C',
  
  // Grays and charcoals
  'charcoal': '#36454F',
  'silver': '#C0C0C0',
  
  // Metallics
  'gold': '#FFD700',
  'rose gold': '#E8B4B8',
  'rosegold': '#E8B4B8',
  
  // Pastels and light colors
  'cream': '#FFFDD0',
  'ivory': '#FFFFF0',
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  'lavender': '#E6E6FA',
  'peach': '#FFE5B4',
  'teal': '#008080',
  'cyan': '#00FFFF',
  'lime': '#00FF00',
  'magenta': '#FF00FF',
  'mint': '#98FF98',
  
  // Special colors
  'natural': '#F5F5DC',
  'clear': '#FFFFFF',
  'kraft': '#D4A574',
  'camo': '#78866B',
  'wood': '#8B4513',
  'cork': '#D4A574',
  'slate': '#708090',
  
  // Jewelry metals
  'white gold': '#F5F5DC',
  'whitegold': '#F5F5DC',
  'bronze': '#CD7F32',
  'copper': '#B87333',
  'brass': '#B5A642',
  'platinum': '#E5E4E2',
  
  // Frosted/Amber
  'frosted': '#F0F0F0',
  'amber': '#FFBF00',
  'cobalt blue': '#0047AB',
  'cobaltblue': '#0047AB',
};

/**
 * Get hex color code from color name
 * @param colorName - The color name (case-insensitive)
 * @returns Hex color code or default gray if not found
 */
export const getColorHex = (colorName: string): string => {
  if (!colorName) return '#CCCCCC';
  
  const normalized = colorName.toLowerCase().trim();
  
  // Direct lookup
  if (COLOR_MAP[normalized]) {
    return COLOR_MAP[normalized];
  }
  
  // Try with common variations
  const variations = [
    normalized.replace(/\s+/g, ''), // Remove spaces
    normalized.replace(/-/g, ''), // Remove hyphens
    normalized.replace(/\s+/g, '-'), // Replace spaces with hyphens
  ];
  
  for (const variation of variations) {
    if (COLOR_MAP[variation]) {
      return COLOR_MAP[variation];
    }
  }
  
  // Default fallback
  return '#CCCCCC';
};

/**
 * Check if a color name exists in the map
 * @param colorName - The color name to check
 * @returns True if color exists in map
 */
export const hasColor = (colorName: string): boolean => {
  if (!colorName) return false;
  const normalized = colorName.toLowerCase().trim();
  return COLOR_MAP[normalized] !== undefined;
};

/**
 * Get all available color names
 * @returns Array of color names
 */
export const getAllColorNames = (): string[] => {
  return Object.keys(COLOR_MAP);
};


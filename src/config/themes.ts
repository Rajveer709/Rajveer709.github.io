
export type Theme = {
  name: string;
  value: string;
  colors: { primary: string; secondary: string };
  levelToUnlock: number;
};

export const themes: Theme[] = [
  // Always available themes
  { name: 'Purple', value: 'purple', colors: { primary: '#667eea', secondary: '#764ba2' }, levelToUnlock: 1 },
  { name: 'Teal', value: 'teal', colors: { primary: '#11998e', secondary: '#38ef7d' }, levelToUnlock: 1 },
  { name: 'Orange', value: 'orange', colors: { primary: '#fc4a1a', secondary: '#f7b733' }, levelToUnlock: 1 },
  { name: 'Blue', value: 'blue', colors: { primary: '#4facfe', secondary: '#00f2fe' }, levelToUnlock: 1 },
  
  // Locked themes - only 4 locked colors
  { name: 'Sunset', value: 'sunset', colors: { primary: '#ff7e5f', secondary: '#feb47b' }, levelToUnlock: 2 },
  { name: 'Ocean', value: 'ocean', colors: { primary: '#2193b0', secondary: '#6dd5ed' }, levelToUnlock: 3 },
  { name: 'Forest', value: 'forest', colors: { primary: '#134E5E', secondary: '#71B280' }, levelToUnlock: 4 },
  { name: 'Royal', value: 'royal', colors: { primary: '#4a00e0', secondary: '#8e2de2' }, levelToUnlock: 5 },
  
  // Avi special themes - unlocked only at level 100 (infinity)
  { name: 'Golden', value: 'golden', colors: { primary: '#f2994a', secondary: '#f2c94c' }, levelToUnlock: 100 },
  { name: 'Crimson', value: 'crimson', colors: { primary: '#dc2424', secondary: '#4a569d' }, levelToUnlock: 100 },
  { name: 'Sky', value: 'sky', colors: { primary: '#00c6ff', secondary: '#0072ff' }, levelToUnlock: 100 },
  { name: 'Lavender', value: 'lavender', colors: { primary: '#ba5370', secondary: '#f4e2d8' }, levelToUnlock: 100 },
];

export const defaultTheme = 'purple';

export type Theme = {
  name: string;
  value: string;
  colors: { primary: string; secondary: string };
  levelToUnlock: number;
};

export const themes: Theme[] = [
  // Level 1 (Explorer) - 3 themes
  { name: 'Purple', value: 'purple', colors: { primary: '#667eea', secondary: '#764ba2' }, levelToUnlock: 1 },
  { name: 'Teal', value: 'teal', colors: { primary: '#11998e', secondary: '#38ef7d' }, levelToUnlock: 1 },
  { name: 'Orange', value: 'orange', colors: { primary: '#fc4a1a', secondary: '#f7b733' }, levelToUnlock: 1 },
  
  // Level 2 (Warrior) - 3 themes
  { name: 'Blue', value: 'blue', colors: { primary: '#4facfe', secondary: '#00f2fe' }, levelToUnlock: 2 },
  { name: 'Sunset', value: 'sunset', colors: { primary: '#ff7e5f', secondary: '#feb47b' }, levelToUnlock: 2 },
  { name: 'Ocean', value: 'ocean', colors: { primary: '#2193b0', secondary: '#6dd5ed' }, levelToUnlock: 2 },
  
  // Level 3 (Master) - 3 themes
  { name: 'Forest', value: 'forest', colors: { primary: '#134E5E', secondary: '#71B280' }, levelToUnlock: 3 },
  { name: 'Royal', value: 'royal', colors: { primary: '#4a00e0', secondary: '#8e2de2' }, levelToUnlock: 3 },
  { name: 'Rose', value: 'rose', colors: { primary: '#e91e63', secondary: '#f06292' }, levelToUnlock: 3 },
  
  // Level 4 (Legend) - 3 themes
  { name: 'Emerald', value: 'emerald', colors: { primary: '#10b981', secondary: '#34d399' }, levelToUnlock: 4 },
  { name: 'Amber', value: 'amber', colors: { primary: '#f59e0b', secondary: '#fbbf24' }, levelToUnlock: 4 },
  { name: 'Indigo', value: 'indigo', colors: { primary: '#6366f1', secondary: '#8b5cf6' }, levelToUnlock: 4 },
  // Gold theme (locked by default, unlocked by cheat code)
  { name: 'Gold', value: 'gold', colors: { primary: '#FFD700', secondary: '#FFB300' }, levelToUnlock: 100 },
];

export const defaultTheme = 'purple';
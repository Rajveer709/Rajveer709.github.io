
import { Award, Medal, Trophy, type LucideIcon, Shield, Crown, Gem, Ghost } from 'lucide-react';

export interface Rank {
  level: number;
  name: string;
  Icon: LucideIcon;
  description?: string;
}

export const RANKS: Rank[] = [
  { level: 1, name: 'Explorer', Icon: Award, description: 'Begin your journey' },
  { level: 2, name: 'Warrior', Icon: Shield, description: 'Build strength and consistency' },
  { level: 3, name: 'Master', Icon: Trophy, description: 'Advanced mastery achieved' },
  { level: 4, name: 'Legend', Icon: Crown, description: 'Legendary status unlocked' },
  { level: 100, name: 'Avi', Icon: Ghost, description: 'Transcendent being with unlimited access' },
];

export const getRankForLevel = (level: number): Rank => {
  // Special handling for Avi rank
  if (level >= 100) {
    return RANKS[4]; // Avi rank
  }
  return [...RANKS.slice(0, 4)].reverse().find(rank => level >= rank.level) || RANKS[0];
};

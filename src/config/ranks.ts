
import { Award, Medal, Trophy, type LucideIcon, Shield, Crown, Gem, Ghost } from 'lucide-react';

export interface Rank {
  level: number;
  name: string;
  Icon: LucideIcon;
}

export const RANKS: Rank[] = [
  { level: 1, name: 'Explorer', Icon: Award },
  { level: 2, name: 'Warrior', Icon: Shield },
  { level: 3, name: 'Master', Icon: Trophy },
  { level: 4, name: 'Legend', Icon: Crown },
  { level: 100, name: 'Avi', Icon: Ghost },
];

export const getRankForLevel = (level: number): Rank => {
  return [...RANKS].reverse().find(rank => level >= rank.level) || RANKS[0];
};

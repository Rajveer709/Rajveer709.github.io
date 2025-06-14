
import { Award, Medal, Trophy, type LucideIcon } from 'lucide-react';

export interface Rank {
  level: number;
  name: string;
  Icon: LucideIcon;
}

export const RANKS: Rank[] = [
  { level: 1, name: 'Novice', Icon: Award },
  { level: 4, name: 'Adept', Icon: Medal },
  { level: 8, name: 'Master', Icon: Trophy },
  { level: 12, name: 'Grandmaster', Icon: Trophy },
  { level: 16, name: 'Legend', Icon: Trophy },
];

export const getRankForLevel = (level: number): Rank => {
  return [...RANKS].reverse().find(rank => level >= rank.level) || RANKS[0];
};


import { Award, Medal, Trophy, type LucideIcon, Shield, Crown, Gem, Ghost } from 'lucide-react';

export interface Rank {
  level: number;
  name: string;
  Icon: LucideIcon;
}

export const RANKS: Rank[] = [
  { level: 1, name: 'Novice', Icon: Award },
  { level: 2, name: 'Apprentice', Icon: Award },
  { level: 3, name: 'Journeyman', Icon: Medal },
  { level: 4, name: 'Adept', Icon: Medal },
  { level: 5, name: 'Expert', Icon: Shield },
  { level: 6, name: 'Veteran', Icon: Shield },
  { level: 7, name: 'Artisan', Icon: Trophy },
  { level: 8, name: 'Master', Icon: Trophy },
  { level: 9, name: 'Grandmaster', Icon: Trophy },
  { level: 10, name: 'Champion', Icon: Crown },
  { level: 11, name: 'Legend', Icon: Crown },
  { level: 12, name: 'Elite', Icon: Gem },
  { level: 100, name: 'Avi', Icon: Ghost },
];

export const getRankForLevel = (level: number): Rank => {
  return [...RANKS].reverse().find(rank => level >= rank.level) || RANKS[0];
};

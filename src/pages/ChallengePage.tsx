
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, ChevronDown, Trophy, Star, Zap, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge as ChallengeType } from '../config/challenges';
import { getRankForLevel, RANKS as ALL_RANKS } from '../config/ranks';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Profile } from "./Index";
import { PageHeader } from "../components/PageHeader";
import { themes, defaultTheme } from '../config/themes';

export interface Challenge extends ChallengeType {
  completed: boolean;
}

interface ChallengePageProps {
  userLevel: number;
  userXp: number;
  xpToNextLevel: number;
  challenges: Challenge[];
  onBack: () => void;
  currentTheme?: string;
}

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
  currentTheme?: string;
}

export const ChallengePage = ({ userLevel, userXp, xpToNextLevel, challenges, onBack, currentTheme = 'purple' }: ChallengePageProps) => {
  const { profile, onUpdateProfile, showGreeting } = useOutletContext<OutletContextType>();
  const theme = themes.find(t => t.value === currentTheme) || themes.find(t => t.value === defaultTheme);
  const progressPercentage = xpToNextLevel > 0 ? Math.round((userXp / xpToNextLevel) * 100) : 0;
  const rank = getRankForLevel(userLevel);

  const getChallengeLevel = (challengeId: number) => {
    if (challengeId <= 7) return 1;
    if (challengeId <= 14) return 2;
    if (challengeId <= 21) return 3;
    if (challengeId <= 28) return 4;
    if (challengeId <= 35) return 5;
    if (challengeId <= 42) return 6;
    if (challengeId <= 49) return 7;
    if (challengeId <= 56) return 8;
    if (challengeId <= 63) return 9;
    if (challengeId <= 70) return 10;
    return 11;
  };
  
  const challengesByLevel = challenges.reduce<Record<number, Challenge[]>>((acc, challenge) => {
    const level = getChallengeLevel(challenge.id);
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(challenge);
    return acc;
  }, {});

  const completedChallengesInLevel = (levelChallenges: Challenge[]) => 
    levelChallenges.filter(c => c.completed).length;

  return (
    <div className="pb-6">
      <PageHeader
        title={
          <span 
            className="bg-gradient-to-r bg-clip-text text-transparent font-bold flex items-center gap-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            <Trophy className="w-6 h-6 md:w-7 md:h-7" style={{ color: theme?.colors.primary }} />
            Challenges
          </span>
        }
        onBack={onBack}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        showAvatar={!showGreeting}
      />

      {/* Rank Card with Enhanced Graphics */}
      <Card className="mb-4 md:mb-6 bg-gradient-to-br from-card/90 to-card/70 dark:from-card/40 dark:to-card/20 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden animate-fade-in">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${theme?.colors.primary} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <div 
                className="p-2 md:p-3 rounded-full shadow-lg animate-pulse-glow"
                style={{ backgroundColor: `${theme?.colors.primary}20` }}
              >
                <rank.Icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: theme?.colors.primary }} />
              </div>
              <div>
                <CardDescription className="text-xs md:text-sm flex items-center gap-2">
                  <Star className="w-3 h-3 md:w-4 md:h-4" style={{ color: theme?.colors.secondary }} />
                  Rank: Level {userLevel}
                </CardDescription>
                <CardTitle 
                  className="text-lg md:text-2xl flex items-center gap-2 bg-gradient-to-r bg-clip-text text-transparent font-bold"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                  }}
                >
                  {rank.name}
                  <Crown className="w-4 h-4 md:w-5 md:h-5" style={{ color: theme?.colors.secondary }} />
                </CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center gap-3 md:gap-4 mb-2">
            <Progress 
              value={progressPercentage} 
              className="h-2 md:h-3 flex-1"
              style={{ 
                backgroundColor: `${theme?.colors.primary}20`
              }}
            />
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 md:w-4 md:h-4" style={{ color: theme?.colors.secondary }} />
              <span 
                className="text-sm md:text-base font-bold"
                style={{ color: theme?.colors.primary }}
              >
                {userXp} / {xpToNextLevel} XP
              </span>
            </div>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" style={{ color: theme?.colors.secondary }} />
            {xpToNextLevel > userXp ? `${xpToNextLevel - userXp} XP to level up` : 'Max level reached for now!'}
          </p>
        </CardContent>
      </Card>

      {/* Challenge Log Card */}
      <Card className="bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle 
              className="flex items-center gap-2 bg-gradient-to-r bg-clip-text text-transparent font-bold text-lg md:text-xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              <Trophy className="w-5 h-5 md:w-6 md:h-6" style={{ color: theme?.colors.primary }} />
              Challenge Log
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs md:text-sm border-2 hover:scale-105 transition-all duration-300"
                  style={{ 
                    borderColor: theme?.colors.primary,
                    color: theme?.colors.primary
                  }}
                >
                  <Crown className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  View Ranks
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle 
                    className="flex items-center gap-2 bg-gradient-to-r bg-clip-text text-transparent font-bold"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                    }}
                  >
                    <Crown className="w-5 h-5" style={{ color: theme?.colors.primary }} />
                    Ranks & Achievements
                  </DialogTitle>
                  <DialogDescription>
                    Level up to achieve new ranks and unlock exclusive rewards.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1 -mr-2 pr-2">
                  {ALL_RANKS.map((r, index) => (
                    <div 
                      key={r.level} 
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                        userLevel >= r.level 
                          ? 'bg-gradient-to-r shadow-lg' 
                          : 'bg-muted/50'
                      }`}
                      style={userLevel >= r.level ? {
                        backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}20, ${theme?.colors.secondary}20)`
                      } : {}}
                    >
                      <div 
                        className="p-2 rounded-full"
                        style={{ 
                          backgroundColor: userLevel >= r.level 
                            ? `${theme?.colors.primary}30` 
                            : 'transparent' 
                        }}
                      >
                        <r.Icon 
                          className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" 
                          style={{ 
                            color: userLevel >= r.level 
                              ? theme?.colors.primary 
                              : '#9ca3af' 
                          }} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p 
                            className="font-bold text-sm md:text-base"
                            style={{ 
                              color: userLevel >= r.level 
                                ? theme?.colors.primary 
                                : undefined 
                            }}
                          >
                            {r.name}
                          </p>
                          {userLevel >= r.level && (
                            <CheckCircle2 className="w-4 h-4" style={{ color: theme?.colors.secondary }} />
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          Level {r.level} {userLevel >= r.level ? '✓ Unlocked' : '🔒 Locked'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" style={{ color: theme?.colors.secondary }} />
            Complete challenges to earn XP and level up!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {Object.entries(challengesByLevel)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([level, levelChallenges]) => {
                const levelRank = getRankForLevel(Number(level));
                const completed = completedChallengesInLevel(levelChallenges);
                const total = levelChallenges.length;
                const completionPercentage = Math.round((completed / total) * 100);
                
                return (
                <Collapsible 
                  key={level} 
                  defaultOpen={userLevel >= Number(level) || userLevel + 1 === Number(level)} 
                  className="space-y-2 animate-fade-in"
                >
                  <CollapsibleTrigger 
                    className="flex justify-between items-center w-full p-3 md:p-4 rounded-lg transition-all duration-300 font-bold text-left group hover:scale-[1.02] relative overflow-hidden"
                    style={{
                      backgroundColor: `${theme?.colors.primary}15`,
                      borderLeft: `4px solid ${theme?.colors.primary}`
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${theme?.colors.primary}20` }}
                      >
                        <levelRank.Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: theme?.colors.primary }} />
                      </div>
                      <div className="flex-1 text-left">
                        <span 
                          className="text-sm md:text-base bg-gradient-to-r bg-clip-text text-transparent font-bold"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                          }}
                        >
                          Level {level} Challenges
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="h-1.5 bg-gray-200 rounded-full flex-1"
                            style={{ maxWidth: '100px' }}
                          >
                            <div 
                              className="h-1.5 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${completionPercentage}%`,
                                backgroundColor: theme?.colors.secondary
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {completed}/{total}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" style={{ color: theme?.colors.primary }} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 pl-2 md:pl-4 border-l-2 ml-1" style={{ borderColor: `${theme?.colors.primary}30` }}>
                      {levelChallenges.map(challenge => {
                        const challengeLevel = getChallengeLevel(challenge.id);
                        const isLocked = userLevel < challengeLevel;

                        return (
                        <div 
                          key={challenge.id} 
                          className={`flex items-center justify-between p-3 md:p-4 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                            challenge.completed 
                              ? 'shadow-lg border-l-4' 
                              : isLocked 
                                ? 'bg-muted/50' 
                                : 'bg-secondary hover:shadow-md'
                          }`}
                          style={challenge.completed ? {
                            backgroundColor: `${theme?.colors.primary}10`,
                            borderLeftColor: theme?.colors.secondary
                          } : {}}
                        >
                          <div className="flex items-center flex-1 min-w-0">
                            <div className="mr-3 md:mr-4 flex-shrink-0">
                              {challenge.completed ? (
                                <div 
                                  className="p-1 rounded-full"
                                  style={{ backgroundColor: `${theme?.colors.secondary}20` }}
                                >
                                  <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" style={{ color: theme?.colors.secondary }} />
                                </div>
                              ) : isLocked ? (
                                <Lock className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                              ) : (
                                <Circle className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p 
                                className={`font-medium text-sm md:text-base leading-tight ${
                                  challenge.completed 
                                    ? 'font-bold' 
                                    : isLocked 
                                      ? 'text-muted-foreground' 
                                      : 'text-foreground'
                                }`}
                                style={challenge.completed ? { color: theme?.colors.primary } : {}}
                              >
                                {challenge.text}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Zap className="w-3 h-3" style={{ color: theme?.colors.secondary }} />
                                  <span className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {challenge.xp} XP
                                  </span>
                                </div>
                                {isLocked && (
                                  <span className="text-xs text-muted-foreground">
                                    | Unlocks at Level {challengeLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {challenge.completed && (
                            <div 
                              className="text-xs font-bold px-2 py-1 rounded-full ml-2 flex items-center gap-1 animate-pulse"
                              style={{ 
                                backgroundColor: `${theme?.colors.secondary}20`,
                                color: theme?.colors.secondary
                              }}
                            >
                              <Star className="w-3 h-3" />
                              DONE
                            </div>
                          )}
                        </div>
                      )})}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )})}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

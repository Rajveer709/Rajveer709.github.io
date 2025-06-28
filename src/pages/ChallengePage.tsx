
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, ChevronDown, Trophy, Star, Zap, Crown, Sparkles, Gift, Medal, Award } from "lucide-react";
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
import { toast } from 'sonner';

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
  const [claimedRewards, setClaimedRewards] = useState<Set<number>>(new Set());

  // Filter out mythic and immortal ranks
  const filteredRanks = ALL_RANKS.filter(r => r.name !== 'Mythic' && r.name !== 'Immortal');

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

  const getRewardForLevel = (level: number) => {
    const rewards = [
      { level: 1, reward: "Theme Unlocked", icon: Sparkles },
      { level: 2, reward: "Badge Earned", icon: Award },
      { level: 3, reward: "Title Unlocked", icon: Medal },
      { level: 4, reward: "New Feature", icon: Star },
      { level: 5, reward: "Special Theme", icon: Crown },
      { level: 6, reward: "Achievement", icon: Trophy },
      { level: 7, reward: "Bonus XP", icon: Zap },
      { level: 8, reward: "Master Badge", icon: Medal },
      { level: 9, reward: "Legend Status", icon: Crown },
      { level: 10, reward: "Ultimate Reward", icon: Gift },
    ];
    return rewards.find(r => r.level === level) || { reward: "Special Reward", icon: Gift };
  };

  const claimReward = (level: number) => {
    if (userLevel >= level && !claimedRewards.has(level)) {
      setClaimedRewards(prev => new Set([...prev, level]));
      const reward = getRewardForLevel(level);
      toast.success(`🎉 Reward Claimed: ${reward.reward}!`, {
        duration: 2000,
        style: {
          background: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`,
          color: 'white',
          border: 'none'
        }
      });
    }
  };

  return (
    <div className="pb-6">
      <PageHeader
        title={
          <span 
            className="bg-gradient-to-r bg-clip-text text-transparent font-bold flex items-center gap-2 text-center w-full justify-center"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            <Trophy className="w-6 h-6 md:w-7 md:h-7" style={{ color: theme?.colors.primary }} />
            Challenges & Rewards
          </span>
        }
        onBack={onBack}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        showAvatar={!showGreeting}
      />

      {/* Enhanced Rank Card */}
      <Card 
        className="mb-4 md:mb-6 backdrop-blur-sm border-0 shadow-xl relative overflow-hidden animate-fade-in"
        style={{
          background: `linear-gradient(135deg, ${theme?.colors.primary}15, ${theme?.colors.secondary}10)`
        }}
      >
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(${theme?.colors.primary} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        <CardHeader className="relative text-center">
          <div className="flex flex-col items-center gap-3">
            <div 
              className="p-3 md:p-4 rounded-full shadow-lg animate-pulse-glow"
              style={{ backgroundColor: `${theme?.colors.primary}30` }}
            >
              <rank.Icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: theme?.colors.primary }} />
            </div>
            <div>
              <CardDescription className="text-sm md:text-base flex items-center justify-center gap-2 mb-2">
                <Star className="w-4 h-4" style={{ color: theme?.colors.secondary }} />
                Level {userLevel} • Rank
              </CardDescription>
              <CardTitle 
                className="text-2xl md:text-3xl bg-gradient-to-r bg-clip-text text-transparent font-bold"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                }}
              >
                {rank.name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-full max-w-md">
              <Progress 
                value={progressPercentage} 
                className="h-3 w-full"
                style={{ 
                  backgroundColor: `${theme?.colors.primary}20`
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" style={{ color: theme?.colors.secondary }} />
              <span 
                className="text-lg font-bold"
                style={{ color: theme?.colors.primary }}
              >
                {userXp} / {xpToNextLevel} XP
              </span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" style={{ color: theme?.colors.secondary }} />
              {xpToNextLevel > userXp ? `${xpToNextLevel - userXp} XP to next level` : 'Maximum level reached!'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Section */}
      <Card className="mb-4 md:mb-6 bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle 
            className="flex items-center justify-center gap-2 bg-gradient-to-r bg-clip-text text-transparent font-bold text-xl"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
            }}
          >
            <Gift className="w-6 h-6" style={{ color: theme?.colors.primary }} />
            Available Rewards
          </CardTitle>
          <CardDescription>Claim rewards for reaching new levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => {
              const reward = getRewardForLevel(level);
              const isUnlocked = userLevel >= level;
              const isClaimed = claimedRewards.has(level);
              
              return (
                <div 
                  key={level}
                  className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                    isUnlocked ? 'cursor-pointer' : 'opacity-50'
                  }`}
                  style={{
                    borderColor: isUnlocked ? theme?.colors.primary : '#e5e7eb',
                    backgroundColor: isClaimed 
                      ? `${theme?.colors.secondary}20` 
                      : isUnlocked 
                        ? `${theme?.colors.primary}10` 
                        : 'transparent'
                  }}
                  onClick={() => isUnlocked && !isClaimed && claimReward(level)}
                >
                  <div className="text-center">
                    <reward.icon 
                      className="w-6 h-6 mx-auto mb-2" 
                      style={{ color: isUnlocked ? theme?.colors.primary : '#9ca3af' }}
                    />
                    <p className="text-xs font-medium text-foreground">Level {level}</p>
                    <p className="text-xs text-muted-foreground">{reward.reward}</p>
                    {isClaimed && (
                      <div 
                        className="text-xs mt-1 font-bold"
                        style={{ color: theme?.colors.secondary }}
                      >
                        ✓ CLAIMED
                      </div>
                    )}
                    {isUnlocked && !isClaimed && (
                      <div 
                        className="text-xs mt-1 font-bold animate-pulse"
                        style={{ color: theme?.colors.primary }}
                      >
                        CLAIM!
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Simplified Challenge Log */}
      <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <CardTitle 
              className="flex items-center gap-2 bg-gradient-to-r bg-clip-text text-transparent font-bold text-xl mx-auto"
              style={{
                backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
              }}
            >
              <Trophy className="w-6 h-6" style={{ color: theme?.colors.primary }} />
              Your Challenges
            </CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-2 hover:scale-105 transition-all duration-300"
                  style={{ 
                    borderColor: theme?.colors.primary,
                    color: theme?.colors.primary
                  }}
                >
                  <Crown className="w-4 h-4 mr-1" />
                  Ranks
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle 
                    className="flex items-center gap-2 bg-gradient-to-r bg-clip-text text-transparent font-bold text-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                    }}
                  >
                    <Crown className="w-5 h-5" style={{ color: theme?.colors.primary }} />
                    Achievement Ranks
                  </DialogTitle>
                  <DialogDescription className="text-center">
                    Progress through ranks by completing challenges and earning XP.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto p-1">
                  {filteredRanks.map((r) => (
                    <div 
                      key={r.level} 
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                        userLevel >= r.level 
                          ? 'shadow-lg' 
                          : 'bg-muted/50'
                      }`}
                      style={userLevel >= r.level ? {
                        background: `linear-gradient(135deg, ${theme?.colors.primary}20, ${theme?.colors.secondary}20)`
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
                          className="w-6 h-6 flex-shrink-0" 
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
                            className="font-bold"
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
                        <p className="text-sm text-muted-foreground">
                          Level {r.level} {userLevel >= r.level ? '✓ Unlocked' : '🔒 Locked'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription className="flex items-center justify-center gap-2 mt-2">
            <Sparkles className="w-4 h-4" style={{ color: theme?.colors.secondary }} />
            Complete challenges to earn XP and unlock rewards!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
                  className="space-y-2"
                >
                  <CollapsibleTrigger 
                    className="flex justify-between items-center w-full p-4 rounded-lg transition-all duration-300 font-bold text-left group hover:scale-[1.02] relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${theme?.colors.primary}15, ${theme?.colors.secondary}10)`,
                      borderLeft: `4px solid ${theme?.colors.primary}`
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div 
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${theme?.colors.primary}30` }}
                      >
                        <levelRank.Icon className="w-5 h-5" style={{ color: theme?.colors.primary }} />
                      </div>
                      <div className="flex-1 text-left">
                        <span 
                          className="text-base bg-gradient-to-r bg-clip-text text-transparent font-bold"
                          style={{
                            backgroundImage: `linear-gradient(135deg, ${theme?.colors.primary}, ${theme?.colors.secondary})`
                          }}
                        >
                          Level {level} Challenges
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="h-2 bg-gray-200 rounded-full flex-1 max-w-[120px]"
                          >
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${completionPercentage}%`,
                                backgroundColor: theme?.colors.secondary
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">
                            {completed}/{total}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" style={{ color: theme?.colors.primary }} />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 pl-4 border-l-2 ml-2" style={{ borderColor: `${theme?.colors.primary}30` }}>
                      {levelChallenges.map(challenge => {
                        const challengeLevel = getChallengeLevel(challenge.id);
                        const isLocked = userLevel < challengeLevel;

                        return (
                        <div 
                          key={challenge.id} 
                          className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 hover:scale-[1.01] ${
                            challenge.completed 
                              ? 'shadow-md border-l-4' 
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
                            <div className="mr-4 flex-shrink-0">
                              {challenge.completed ? (
                                <div 
                                  className="p-1 rounded-full"
                                  style={{ backgroundColor: `${theme?.colors.secondary}30` }}
                                >
                                  <CheckCircle2 className="w-6 h-6" style={{ color: theme?.colors.secondary }} />
                                </div>
                              ) : isLocked ? (
                                <Lock className="w-6 h-6 text-muted-foreground" />
                              ) : (
                                <Circle className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p 
                                className={`font-medium leading-tight ${
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
                                  <span className="text-sm text-muted-foreground font-medium">
                                    {challenge.xp} XP
                                  </span>
                                </div>
                                {isLocked && (
                                  <span className="text-sm text-muted-foreground">
                                    | Unlocks at Level {challengeLevel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {challenge.completed && (
                            <div 
                              className="text-xs font-bold px-3 py-1 rounded-full ml-2 flex items-center gap-1"
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

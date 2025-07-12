import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, Trophy, Star, Target, Award, Shield, Crown, Ghost, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Challenge as ChallengeType } from '../config/challenges';
import { getRankForLevel, RANKS as ALL_RANKS } from '../config/ranks';
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Profile } from "./Index";
import { PageHeader } from "../components/PageHeader";
import { toast } from "sonner";

export interface Challenge extends ChallengeType {
  completed: boolean;
}

interface ChallengePageProps {
  userLevel: number;
  userXp: number;
  xpToNextLevel: number;
  challenges: Challenge[];
  onBack: () => void;
  hasStartedChallenges: boolean;
  onStartChallenges: () => void;
}

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
  desktopView?: boolean;
}

export const ChallengePage = ({ userLevel, userXp, xpToNextLevel, challenges, onBack, hasStartedChallenges, onStartChallenges }: ChallengePageProps) => {
  const { desktopView } = useOutletContext<OutletContextType & { desktopView?: boolean }>();
  const progressPercentage = xpToNextLevel > 0 ? Math.round((userXp / xpToNextLevel) * 100) : 0;
  const rank = getRankForLevel(userLevel);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const isAvi = rank.name === 'Avi';

  // Challenges now start automatically; no toast or manual start needed

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const completedChallenges = isAvi ? challenges.length : challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const nextRank = ALL_RANKS.find(r => r.level > userLevel);

  // Simplified 4-level system
  const getChallengeLevel = (challengeId: number) => {
    if (challengeId <= 19) return 1; // Explorer
    if (challengeId <= 38) return 2; // Warrior  
    if (challengeId <= 57) return 3; // Master
    return 4; // Legend
  };
  
  const challengesByLevel = challenges.reduce<Record<number, Challenge[]>>((acc, challenge) => {
    const level = getChallengeLevel(challenge.id);
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(challenge);
    return acc;
  }, {});

  // Level configurations with theme colors
  const levelConfigs = {
    1: { 
      name: 'Explorer', 
      color: 'bg-primary/10 border-primary/30 text-primary', 
      icon: Award,
      theme: 'Beginner challenges'
    },
    2: { 
      name: 'Warrior', 
      color: 'bg-primary/10 border-primary/30 text-primary', 
      icon: Shield,
      theme: 'Build consistency'
    },
    3: { 
      name: 'Master', 
      color: 'bg-primary/10 border-primary/30 text-primary', 
      icon: Trophy,
      theme: 'Advanced challenges'
    },
    4: { 
      name: 'Legend', 
      color: 'bg-primary/10 border-primary/30 text-primary', 
      icon: Crown,
      theme: 'Ultimate challenges'
    }
  };

  return (
    <div className={desktopView ? "min-h-screen bg-background" : "min-h-screen bg-background"}>
      <div className={desktopView ? "max-w-5xl mx-auto p-8 space-y-8" : "max-w-4xl mx-auto p-4 space-y-6"}>
        <PageHeader title="Challenges" onBack={onBack} />
        
        {/* Unified Information Bar */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 rounded-xl">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left side - Rank and Level Info */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <rank.Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-primary">{rank.name}</h3>
                      <Badge variant="secondary" className="text-xs">Lvl {userLevel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {nextRank ? `Next: ${nextRank.name}` : "Maximum Level Reached!"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Center - Progress Bar */}
              <div className="flex-1 lg:mx-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-primary">Progress to Next Rank</span>
                    <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3 bg-muted rounded-full" />
                </div>
              </div>

              {/* Right side - Stats and Actions */}
              <div className="flex items-center gap-6">
                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">{isAvi ? totalChallenges : completedChallenges}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">/{totalChallenges}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Star className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">{isAvi ? '∞' : userXp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">XP</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <Target className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-primary">
                        {isAvi ? '∞' : (nextRank ? `${xpToNextLevel - userXp}` : 'MAX')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Left</p>
                  </div>
                </div>

                {/* View Ranks Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="font-semibold text-primary border-primary/40 flex items-center gap-1">
                      View Ranks
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <UIDialogHeader>
                      <DialogTitle>All Ranks</DialogTitle>
                      <DialogDescription>See all available ranks and their descriptions.</DialogDescription>
                    </UIDialogHeader>
                    <div className="grid grid-cols-1 gap-4 mt-4">
                      {ALL_RANKS.map(rank => (
                        <div key={rank.name} className="flex items-center gap-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
                          <rank.Icon className="w-8 h-8 text-primary" />
                          <div>
                            <div className="font-bold text-lg text-primary">{rank.name}</div>
                            <div className="text-xs text-muted-foreground">{rank.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-8">
          <>
            {/* Avi Special Display */}
            {isAvi && (
              <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300 rounded-2xl">
                <CardHeader className="text-center pb-2">
                  <div className="p-4 rounded-full bg-yellow-200/40 mb-2 w-fit mx-auto">
                    <Ghost className="w-14 h-14 text-yellow-600" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold text-yellow-700">Avi Rank</CardTitle>
                  <p className="text-lg font-semibold text-yellow-600">God Level Achieved</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-yellow-700 mb-3 text-lg">
                    🎉 You've unlocked everything and achieved the highest rank!
                  </p>
                  <Badge className="bg-yellow-200 text-yellow-800 border-yellow-400 text-base px-4 py-2">
                    All {totalChallenges} Challenges Complete
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Challenge Levels */}
            {!isAvi && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(challengesByLevel)
                  .sort(([a], [b]) => Number(a) - Number(b))
                  .map(([level, levelChallenges]) => {
                    const levelNum = Number(level);
                    const config = levelConfigs[levelNum as keyof typeof levelConfigs];
                    const completedInLevel = levelChallenges.filter(c => c.completed).length;
                    const totalInLevel = levelChallenges.length;
                    const isUnlocked = userLevel >= levelNum;
                    const progressInLevel = totalInLevel > 0 ? (completedInLevel / totalInLevel) * 100 : 0;

                    return (
                      <Card
                        key={level}
                        className={`shadow-lg transition-all hover:shadow-2xl border-2 ${config.color} ${!isUnlocked ? 'opacity-60' : ''} rounded-xl`}
                      >
                        <CardHeader className="pb-2 flex flex-row items-center gap-4">
                          <div className={`p-3 rounded-full ${isUnlocked ? 'bg-primary/20' : 'bg-muted/20'}`}> 
                            <config.icon className={`w-8 h-8 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                              Level {level}: {config.name}
                              {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">{config.theme}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                              {completedInLevel}/{totalInLevel}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <Progress value={progressInLevel} className="h-2 rounded-full" />
                            {/* Challenge List - Scrollable */}
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                              {levelChallenges.map(challenge => {
                                const challengeLevel = getChallengeLevel(challenge.id);
                                const isChallengeUnlocked = userLevel >= challengeLevel;

                                return (
                                  <div
                                    key={challenge.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer transition-colors border border-transparent hover:border-primary/30 ${
                                      challenge.completed
                                        ? 'bg-primary/10 text-primary'
                                        : !isChallengeUnlocked
                                        ? 'bg-muted/30 text-muted-foreground'
                                        : 'bg-card text-foreground hover:bg-primary/5'
                                    }`}
                                    onClick={() => isChallengeUnlocked && handleChallengeClick(challenge)}
                                    tabIndex={isChallengeUnlocked ? 0 : -1}
                                    role="button"
                                    aria-disabled={!isChallengeUnlocked}
                                    style={{ opacity: isChallengeUnlocked ? 1 : 0.6 }}
                                  >
                                    {challenge.completed ? (
                                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    ) : !isChallengeUnlocked ? (
                                      <Lock className="w-4 h-4 shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 shrink-0" />
                                    )}
                                    <span className="flex-1 truncate font-medium">{challenge.text}</span>
                                    <Badge variant="outline" className="text-xs px-2 py-1">{challenge.xp} XP</Badge>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="text-right">
                              <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                                {completedInLevel}/{totalInLevel}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </>
        </div>
        <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
          <DialogContent className="p-0 overflow-hidden rounded-xl max-w-xs">
            {selectedChallenge && (
              <div className="bg-gradient-to-r from-primary/80 to-primary/60 px-4 py-3 flex items-center gap-2">
                <Star className="w-7 h-7 text-white drop-shadow" />
                <h2 className="text-base font-bold text-white leading-tight flex-1">{selectedChallenge.text}</h2>
              </div>
            )}
            <div className="p-4 flex flex-col gap-2 items-start">
              <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/30">{selectedChallenge?.xp} XP</Badge>
              <span className={`text-xs font-semibold ${selectedChallenge?.completed ? 'text-green-600' : 'text-muted-foreground'}`}>{selectedChallenge?.completed ? 'Completed' : 'Incomplete'}</span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
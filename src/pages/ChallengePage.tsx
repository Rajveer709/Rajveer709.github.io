import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, Trophy, Star, Target, Award, Shield, Crown, Ghost } from "lucide-react";
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
        
        {/* View All Ranks Button */}
        <div className="flex justify-end mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-semibold text-primary border-primary/40">
                View All Ranks
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

        <div className="flex flex-col gap-6">
          <>
            {/* User Status Overview - Optimized for Portrait */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 rounded-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-primary flex items-center gap-3">
                  <rank.Icon className="w-6 h-6" />
                  Your Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Rank & Level */}
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <rank.Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{rank.name}</p>
                      <p className="text-sm text-muted-foreground">Current Rank</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">Level {userLevel}</Badge>
                </div>

                {/* Progress Stats Grid - Portrait Optimized */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Completed Challenges */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/15">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{isAvi ? totalChallenges : completedChallenges}/{totalChallenges}</p>
                      <p className="text-xs text-muted-foreground">Challenges Completed</p>
                    </div>
                  </div>

                  {/* Total XP */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/15">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{isAvi ? '∞' : userXp}</p>
                      <p className="text-xs text-muted-foreground">Total Experience Points</p>
                    </div>
                  </div>

                  {/* XP to Next Level */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/15">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary">
                        {isAvi ? '∞' : (nextRank ? `${xpToNextLevel - userXp}` : 'MAX')}
                      </p>
                      <p className="text-xs text-muted-foreground">XP to Next Rank</p>
                    </div>
                  </div>

                  {/* Progress Percentage */}
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/15">
                    <div className="relative w-8 h-8">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e0e0e0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          strokeDasharray={`${progressPercentage}, 100`}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary">{progressPercentage}%</p>
                      <p className="text-xs text-muted-foreground">Progress Complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Level Progress Bar */}
            <Card className="bg-primary/5 border-primary/20 rounded-xl">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-primary">Progress to Next Rank</h3>
                      <p className="text-sm text-muted-foreground">
                        {nextRank ? `${nextRank.name} Rank` : "Maximum Level Reached!"}
                      </p>
                    </div>
                                      <div className="text-sm px-2 py-1 rounded-full border border-primary/30 text-primary bg-primary/10">
                    {progressPercentage}%
                  </div>
                  </div>
                  <Progress value={progressPercentage} className="h-3 bg-muted rounded-full" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Current: {userXp} XP</span>
                    <span>Next: {xpToNextLevel} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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

            {/* Challenge Levels - Portrait Optimized */}
            {!isAvi && (
              <div className="space-y-6">
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
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${isUnlocked ? 'bg-primary/20' : 'bg-muted/20'}`}> 
                              <config.icon className={`w-8 h-8 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-xl flex items-center gap-2">
                                Level {level}: {config.name}
                                {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">{config.theme}</p>
                            </div>
                                                         <div className="text-right">
                               <div className={`text-sm px-2 py-1 rounded-full ${isUnlocked ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                                 {completedInLevel}/{totalInLevel}
                               </div>
                             </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{Math.round(progressInLevel)}%</span>
                              </div>
                              <Progress value={progressInLevel} className="h-2 rounded-full" />
                            </div>
                            
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
                                    <div className="text-xs px-2 py-1 rounded-full border border-primary/30 text-primary">{challenge.xp} XP</div>
                                  </div>
                                );
                              })}
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
              <div className="text-xs px-2 py-1 rounded-full border border-primary/30 text-primary bg-primary/10">{selectedChallenge?.xp} XP</div>
              <span className={`text-xs font-semibold ${selectedChallenge?.completed ? 'text-green-600' : 'text-muted-foreground'}`}>{selectedChallenge?.completed ? 'Completed' : 'Incomplete'}</span>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader as UIDialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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

  useEffect(() => {
    if (!hasStartedChallenges) {
      toast.info("Welcome to Challenges!", {
        description: "Start your journey to unlock new themes and ranks!",
        action: {
          label: "Start Challenges",
          onClick: () => handleStartChallenges()
        }
      });
    }
  }, [hasStartedChallenges]);

  const handleStartChallenges = () => {
    onStartChallenges();
  };

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
        <div className="flex flex-col gap-8">
          {!hasStartedChallenges && (
            <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 shadow-xl rounded-2xl">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <Star className="w-20 h-20 mb-4 text-primary animate-bounce" />
                <h3 className="text-2xl font-extrabold mb-2">Ready to Start Your Journey?</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Complete challenges to unlock new themes and climb the ranks!
                </p>
                <Button onClick={handleStartChallenges} size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8 py-3 text-lg">
                  <Star className="w-5 h-5 mr-2" />
                  Start Challenges
                </Button>
              </CardContent>
            </Card>
          )}

          {hasStartedChallenges && (
            <>
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center bg-primary/5 border-primary/20 rounded-xl">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-12 h-12 mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                      <rank.Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Rank</p>
                    <p className="font-bold text-lg text-primary">{rank.name}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">Level {userLevel}</Badge>
                  </CardContent>
                </Card>
                <Card className="text-center bg-primary/5 border-primary/20 rounded-xl">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-12 h-12 mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Completed</p>
                    <p className="font-bold text-lg text-primary">{isAvi ? totalChallenges : completedChallenges}</p>
                    <p className="text-xs text-muted-foreground">of {totalChallenges}</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-primary/5 border-primary/20 rounded-xl">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-12 h-12 mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">XP</p>
                    <p className="font-bold text-lg text-primary">{isAvi ? '∞' : userXp}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </CardContent>
                </Card>
                <Card className="text-center bg-primary/5 border-primary/20 rounded-xl">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-12 h-12 mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Next</p>
                    <p className="font-bold text-lg text-primary">
                      {isAvi ? '∞' : (nextRank ? `${xpToNextLevel - userXp}` : 'MAX')}
                    </p>
                    <p className="text-xs text-muted-foreground">XP left</p>
                  </CardContent>
                </Card>
              </div>

              {/* Level Progress */}
              <Card className="bg-primary/5 border-primary/20 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-primary">Progress to Next Rank</h3>
                      <p className="text-xs text-muted-foreground">
                        {nextRank ? `${nextRank.name} Rank` : "Maximum Level Reached!"}
                      </p>
                    </div>
                    <div className="flex-1 md:ml-8">
                      <Progress value={progressPercentage} className="h-4 bg-muted rounded-full" />
                      <p className="text-center text-xs text-muted-foreground mt-1">
                        {progressPercentage}% complete
                      </p>
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
          )}
        </div>
        <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
          <DialogContent>
            <UIDialogHeader>
              <DialogTitle>{selectedChallenge?.text}</DialogTitle>
              <DialogDescription>XP Reward: {selectedChallenge?.xp}</DialogDescription>
              {selectedChallenge && (
                <div className="mt-4 text-sm text-foreground space-y-2">
                  <div><b>Challenge ID:</b> {selectedChallenge.id}</div>
                  <div><b>Status:</b> {selectedChallenge.completed ? 'Completed' : 'Incomplete'}</div>
                  {/* Add more details here if available, e.g. description, tips, etc. */}
                </div>
              )}
            </UIDialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
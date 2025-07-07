import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Level configurations
  const levelConfigs = {
    1: { 
      name: 'Explorer', 
      color: 'bg-blue-50 border-blue-200', 
      icon: Award,
      theme: 'Beginner challenges'
    },
    2: { 
      name: 'Warrior', 
      color: 'bg-green-50 border-green-200', 
      icon: Shield,
      theme: 'Build consistency'
    },
    3: { 
      name: 'Master', 
      color: 'bg-purple-50 border-purple-200', 
      icon: Trophy,
      theme: 'Advanced challenges'
    },
    4: { 
      name: 'Legend', 
      color: 'bg-yellow-50 border-yellow-200', 
      icon: Crown,
      theme: 'Ultimate challenges'
    }
  };

  return (
    <div className={desktopView ? "min-h-screen bg-background" : "min-h-screen"}>
      <div className={desktopView ? "max-w-6xl mx-auto p-8 space-y-8" : "max-w-4xl mx-auto p-4 space-y-6"}>
        <PageHeader title="Challenges" onBack={onBack} />

        {!hasStartedChallenges && (
          <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 shadow-lg">
            <CardContent className="p-6 text-center">
              <Star className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Ready to Start Your Journey?</h3>
              <p className="text-muted-foreground mb-4">
                Complete challenges to unlock new themes and climb the ranks!
              </p>
              <Button onClick={handleStartChallenges} size="lg" className="bg-primary hover:bg-primary/90">
                <Star className="w-4 h-4 mr-2" />
                Start Challenges
              </Button>
            </CardContent>
          </Card>
        )}

        {hasStartedChallenges && (
          <>
            {/* Progress Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <rank.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Current Rank</p>
                  <p className="font-bold text-lg text-primary">{rank.name}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Level {userLevel}</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-bold text-lg text-primary">{isAvi ? totalChallenges : completedChallenges}</p>
                  <p className="text-xs text-muted-foreground">out of {totalChallenges}</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                  <p className="font-bold text-lg text-primary">{isAvi ? '∞' : userXp}</p>
                  <p className="text-xs text-muted-foreground">experience</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Next Level</p>
                  <p className="font-bold text-lg text-primary">
                    {isAvi ? '∞' : (nextRank ? `${xpToNextLevel - userXp}` : 'MAX')}
                  </p>
                  <p className="text-xs text-muted-foreground">XP needed</p>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Level Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {nextRank ? `Advance to ${nextRank.name}` : "You've reached the pinnacle!"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{userXp} XP</span>
                    <span className="text-muted-foreground">{nextRank ? `${xpToNextLevel} XP` : 'Maximum Level!'}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-4 bg-muted" />
                  <p className="text-center text-xs text-muted-foreground">
                    {progressPercentage}% to next rank
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Avi Special Display */}
            {isAvi && (
              <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300">
                <CardHeader className="text-center">
                  <div className="p-4 rounded-full bg-yellow-200/40 mb-2 w-fit mx-auto">
                    <Ghost className="w-12 h-12 text-yellow-600" />
                  </div>
                  <CardTitle className="text-3xl font-extrabold text-yellow-700">Rank: Avi</CardTitle>
                  <p className="text-lg font-semibold text-yellow-600">Level: God</p>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-yellow-700 mb-4">
                    🎉 Congratulations! You've unlocked everything and achieved the highest rank!
                  </p>
                  <div className="text-center">
                    <Badge className="bg-yellow-200 text-yellow-800 border-yellow-400">
                      All {totalChallenges} Challenges Complete
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Challenge Levels */}
            {!isAvi && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        className={`shadow-lg transition-all hover:shadow-xl border-2 ${config.color} ${!isUnlocked ? 'opacity-75' : ''}`}
                      >
                        <CardHeader className="pb-3">
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
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {completedInLevel}/{totalInLevel} Complete
                              </span>
                              <Badge variant={isUnlocked ? "default" : "secondary"}>
                                {Math.round(progressInLevel)}%
                              </Badge>
                            </div>
                            <Progress value={progressInLevel} className="h-2" />
                            
                            {/* Challenge List */}
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {levelChallenges.slice(0, 5).map(challenge => {
                                const challengeLevel = getChallengeLevel(challenge.id);
                                const isChallengeUnlocked = userLevel >= challengeLevel;

                                return (
                                  <div
                                    key={challenge.id}
                                    className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                                      challenge.completed 
                                        ? 'bg-primary/10 border border-primary/20' 
                                        : !isChallengeUnlocked 
                                        ? 'bg-muted/30' 
                                        : 'bg-card/60 border border-border'
                                    }`}
                                  >
                                    {challenge.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                    ) : !isChallengeUnlocked ? (
                                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className={`font-medium leading-tight ${
                                        challenge.completed 
                                          ? 'text-primary' 
                                          : !isChallengeUnlocked 
                                          ? 'text-muted-foreground' 
                                          : 'text-foreground'
                                      }`}>
                                        {challenge.text}
                                      </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                      {challenge.xp} XP
                                    </Badge>
                                  </div>
                                );
                              })}
                              {levelChallenges.length > 5 && (
                                <p className="text-xs text-muted-foreground text-center">
                                  +{levelChallenges.length - 5} more challenges...
                                </p>
                              )}
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
    </div>
  );
};
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
    <div className={desktopView ? "min-h-screen bg-background" : "min-h-screen"}>
      <div className={desktopView ? "max-w-5xl mx-auto p-8 space-y-6" : "max-w-4xl mx-auto p-4 space-y-4"}>
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
            {/* Progress Overview - Simplified */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="text-center bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="w-8 h-8 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <rank.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="font-bold text-sm text-primary">{rank.name}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Level {userLevel}</Badge>
                </CardContent>
              </Card>

              <Card className="text-center bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="w-8 h-8 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-bold text-sm text-primary">{isAvi ? totalChallenges : completedChallenges}</p>
                  <p className="text-xs text-muted-foreground">of {totalChallenges}</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="w-8 h-8 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="font-bold text-sm text-primary">{isAvi ? '∞' : userXp}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-primary/5 border-primary/20">
                <CardContent className="p-3">
                  <div className="w-8 h-8 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Next</p>
                  <p className="font-bold text-sm text-primary">
                    {isAvi ? '∞' : (nextRank ? `${xpToNextLevel - userXp}` : 'MAX')}
                  </p>
                  <p className="text-xs text-muted-foreground">XP left</p>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress - Simplified */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-primary">Progress to Next Rank</h3>
                    <p className="text-xs text-muted-foreground">
                      {nextRank ? `${nextRank.name} Rank` : "Maximum Level Reached!"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={progressPercentage} className="h-3 bg-muted" />
                  <p className="text-center text-xs text-muted-foreground">
                    {progressPercentage}% complete
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Avi Special Display */}
            {isAvi && (
              <Card className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300">
                <CardHeader className="text-center pb-2">
                  <div className="p-3 rounded-full bg-yellow-200/40 mb-2 w-fit mx-auto">
                    <Ghost className="w-10 h-10 text-yellow-600" />
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-yellow-700">Avi Rank</CardTitle>
                  <p className="text-base font-semibold text-yellow-600">God Level Achieved</p>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-yellow-700 mb-3">
                    🎉 You've unlocked everything and achieved the highest rank!
                  </p>
                  <Badge className="bg-yellow-200 text-yellow-800 border-yellow-400">
                    All {totalChallenges} Challenges Complete
                  </Badge>
                </CardContent>
              </Card>
            )}

            {/* Challenge Levels - Simplified Layout */}
            {!isAvi && (
              <div className="space-y-4">
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
                        className={`shadow-md transition-all hover:shadow-lg border-2 ${config.color} ${!isUnlocked ? 'opacity-60' : ''}`}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${isUnlocked ? 'bg-primary/20' : 'bg-muted/20'}`}>
                              <config.icon className={`w-6 h-6 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg flex items-center gap-2">
                                Level {level}: {config.name}
                                {!isUnlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground">{config.theme}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                                {completedInLevel}/{totalInLevel}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            <Progress value={progressInLevel} className="h-2" />
                            
                            {/* Challenge Preview - Show first 3 */}
                            <div className="space-y-1">
                              {levelChallenges.slice(0, 3).map(challenge => {
                                const challengeLevel = getChallengeLevel(challenge.id);
                                const isChallengeUnlocked = userLevel >= challengeLevel;

                                return (
                                  <div
                                    key={challenge.id}
                                    className={`flex items-center gap-2 p-2 rounded text-xs ${
                                      challenge.completed 
                                        ? 'bg-primary/10 text-primary' 
                                        : !isChallengeUnlocked 
                                        ? 'bg-muted/30 text-muted-foreground' 
                                        : 'bg-card text-foreground'
                                    }`}
                                  >
                                    {challenge.completed ? (
                                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    ) : !isChallengeUnlocked ? (
                                      <Lock className="w-3 h-3 shrink-0" />
                                    ) : (
                                      <Circle className="w-3 h-3 shrink-0" />
                                    )}
                                    <span className="flex-1 truncate">{challenge.text}</span>
                                    <Badge variant="outline" className="text-xs px-1">
                                      {challenge.xp}
                                    </Badge>
                                  </div>
                                );
                              })}
                              {levelChallenges.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center py-1">
                                  +{levelChallenges.length - 3} more challenges
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
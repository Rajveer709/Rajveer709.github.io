import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, ChevronDown, Trophy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Challenge as ChallengeType } from '../config/challenges';
import { getRankForLevel, RANKS as ALL_RANKS } from '../config/ranks';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Profile } from "./Index";
import { PageHeader } from "../components/PageHeader";

export interface Challenge extends ChallengeType {
  completed: boolean;
}

interface ChallengePageProps {
  userLevel: number;
  userXp: number;
  xpToNextLevel: number;
  challenges: Challenge[];
  onBack: () => void;
}

interface OutletContextType {
  profile: Profile | null;
  onUpdateProfile: (updatedProfile: Partial<Profile>, avatarFile?: File) => Promise<void>;
  showGreeting: boolean;
}

export const ChallengePage = ({ userLevel, userXp, xpToNextLevel, challenges, onBack }: ChallengePageProps) => {
  const { profile, onUpdateProfile, showGreeting } = useOutletContext<OutletContextType>();
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

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const nextRank = ALL_RANKS.find(r => r.level > userLevel);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Challenges" onBack={onBack} />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <rank.Icon className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Rank</p>
                <p className="font-bold text-lg">{rank.name}</p>
                <p className="text-xs text-muted-foreground">Level {userLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-bold text-lg">{completedChallenges}/{totalChallenges}</p>
                <p className="text-xs text-muted-foreground">challenges</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total XP</p>
                <p className="font-bold text-lg">{userXp}</p>
                <p className="text-xs text-muted-foreground">experience points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rank Progress */}
      <Card className="bg-gradient-to-r from-background via-background/50 to-background">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Rank Progress</CardTitle>
              <CardDescription>
                {nextRank ? `${xpToNextLevel - userXp} XP needed for ${nextRank.name}` : 'You\'ve reached the highest rank!'}
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  <Trophy className="w-4 h-4 mr-2" />
                  All Ranks
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Rank System
                  </DialogTitle>
                  <DialogDescription>
                    Complete challenges to earn XP and unlock new ranks.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                  {ALL_RANKS.map((r) => (
                    <div 
                      key={r.level} 
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        userLevel >= r.level ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                      }`}
                    >
                      <r.Icon className={`w-6 h-6 ${userLevel >= r.level ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <p className={`font-medium ${userLevel >= r.level ? 'text-primary' : 'text-muted-foreground'}`}>
                          {r.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Level {r.level}</p>
                      </div>
                      {userLevel >= r.level && (
                        <Badge variant="secondary" className="text-xs">Unlocked</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{userXp} XP</span>
              <span className="text-muted-foreground">{nextRank ? `${xpToNextLevel} XP` : 'Max'}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Challenges by Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Challenge Levels
          </CardTitle>
          <CardDescription>
            Complete challenges to gain XP and progress through the ranks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(challengesByLevel)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([level, levelChallenges]) => {
                const levelRank = getRankForLevel(Number(level));
                const completedInLevel = levelChallenges.filter(c => c.completed).length;
                const totalInLevel = levelChallenges.length;
                const isUnlocked = userLevel >= Number(level);
                
                return (
                  <Collapsible 
                    key={level} 
                    defaultOpen={userLevel >= Number(level) || userLevel + 1 === Number(level)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-all group border border-transparent hover:border-primary/20">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${isUnlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                          <levelRank.Icon className={`w-5 h-5 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold">Level {level}</p>
                          <p className="text-sm text-muted-foreground">
                            {completedInLevel}/{totalInLevel} completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                          {levelRank.name}
                        </Badge>
                        <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="mt-3 space-y-2 pl-6 border-l-2 border-primary/10">
                        {levelChallenges.map(challenge => {
                          const challengeLevel = getChallengeLevel(challenge.id);
                          const isLocked = userLevel < challengeLevel;

                          return (
                            <div 
                              key={challenge.id} 
                              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                                challenge.completed 
                                  ? 'bg-primary/5 border border-primary/20' 
                                  : isLocked 
                                  ? 'bg-muted/30' 
                                  : 'bg-background border border-border'
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {challenge.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                ) : isLocked ? (
                                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium leading-tight ${
                                    challenge.completed 
                                      ? 'text-primary' 
                                      : isLocked 
                                      ? 'text-muted-foreground' 
                                      : 'text-foreground'
                                  }`}>
                                    {challenge.text}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                      {challenge.xp} XP
                                    </Badge>
                                    {isLocked && (
                                      <span className="text-xs text-muted-foreground">
                                        Unlocks at Level {challengeLevel}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {challenge.completed && (
                                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-xs">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

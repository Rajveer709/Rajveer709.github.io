import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, Trophy, Star, Target, Zap, Award, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Challenge as ChallengeType } from '../config/challenges';
import { getRankForLevel, RANKS as ALL_RANKS } from '../config/ranks';
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

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const nextRank = ALL_RANKS.find(r => r.level > userLevel);

  // Level configurations with colors and themes
  const levelConfigs = {
    1: { 
      name: 'Explorer', 
      color: 'from-blue-500/20 to-cyan-500/10', 
      borderColor: 'border-blue-500/30',
      icon: Award,
      theme: 'Beginner challenges to get you started'
    },
    2: { 
      name: 'Warrior', 
      color: 'from-orange-500/20 to-red-500/10', 
      borderColor: 'border-orange-500/30',
      icon: Shield,
      theme: 'Build strength and consistency'
    },
    3: { 
      name: 'Master', 
      color: 'from-purple-500/20 to-pink-500/10', 
      borderColor: 'border-purple-500/30',
      icon: Trophy,
      theme: 'Advanced challenges for experts'
    },
    4: { 
      name: 'Legend', 
      color: 'from-yellow-500/20 to-amber-500/10', 
      borderColor: 'border-yellow-500/30',
      icon: Crown,
      theme: 'Ultimate challenges for legends'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <PageHeader title="Challenges" onBack={onBack} />

        {/* Hero Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                <rank.Icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Current Rank</p>
              <p className="font-bold text-lg text-primary">{rank.name}</p>
              <Badge variant="secondary" className="mt-1 text-xs">Level {userLevel}</Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-green-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="font-bold text-lg text-green-600">{completedChallenges}</p>
              <p className="text-xs text-muted-foreground">out of {totalChallenges}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-xs text-muted-foreground">Total XP</p>
              <p className="font-bold text-lg text-purple-600">{userXp}</p>
              <p className="text-xs text-muted-foreground">experience</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/30 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 mx-auto mb-2 bg-amber-500/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-xs text-muted-foreground">Next Level</p>
              <p className="font-bold text-lg text-amber-600">
                {nextRank ? `${xpToNextLevel - userXp}` : 'MAX'}
              </p>
              <p className="text-xs text-muted-foreground">XP needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold">Level Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {nextRank ? `Advance to ${nextRank.name}` : "You've reached the pinnacle!"}
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <Trophy className="w-4 h-4 mr-2" />
                    View All Ranks
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-primary" />
                      Rank System
                    </DialogTitle>
                    <DialogDescription>
                      Progress through 4 amazing ranks by completing challenges!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {ALL_RANKS.slice(0, 4).map((r) => {
                      const config = levelConfigs[r.level as keyof typeof levelConfigs];
                      return (
                        <div 
                          key={r.level} 
                          className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                            userLevel >= r.level ? `bg-gradient-to-r ${config.color} ${config.borderColor} border-2` : 'bg-muted/50'
                          }`}
                        >
                          <r.Icon className={`w-8 h-8 ${userLevel >= r.level ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <p className={`font-bold text-lg ${userLevel >= r.level ? 'text-primary' : 'text-muted-foreground'}`}>
                              {r.name}
                            </p>
                            <p className="text-sm text-muted-foreground">{config.theme}</p>
                          </div>
                          {userLevel >= r.level && (
                            <Badge className="bg-primary text-primary-foreground">Unlocked!</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </DialogContent>
              </Dialog>
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

        {/* Challenge Levels Grid */}
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
                  className={`shadow-xl transition-all hover:shadow-2xl bg-gradient-to-br ${config.color} border-2 ${config.borderColor} ${!isUnlocked ? 'opacity-75' : ''}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full bg-gradient-to-br ${isUnlocked ? 'from-primary/20 to-primary/10' : 'from-muted/20 to-muted/10'}`}>
                        <config.icon className={`w-8 h-8 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          Level {level}: {config.name}
                          {!isUnlocked && <Lock className="w-5 h-5 text-muted-foreground" />}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {config.theme}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {completedInLevel}/{totalInLevel} Complete
                        </span>
                        <Badge 
                          variant={isUnlocked ? "default" : "secondary"}
                          className={isUnlocked ? "bg-primary/20 text-primary hover:bg-primary/30" : ""}
                        >
                          {Math.round(progressInLevel)}%
                        </Badge>
                      </div>
                      <Progress value={progressInLevel} className="h-2" />
                      
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {levelChallenges.slice(0, 5).map(challenge => {
                          const challengeLevel = getChallengeLevel(challenge.id);
                          const isLocked = userLevel < challengeLevel;

                          return (
                            <div 
                              key={challenge.id} 
                              className={`flex items-center gap-3 p-2 rounded-lg transition-all text-sm ${
                                challenge.completed 
                                  ? 'bg-primary/10 border border-primary/20' 
                                  : isLocked 
                                  ? 'bg-muted/30' 
                                  : 'bg-background/50 border border-border'
                              }`}
                            >
                              {challenge.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                              ) : isLocked ? (
                                <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className={`font-medium leading-tight truncate ${
                                  challenge.completed 
                                    ? 'text-primary' 
                                    : isLocked 
                                    ? 'text-muted-foreground' 
                                    : 'text-foreground'
                                }`}>
                                  {challenge.text}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {challenge.xp} XP
                              </Badge>
                            </div>
                          );
                        })}
                        {levelChallenges.length > 5 && (
                          <p className="text-xs text-center text-muted-foreground py-2">
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
      </div>
    </div>
  );
};

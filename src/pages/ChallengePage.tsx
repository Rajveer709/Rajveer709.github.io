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
        <div className="flex flex-col gap-8">
          <>
            {/* Progress Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center bg-primary/5 border-primary/20 rounded-xl min-h-[110px] p-0">
                <CardContent className="p-3 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 mb-1 bg-primary/20 rounded-full flex items-center justify-center">
                    <rank.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="font-bold text-base text-primary leading-tight">{rank.name}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">Lvl {userLevel}</Badge>
                </CardContent>
              </Card>
              <Card className="text-center bg-primary/5 border-primary/20 rounded-xl min-h-[110px] p-0">
                <CardContent className="p-3 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 mb-1 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-bold text-base text-primary leading-tight">{isAvi ? totalChallenges : completedChallenges}</p>
                  <p className="text-xs text-muted-foreground">/ {totalChallenges}</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-primary/5 border-primary/20 rounded-xl min-h-[110px] p-0">
                <CardContent className="p-3 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 mb-1 bg-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">XP</p>
                  <p className="font-bold text-base text-primary leading-tight">{isAvi ? '∞' : userXp}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </CardContent>
              </Card>
              <Card className="text-center bg-primary/5 border-primary/20 rounded-xl min-h-[110px] p-0">
                <CardContent className="p-3 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 mb-1 bg-primary/20 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Next</p>
                  <p className="font-bold text-base text-primary leading-tight">
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
        </div>
        <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
          <DialogContent className="p-0 overflow-hidden rounded-2xl max-w-md border-0 shadow-2xl">
            {selectedChallenge && (
              <>
                {/* Enhanced Header with Gradient and Icon */}
                <div className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-6 py-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                      {selectedChallenge.completed ? (
                        <Trophy className="w-8 h-8 text-white" />
                      ) : (
                        <Target className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white leading-tight mb-2">
                        {selectedChallenge.text}
                      </h2>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {selectedChallenge.xp} XP
                        </Badge>
                        <Badge 
                          variant={selectedChallenge.completed ? "default" : "secondary"}
                          className={`${selectedChallenge.completed ? 'bg-green-500 text-white' : 'bg-white/20 text-white border-white/30'}`}
                        >
                          {selectedChallenge.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-6 space-y-6">
                  {/* Challenge Details */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Challenge Details</h3>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${selectedChallenge.completed ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-sm text-muted-foreground">
                          {selectedChallenge.completed ? 'Achievement Unlocked' : 'Ready to Complete'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Reward</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">{selectedChallenge.xp} XP</p>
                        <p className="text-xs text-muted-foreground">Experience Points</p>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Level</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">{getChallengeLevel(selectedChallenge.id)}</p>
                        <p className="text-xs text-muted-foreground">
                          {levelConfigs[getChallengeLevel(selectedChallenge.id) as keyof typeof levelConfigs]?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-foreground">Challenge Progress</h4>
                      <span className="text-xs text-muted-foreground">
                        {selectedChallenge.completed ? '100%' : '0%'} Complete
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ease-out rounded-full ${
                            selectedChallenge.completed 
                              ? 'bg-gradient-to-r from-green-500 to-green-600' 
                              : 'bg-gradient-to-r from-primary to-primary/80'
                          }`}
                          style={{ width: selectedChallenge.completed ? '100%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90 text-white"
                      onClick={() => setSelectedChallenge(null)}
                    >
                      {selectedChallenge.completed ? 'Close' : 'Got It'}
                    </Button>
                    {!selectedChallenge.completed && (
                      <Button 
                        variant="outline" 
                        className="flex-1 border-primary/30 text-primary hover:bg-primary/5"
                        onClick={() => {
                          // Here you could add logic to mark challenge as completed
                          setSelectedChallenge(null);
                        }}
                      >
                        Mark Complete
                      </Button>
                    )}
                  </div>

                  {/* Motivational Message */}
                  {!selectedChallenge.completed && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">Ready to take on this challenge?</p>
                          <p className="text-xs text-blue-700">Complete it to earn {selectedChallenge.xp} XP and level up!</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Completion Celebration */}
                  {selectedChallenge.completed && (
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                          <Trophy className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-900">Challenge Completed! 🎉</p>
                          <p className="text-xs text-green-700">You earned {selectedChallenge.xp} XP for this achievement!</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, Trophy, Star, Target, Zap, Award, Shield, Crown, Ghost, Gift, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Challenge as ChallengeType } from '../config/challenges';
import { getRankForLevel, RANKS as ALL_RANKS } from '../config/ranks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Profile } from "./Index";
import { PageHeader } from "../components/PageHeader";
import { toast } from "sonner";
import { themes } from '../config/themes';
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

export const ChallengePage = ({ userLevel, userXp, xpToNextLevel, challenges, onBack, hasStartedChallenges, onStartChallenges }: ChallengePageProps) => {
  const { profile, onUpdateProfile, showGreeting } = useOutletContext<OutletContextType>();
  const progressPercentage = xpToNextLevel > 0 ? Math.round((userXp / xpToNextLevel) * 100) : 0;
  const rank = getRankForLevel(userLevel);
  const [showRewardDialog, setShowRewardDialog] = useState(false);
  const [rewardedThemes, setRewardedThemes] = useState<string[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallengeDialog, setShowChallengeDialog] = useState(false);

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
    // Give user first 2 colors when starting
    const firstTwoThemes = themes.slice(0, 2);
    setRewardedThemes(firstTwoThemes.map(t => t.name));
    setShowRewardDialog(true);
    onStartChallenges();
  };

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowChallengeDialog(true);
  };

  const getUnlockedThemesByLevel = (level: number) => {
    if (level >= 100) return themes.length; // All themes for Avi rank
    return Math.min(2 + (level - 1) * 2, 8); // 2 colors to start, then 2 per level, max 8
  };

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

  // Level configurations with semantic colors
  const levelConfigs = {
    1: { 
      name: 'Explorer', 
      color: 'bg-card/60 border-primary/20', 
      icon: Award,
      theme: 'Beginner challenges to get you started'
    },
    2: { 
      name: 'Warrior', 
      color: 'bg-card/60 border-primary/20', 
      icon: Shield,
      theme: 'Build strength and consistency'
    },
    3: { 
      name: 'Master', 
      color: 'bg-card/60 border-primary/20', 
      icon: Trophy,
      theme: 'Advanced challenges for experts'
    },
    4: { 
      name: 'Legend', 
      color: 'bg-card/60 border-primary/20', 
      icon: Crown,
      theme: 'Ultimate challenges for legends'
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <PageHeader title="Challenges" onBack={onBack} />

        {!hasStartedChallenges && (
          <Card className="bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 shadow-lg">
            <CardContent className="p-6 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-primary" />
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
            {/* Hero Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <rank.Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Current Rank</p>
                  <p className="font-bold text-lg text-primary">{hasStartedChallenges ? rank.name : 'Locked'}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {hasStartedChallenges ? `Level ${userLevel}` : 'Start to unlock'}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-bold text-lg text-primary">{completedChallenges}</p>
                  <p className="text-xs text-muted-foreground">out of {totalChallenges}</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                  <p className="font-bold text-lg text-primary">{userXp}</p>
                  <p className="text-xs text-muted-foreground">experience</p>
                </CardContent>
              </Card>

              <Card className="bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/20 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Next Level</p>
                  <p className="font-bold text-lg text-primary">
                    {nextRank ? `${xpToNextLevel - userXp}` : 'MAX'}
                  </p>
                  <p className="text-xs text-muted-foreground">XP needed</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {hasStartedChallenges && (
          <Card className="bg-card/80 border-primary/20 shadow-lg backdrop-blur-sm">
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
                       const isUnlocked = hasStartedChallenges && userLevel >= r.level;
                       return (
                         <div 
                           key={r.level} 
                           className={`flex items-center gap-3 p-4 rounded-lg transition-all border-2 ${
                             isUnlocked ? config.color : 'bg-muted/50 border-muted'
                           }`}
                         >
                           <r.Icon className={`w-8 h-8 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
                           <div className="flex-1">
                             <p className={`font-bold text-lg ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                               {r.name}
                             </p>
                             <p className="text-sm text-muted-foreground">{config.theme}</p>
                           </div>
                           {isUnlocked ? (
                             <Badge className="bg-primary text-primary-foreground">Unlocked!</Badge>
                           ) : (
                             <Badge variant="outline" className="text-muted-foreground">
                               {hasStartedChallenges ? 'Locked' : 'Start to unlock'}
                             </Badge>
                           )}
                         </div>
                       );
                     })}
                    
                    {/* Special Avi Rank */}
                     <div className="border-t pt-3 mt-4">
                       <div 
                         className={`flex items-center gap-3 p-4 rounded-lg transition-all border-2 ${
                           userLevel >= 100 
                             ? 'bg-card/60 border-primary/40' 
                             : 'bg-muted/30 border-dashed border-muted-foreground/30'
                         }`}
                       >
                         <Ghost className={`w-8 h-8 ${userLevel >= 100 ? 'text-primary' : 'text-muted-foreground'}`} />
                         <div className="flex-1">
                           <p className={`font-bold text-lg ${userLevel >= 100 ? 'text-primary' : 'text-muted-foreground'}`}>
                             Avi
                           </p>
                           <p className="text-sm text-muted-foreground">
                             {userLevel >= 100 ? 'Transcendent being with unlimited access' : 'Unlock with cheat code'}
                           </p>
                         </div>
                         {userLevel >= 100 ? (
                           <Badge className="bg-primary text-primary-foreground">Transcendent!</Badge>
                         ) : (
                           <Badge variant="outline" className="text-muted-foreground">Level ∞</Badge>
                         )}
                       </div>
                     </div>
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
        )}

        {hasStartedChallenges && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(challengesByLevel)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([level, levelChallenges]) => {
                const levelNum = Number(level);
                const config = levelConfigs[levelNum as keyof typeof levelConfigs];
                const completedInLevel = levelChallenges.filter(c => c.completed).length;
                const totalInLevel = levelChallenges.length;
                const isUnlocked = hasStartedChallenges && userLevel >= levelNum;
                const progressInLevel = totalInLevel > 0 ? (completedInLevel / totalInLevel) * 100 : 0;
                
                return (
                  <Card 
                    key={level} 
                    className={`shadow-xl transition-all hover:shadow-2xl border-2 ${config.color} ${!isUnlocked ? 'opacity-75' : ''}`}
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
                      
                      {/* Scrollable challenges list */}
                      <ScrollArea className="h-64 w-full rounded-md border p-2">
                        <div className="space-y-2">
                          {levelChallenges.map(challenge => {
                            const challengeLevel = getChallengeLevel(challenge.id);
                            const isChallengeUnlocked = hasStartedChallenges && userLevel >= challengeLevel;

                            return (
                              <button
                                key={challenge.id}
                                onClick={() => handleChallengeClick(challenge)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm hover:scale-[1.02] ${
                                  challenge.completed 
                                    ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15' 
                                    : !isChallengeUnlocked 
                                    ? 'bg-muted/30 hover:bg-muted/40' 
                                    : 'bg-card/60 border border-border hover:bg-muted/20'
                                }`}
                              >
                                {challenge.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                ) : !isChallengeUnlocked ? (
                                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                                <div className="flex-1 min-w-0 text-left">
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
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge variant="outline" className="text-xs">
                                    {challenge.xp} XP
                                  </Badge>
                                  <Info className="w-3 h-3 text-muted-foreground" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Challenge Details Dialog */}
        <Dialog open={showChallengeDialog} onOpenChange={setShowChallengeDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedChallenge?.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : (
                  <Target className="w-5 h-5 text-primary" />
                )}
                Challenge Details
              </DialogTitle>
            </DialogHeader>
            {selectedChallenge && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/20 border">
                  <h3 className="font-semibold text-lg mb-2">{selectedChallenge.text}</h3>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={selectedChallenge.completed ? "default" : "outline"}
                      className={selectedChallenge.completed ? "bg-primary/20 text-primary" : ""}
                    >
                      {selectedChallenge.xp} XP Reward
                    </Badge>
                    <Badge 
                      variant={selectedChallenge.completed ? "default" : "secondary"}
                      className={selectedChallenge.completed ? "bg-green-500/20 text-green-600" : ""}
                    >
                      {selectedChallenge.completed ? "Completed ✓" : "In Progress"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Challenge Requirements:</h4>
                  <div className="text-sm text-muted-foreground bg-muted/10 p-3 rounded-lg">
                    <p>This challenge will be automatically completed when you meet the required conditions through your task management activities.</p>
                    {selectedChallenge.completed && (
                      <p className="mt-2 text-green-600 font-medium">
                        🎉 Congratulations! You've already completed this challenge and earned {selectedChallenge.xp} XP!
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setShowChallengeDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reward Dialog */}
        <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-primary" />
                Congratulations!
              </DialogTitle>
              <DialogDescription>
                You have been rewarded with new themes for {rank.name} rank!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-center">Unlocked themes:</p>
              <div className="grid grid-cols-2 gap-2">
                {rewardedThemes.map((themeName, index) => (
                  <div key={index} className="p-3 border rounded-lg text-center">
                    <p className="font-medium text-primary">{themeName}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Visit Settings to change your theme!
              </p>
            </div>
            <Button onClick={() => setShowRewardDialog(false)} className="w-full">
              Awesome!
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
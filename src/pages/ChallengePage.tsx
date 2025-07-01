import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Lock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  return (
    <div>
      <PageHeader
        title="Challenges"
        onBack={onBack}
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        showAvatar={!showGreeting}
      />

      <Card className="mb-6 bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardDescription>Rank: Level {userLevel}</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <rank.Icon className="w-7 h-7 text-primary" />
                {rank.name}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-2">
            <Progress value={progressPercentage} className="h-3" />
            <span className="text-sm font-bold text-primary">{userXp} / {xpToNextLevel} XP</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {xpToNextLevel > userXp ? `${xpToNextLevel - userXp} XP to level up` : 'Max level reached for now!'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Challenge Log</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">View Ranks</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ranks</DialogTitle>
                  <DialogDescription>
                    Level up to achieve new ranks and unlock rewards.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-[60vh] overflow-y-auto p-1 -mr-2 pr-2">
                  {ALL_RANKS.map((r) => (
                    <div key={r.level} className="flex items-center gap-4 p-2 rounded-lg">
                      <r.Icon className="w-8 h-8 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-bold text-md">{r.name}</p>
                        <p className="text-sm text-muted-foreground">Unlocks at Level {r.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Complete challenges to earn XP and level up!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(challengesByLevel)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([level, levelChallenges]) => {
                const levelRank = getRankForLevel(Number(level));
                return (
                <Collapsible key={level} defaultOpen={userLevel >= Number(level) || userLevel + 1 === Number(level)} className="space-y-2">
                  <CollapsibleTrigger className="flex justify-between items-center w-full p-3 rounded-lg bg-secondary/80 hover:bg-secondary transition-colors font-bold text-left group">
                    <div className="flex items-center gap-3">
                      <levelRank.Icon className="w-5 h-5 text-primary" />
                      <span>Level {level} Challenges</span>
                    </div>
                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="space-y-2 pl-4 border-l-2 border-primary/20 ml-1">
                      {levelChallenges.map(challenge => {
                        const challengeLevel = getChallengeLevel(challenge.id);
                        const isLocked = userLevel < challengeLevel;

                        return (
                        <div key={challenge.id} className={`flex items-center justify-between p-3 rounded-lg transition-all ${challenge.completed ? 'bg-primary/10' : isLocked ? 'bg-muted/50' : 'bg-secondary'}`}>
                          <div className="flex items-center">
                            {challenge.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                            ) : isLocked ? (
                              <Lock className="w-6 h-6 text-muted-foreground mr-4 flex-shrink-0" />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground mr-4 flex-shrink-0" />
                            )}
                            <div>
                              <p className={`font-medium ${challenge.completed ? 'text-primary' : isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{challenge.text}</p>
                              <p className="text-sm text-muted-foreground">
                                {challenge.xp} XP
                                {isLocked && ` | Unlocks at Level ${challengeLevel}`}
                              </p>
                            </div>
                          </div>
                          {challenge.completed && (
                            <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full">DONE</span>
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

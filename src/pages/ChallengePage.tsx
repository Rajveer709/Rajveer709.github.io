
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Challenge as ChallengeType } from '../config/challenges';

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

export const ChallengePage = ({ userLevel, userXp, xpToNextLevel, challenges, onBack }: ChallengePageProps) => {
  const progressPercentage = xpToNextLevel > 0 ? Math.round((userXp / xpToNextLevel) * 100) : 0;

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
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Challenges</h1>
      </div>

      <Card className="mb-6 bg-card/80 dark:bg-card/30 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Level {userLevel}</CardTitle>
          <CardDescription>Your Progress to Next Level</CardDescription>
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
          <CardTitle>Challenges</CardTitle>
          <CardDescription>Complete challenges to earn XP and level up!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {challenges.map(challenge => {
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
        </CardContent>
      </Card>
    </div>
  );
};

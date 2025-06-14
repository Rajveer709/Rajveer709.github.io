
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Challenge {
  id: number;
  text: string;
  xp: number;
  completed: boolean;
}

interface FunctionalChallengePageProps {
  userLevel: number;
  userXp: number;
  xpToNextLevel: number;
  challenges: Challenge[];
  onBack: () => void;
}

export const FunctionalChallengePage = ({ userLevel, userXp, xpToNextLevel, challenges, onBack }: FunctionalChallengePageProps) => {
  const progressPercentage = xpToNextLevel > 0 ? Math.round((userXp / xpToNextLevel) * 100) : 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2 md:hidden">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-primary">Functional Challenges</h1>
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
            {challenges.map(challenge => (
              <div key={challenge.id} className={`flex items-center justify-between p-3 rounded-lg transition-colors ${challenge.completed ? 'bg-primary/10' : 'bg-secondary'}`}>
                <div className="flex items-center">
                  {challenge.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary mr-4 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground mr-4 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${challenge.completed ? 'text-primary' : 'text-foreground'}`}>{challenge.text}</p>
                    <p className="text-sm text-muted-foreground">{challenge.xp} XP</p>
                  </div>
                </div>
                {challenge.completed && (
                  <span className="text-xs font-bold text-primary bg-primary/20 px-2 py-1 rounded-full">DONE</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

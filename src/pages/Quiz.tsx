import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuizQuestions, useModules } from "@/hooks/useModules";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Quiz() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: questions, isLoading } = useQuizQuestions(moduleId);
  const { data: modules } = useModules();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [finished, setFinished] = useState(false);

  const module = modules?.find((m) => m.id === moduleId);
  const question = questions?.[currentQ];
  const total = questions?.length || 0;
  const progressPct = total > 0 ? ((currentQ + (showResult ? 1 : 0)) / total) * 100 : 0;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
  };

  const handleConfirm = () => {
    if (selected === null || !question) return;
    setShowResult(true);
    if (selected === question.correct_answer) {
      setScore((s) => s + 1);
      setPointsEarned((p) => p + question.points);
    }
  };

  const handleNext = async () => {
    if (currentQ < total - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!user || !moduleId || !profile) return;
    setFinished(true);
    const finalScore = score;
    const finalPoints = pointsEarned;
    const scorePct = total > 0 ? Math.round((finalScore / total) * 100) : 0;
    const isPerfect = finalScore === total;

    try {
      // Insert attempt
      await supabase.from("quiz_attempts").insert({
        user_id: user.id,
        module_id: moduleId,
        score: finalScore,
        total_questions: total,
        points_earned: finalPoints,
      });

      // Upsert progress
      const { data: existing } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("module_id", moduleId)
        .maybeSingle();

      // AI recommendation: adjust difficulty based on score
      let recommendedDifficulty: "beginner" | "intermediate" | "advanced" = "beginner";
      if (scorePct >= 80) recommendedDifficulty = "advanced";
      else if (scorePct >= 50) recommendedDifficulty = "intermediate";

      if (existing) {
        await supabase
          .from("user_progress")
          .update({
            completed: scorePct >= 60 || existing.completed,
            best_score: Math.max(scorePct, existing.best_score),
            attempts: existing.attempts + 1,
            recommended_difficulty: recommendedDifficulty,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_progress").insert({
          user_id: user.id,
          module_id: moduleId,
          completed: scorePct >= 60,
          best_score: scorePct,
          attempts: 1,
          recommended_difficulty: recommendedDifficulty,
        });
      }

      // Update profile - streak logic
      const today = new Date().toISOString().split("T")[0];
      const lastDate = profile.last_activity_date;
      let newStreak = profile.current_streak;
      if (lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        newStreak = lastDate === yesterday ? profile.current_streak + 1 : 1;
      }

      await updateProfile.mutateAsync({
        total_points: (profile.total_points || 0) + finalPoints,
        quizzes_completed: (profile.quizzes_completed || 0) + 1,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, profile.longest_streak || 0),
        last_activity_date: today,
      });

      // Check and award badges
      const newPoints = (profile.total_points || 0) + finalPoints;
      const newQuizzes = (profile.quizzes_completed || 0) + 1;
      const { data: allBadges } = await supabase.from("badges").select("*");
      const { data: earnedBadges } = await supabase
        .from("user_badges")
        .select("badge_id")
        .eq("user_id", user.id);
      const earnedIds = new Set(earnedBadges?.map((b) => b.badge_id));

      const newBadges: string[] = [];
      for (const badge of allBadges || []) {
        if (earnedIds.has(badge.id)) continue;
        let earned = false;
        if (badge.requirement_type === "total_points" && newPoints >= badge.requirement_value) earned = true;
        if (badge.requirement_type === "quizzes_completed" && newQuizzes >= badge.requirement_value) earned = true;
        if (badge.requirement_type === "current_streak" && newStreak >= badge.requirement_value) earned = true;
        if (badge.requirement_type === "perfect_score" && isPerfect) earned = true;
        if (earned) {
          await supabase.from("user_badges").insert({ user_id: user.id, badge_id: badge.id });
          newBadges.push(`${badge.icon} ${badge.name}`);
        }
      }

      if (newBadges.length > 0) {
        toast({
          title: "🎉 Badges Earned!",
          description: newBadges.join(", "),
        });
      }

      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["quiz-attempts"] });
      qc.invalidateQueries({ queryKey: ["user-progress"] });
      qc.invalidateQueries({ queryKey: ["user-badges"] });
    } catch (err) {
      console.error(err);
      toast({ title: "Error saving results", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No questions available for this module.</p>
        <Button onClick={() => navigate("/modules")} className="mt-4">Back to Modules</Button>
      </div>
    );
  }

  if (finished) {
    const scorePct = Math.round((score / total) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-12"
      >
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
          scorePct >= 80 ? "gradient-primary glow-primary" : scorePct >= 50 ? "gradient-secondary glow-secondary" : "gradient-accent glow-accent"
        )}>
          <Trophy className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold font-display mb-2">Quiz Complete!</h1>
        <p className="text-lg text-muted-foreground mb-1">{module?.title}</p>
        <div className="my-8 space-y-4">
          <div className="text-5xl font-bold font-display">{scorePct}%</div>
          <p className="text-muted-foreground">{score}/{total} correct answers</p>
          <div className="inline-block rounded-full gradient-accent px-6 py-2 text-accent-foreground font-bold">
            +{pointsEarned} points
          </div>
        </div>
        {scorePct < 50 && (
          <p className="text-sm text-muted-foreground mb-4">
            💡 AI Tip: We recommend trying beginner-level content to build your foundation.
          </p>
        )}
        {scorePct >= 80 && (
          <p className="text-sm text-muted-foreground mb-4">
            🚀 AI Tip: You're ready for advanced challenges! Check out harder modules.
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={() => { setCurrentQ(0); setScore(0); setPointsEarned(0); setSelected(null); setShowResult(false); setFinished(false); }} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" /> Retry
          </Button>
          <Button onClick={() => navigate("/modules")} className="gradient-primary text-primary-foreground">
            More Modules
          </Button>
        </div>
      </motion.div>
    );
  }

  const options = (question?.options as string[]) || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold font-display mb-1">{module?.title}</h1>
        <div className="flex items-center gap-3">
          <Progress value={progressPct} className="flex-1 h-2" />
          <span className="text-sm text-muted-foreground font-medium">{currentQ + 1}/{total}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-2xl bg-card shadow-card p-8"
        >
          <p className="text-lg font-semibold mb-6">{question?.question}</p>
          <div className="space-y-3">
            {options.map((opt, i) => {
              const isCorrect = i === question?.correct_answer;
              const isSelected = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm",
                    showResult
                      ? isCorrect
                        ? "border-primary bg-primary/10"
                        : isSelected
                        ? "border-destructive bg-destructive/10"
                        : "border-border opacity-50"
                      : isSelected
                      ? "border-primary bg-primary/5 shadow-card"
                      : "border-border hover:border-muted-foreground"
                  )}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showResult && question?.explanation && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-xl bg-muted text-sm text-muted-foreground"
            >
              💡 {question.explanation}
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        {!showResult ? (
          <Button onClick={handleConfirm} disabled={selected === null} className="gradient-primary text-primary-foreground px-8">
            Confirm Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="gradient-primary text-primary-foreground px-8">
            {currentQ < total - 1 ? (
              <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

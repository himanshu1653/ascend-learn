import { useProfile } from "@/hooks/useProfile";
import { useModules, useQuizAttempts, useUserProgress } from "@/hooks/useModules";
import { useUserBadges } from "@/hooks/useBadges";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, BookOpen, TrendingUp, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: profile } = useProfile();
  const { data: modules } = useModules();
  const { data: attempts } = useQuizAttempts();
  const { data: progress } = useUserProgress();
  const { data: userBadges } = useUserBadges();

  const totalModules = modules?.length || 0;
  const completedModules = progress?.filter((p) => p.completed).length || 0;
  const progressPct = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  const stats = [
    { icon: Trophy, label: "Total Points", value: profile?.total_points || 0, color: "gradient-accent", glow: "glow-accent" },
    { icon: Flame, label: "Day Streak", value: profile?.current_streak || 0, color: "gradient-primary", glow: "glow-primary" },
    { icon: Target, label: "Quizzes Done", value: profile?.quizzes_completed || 0, color: "gradient-secondary", glow: "glow-secondary" },
    { icon: Award, label: "Badges Earned", value: userBadges?.length || 0, color: "gradient-accent", glow: "glow-accent" },
  ];

  const recentAttempts = (attempts || []).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">
          Welcome back, {profile?.display_name || "Learner"}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">Keep up the great work on your learning journey</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-card shadow-card p-5 hover:shadow-card-hover transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-2xl font-bold font-display">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-card shadow-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Overall Progress
          </h2>
          <span className="text-sm font-semibold text-primary">
            {completedModules}/{totalModules} modules
          </span>
        </div>
        <Progress value={progressPct} className="h-3 mb-2" />
        <p className="text-sm text-muted-foreground">{Math.round(progressPct)}% complete</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent quizzes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-card shadow-card p-6"
        >
          <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" />
            Recent Activity
          </h2>
          {recentAttempts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No quizzes completed yet. <Link to="/modules" className="text-primary font-semibold hover:underline">Start learning!</Link></p>
          ) : (
            <div className="space-y-3">
              {recentAttempts.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{(a as any).learning_modules?.title || "Quiz"}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.score}/{a.total_questions} correct
                    </p>
                  </div>
                  <span className="text-sm font-bold text-primary">+{a.points_earned} pts</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-card shadow-card p-6"
        >
          <h2 className="text-lg font-bold font-display mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/modules"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:shadow-card transition-all"
            >
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Continue Learning</p>
                <p className="text-xs text-muted-foreground">Pick up where you left off</p>
              </div>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-accent hover:shadow-card transition-all"
            >
              <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">View Leaderboard</p>
                <p className="text-xs text-muted-foreground">See how you rank globally</p>
              </div>
            </Link>
            <Link
              to="/badges"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-secondary hover:shadow-card transition-all"
            >
              <div className="w-10 h-10 rounded-lg gradient-secondary flex items-center justify-center">
                <Award className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">My Badges</p>
                <p className="text-xs text-muted-foreground">View your achievements</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

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
    { icon: Trophy, label: "Total Points", value: profile?.total_points || 0, color: "gradient-accent", glow: "glow-accent", text: "text-amber-500" },
    { icon: Flame, label: "Day Streak", value: profile?.current_streak || 0, color: "gradient-primary", glow: "glow-primary", text: "text-emerald-500" },
    { icon: Target, label: "Quizzes", value: profile?.quizzes_completed || 0, color: "gradient-secondary", glow: "glow-secondary", text: "text-indigo-500" },
    { icon: Award, label: "Badges", value: userBadges?.length || 0, color: "gradient-accent", glow: "glow-accent", text: "text-orange-500" },
  ];

  const recentAttempts = (attempts || []).slice(0, 5);

  return (
    <div className="space-y-10 pb-10">
      {/* Immersive Welcome Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2.5rem] mesh-gradient p-8 md:p-12 text-white shadow-2xl border border-white/5"
      >
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-wider border border-white/10 mb-6 inline-block">
              Learning Dashboard
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-tight mb-4">
              Welcome back,<br />
              <span className="text-primary italic">{profile?.display_name || "Scholar"}</span>! 👋
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              You've mastered <span className="text-white font-bold">{completedModules} modules</span> so far. 
              Ready to climb the leaderboard today?
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/modules" className="px-8 py-3.5 rounded-2xl gradient-primary text-white font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                Explore Courses
              </Link>
              <div className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                <span className="font-bold">{profile?.current_streak || 0} Day Streak</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />
        
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <div className="w-48 h-48 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center p-8 rotate-12">
            <Trophy className="w-full h-full text-primary" strokeWidth={1} />
          </div>
        </motion.div>
      </motion.div>

      {/* Stats grid with glassmorphism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative overflow-hidden rounded-[2rem] glass-card p-6 shadow-xl"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform ${stat.glow}`}>
              <stat.icon className="w-7 h-7 text-white" />
            </div>
            <div className="relative z-10">
              <p className="text-4xl font-black font-display tracking-tight leading-none mb-1">{stat.value}</p>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</p>
            </div>
            {/* Background sparkle */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 rounded-[2.5rem] glass-card p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black font-display flex items-center gap-3 italic">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Your Journey
                </h2>
                <p className="text-muted-foreground font-medium">Platform Completion Status</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black font-display text-primary">
                  {Math.round(progressPct)}%
                </span>
              </div>
            </div>
            
            <div className="relative h-6 w-full bg-muted rounded-full overflow-hidden mb-6 p-1 border border-border">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full gradient-primary rounded-full progress-glow flex items-center justify-end px-2"
              >
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
              </motion.div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Modules</p>
                <p className="text-xl font-black font-display">{totalModules}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Mastered</p>
                <p className="text-xl font-black font-display text-primary">{completedModules}</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Avg Score</p>
                <p className="text-xl font-black font-display text-secondary">88%</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">XP Level</p>
                <p className="text-xl font-black font-display text-accent">GOLD</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-[2.5rem] glass-card p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-black font-display mb-6 italic flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-secondary" />
            Active Feed
          </h2>
          {recentAttempts.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">No activity yet.</p>
              <Link to="/modules" className="text-primary font-bold hover:underline mt-2 inline-block">Start Learning</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAttempts.map((a, i) => (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-white hover:shadow-xl dark:hover:bg-white/5 transition-all border border-transparent hover:border-primary/10"
                >
                  <div className={`w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center text-white shrink-0 shadow-lg shadow-secondary/20`}>
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{(a as any).learning_modules?.title || "Quiz Attempt"}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {a.score}/{a.total_questions} Correct
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">+{a.points_earned}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none">XP</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { to: "/modules", icon: BookOpen, label: "Explore Modules", desc: "Browse a world of knowledge", color: "primary" },
          { to: "/leaderboard", icon: Trophy, label: "Leaderboard", desc: "See where you rank", color: "accent" },
          { to: "/badges", icon: Award, label: "Achievements", desc: "Your digital trophy room", color: "secondary" },
        ].map((item, i) => (
          <Link
            key={item.label}
            to={item.to}
            className={`group p-6 rounded-[2rem] glass-card border-l-4 border-l-${item.color} hover:bg-white dark:hover:bg-white/5 transition-all shadow-xl hover:-translate-y-2`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white gradient-${item.color} shadow-lg`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black font-display italic group-hover:text-primary transition-colors">{item.label}</p>
                <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useLeaderboard } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const { data: leaders, isLoading } = useLeaderboard();
  const { user } = useAuth();

  const rankIcons = [
    <Crown className="w-6 h-6 text-accent" />,
    <Medal className="w-5 h-5 text-muted-foreground" />,
    <Medal className="w-5 h-5 text-accent" />,
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Trophy className="w-8 h-8 text-accent" />
          Leaderboard
        </h1>
        <p className="text-muted-foreground mt-1">Top learners ranked by total points</p>
      </motion.div>

      {/* Top 3 podium */}
      {leaders && leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[1, 0, 2].map((rank) => {
            const leader = leaders[rank];
            const isFirst = rank === 0;
            return (
              <motion.div
                key={rank}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rank * 0.15 }}
                className={cn(
                  "text-center rounded-2xl bg-card shadow-card p-5 border border-border",
                  isFirst && "transform -translate-y-4 border-accent glow-accent",
                  leader.user_id === user?.id && "ring-2 ring-primary"
                )}
              >
                <div className="mb-2">{rankIcons[rank]}</div>
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold",
                  isFirst ? "gradient-accent text-accent-foreground" : "gradient-secondary text-secondary-foreground"
                )}>
                  {leader.display_name?.[0]?.toUpperCase() || "?"}
                </div>
                <p className="font-bold font-display text-sm truncate">{leader.display_name || "Anonymous"}</p>
                <p className="text-lg font-bold text-primary">{leader.total_points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full ranking */}
      <div className="rounded-2xl bg-card shadow-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="divide-y divide-border">
            {leaders?.map((leader, i) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "flex items-center gap-4 px-6 py-4",
                  leader.user_id === user?.id && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  i < 3 ? "gradient-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {i + 1}
                </span>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                  "gradient-secondary text-secondary-foreground"
                )}>
                  {leader.display_name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {leader.display_name || "Anonymous"}
                    {leader.user_id === user?.id && " (You)"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {leader.current_streak} day streak
                    </span>
                    <span>{leader.quizzes_completed} quizzes</span>
                  </div>
                </div>
                <span className="font-bold text-primary">{leader.total_points} pts</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

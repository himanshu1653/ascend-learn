import { useBadges, useUserBadges } from "@/hooks/useBadges";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Badges() {
  const { data: allBadges } = useBadges();
  const { data: userBadges } = useUserBadges();

  const earnedIds = new Set(userBadges?.map((ub) => ub.badge_id));

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <Award className="w-8 h-8 text-secondary" />
          Badges & Rewards
        </h1>
        <p className="text-muted-foreground mt-1">
          Earn badges by completing quizzes, building streaks, and reaching milestones
        </p>
      </motion.div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-card shadow-card">
        <div className="w-14 h-14 rounded-xl gradient-secondary flex items-center justify-center">
          <span className="text-2xl">{userBadges?.length || 0}</span>
        </div>
        <div>
          <p className="font-bold font-display">Badges Earned</p>
          <p className="text-sm text-muted-foreground">
            {userBadges?.length || 0} of {allBadges?.length || 0} badges unlocked
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges?.map((badge, i) => {
          const earned = earnedIds.has(badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-2xl p-6 border-2 transition-all",
                earned
                  ? "bg-card shadow-card border-primary glow-primary"
                  : "bg-muted/50 border-border opacity-60"
              )}
            >
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className="font-bold font-display">{badge.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
              {earned ? (
                <span className="inline-block mt-3 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  ✅ Earned
                </span>
              ) : (
                <span className="inline-block mt-3 text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  🔒 Locked
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

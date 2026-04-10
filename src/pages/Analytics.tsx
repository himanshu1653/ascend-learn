import { useProfile } from "@/hooks/useProfile";
import { useQuizAttempts, useUserProgress, useModules } from "@/hooks/useModules";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Analytics() {
  const { data: profile } = useProfile();
  const { data: attempts } = useQuizAttempts();
  const { data: progress } = useUserProgress();
  const { data: modules } = useModules();

  // Build chart data from attempts
  const chartData = (attempts || [])
    .slice(0, 10)
    .reverse()
    .map((a, i) => ({
      name: `Quiz ${i + 1}`,
      score: a.total_questions > 0 ? Math.round((a.score / a.total_questions) * 100) : 0,
      points: a.points_earned,
    }));

  // Module performance
  const moduleData = modules?.map((m) => {
    const prog = progress?.find((p) => p.module_id === m.id);
    return {
      name: m.title.split(" ")[0],
      bestScore: prog?.best_score || 0,
      attempts: prog?.attempts || 0,
    };
  }) || [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary" />
          Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Track your learning progress over time</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Points", value: profile?.total_points || 0 },
          { label: "Quizzes Done", value: profile?.quizzes_completed || 0 },
          { label: "Best Streak", value: profile?.longest_streak || 0 },
          { label: "Avg Score", value: chartData.length > 0 ? `${Math.round(chartData.reduce((a, b) => a + b.score, 0) / chartData.length)}%` : "N/A" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-card shadow-card p-5"
          >
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold font-display mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Score trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-card shadow-card p-6"
      >
        <h2 className="text-lg font-bold font-display flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          Quiz Score Trend
        </h2>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">Complete some quizzes to see your progress graph</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
              <XAxis dataKey="name" stroke="hsl(220 10% 45%)" fontSize={12} />
              <YAxis stroke="hsl(220 10% 45%)" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="hsl(160 84% 39%)" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Module performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl bg-card shadow-card p-6"
      >
        <h2 className="text-lg font-bold font-display flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-secondary" />
          Module Performance
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={moduleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 88%)" />
            <XAxis dataKey="name" stroke="hsl(220 10% 45%)" fontSize={11} />
            <YAxis stroke="hsl(220 10% 45%)" fontSize={12} />
            <Tooltip />
            <Bar dataKey="bestScore" fill="hsl(250 70% 55%)" radius={[6, 6, 0, 0]} name="Best Score %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

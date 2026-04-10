import { useModules, useUserProgress } from "@/hooks/useModules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Code, Palette, Braces, Layers, Terminal, Network, Cpu, Database, BookOpen
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Palette, Braces, Layers, Terminal, Network, Cpu, Database, BookOpen,
};

const difficultyColors: Record<string, string> = {
  beginner: "gradient-primary",
  intermediate: "gradient-secondary",
  advanced: "gradient-accent",
};

export default function Modules() {
  const { data: modules, isLoading } = useModules();
  const { data: progress } = useUserProgress();

  const getModuleProgress = (moduleId: string) =>
    progress?.find((p) => p.module_id === moduleId);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">Learning Modules</h1>
        <p className="text-muted-foreground mt-1">Choose a topic and start your quiz</p>
      </motion.div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules?.map((mod, i) => {
            const Icon = iconMap[mod.icon || "BookOpen"] || BookOpen;
            const prog = getModuleProgress(mod.id);
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/quiz/${mod.id}`}
                  className="block rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all p-6 h-full border border-border hover:border-primary group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${difficultyColors[mod.difficulty]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <Badge variant={prog?.completed ? "default" : "secondary"} className="text-xs">
                      {prog?.completed ? "✅ Completed" : mod.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-bold font-display text-lg mb-1">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{mod.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{mod.category}</span>
                    <span className="font-semibold text-primary">+{mod.points_reward} pts</span>
                  </div>
                  {prog && prog.attempts > 0 && (
                    <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                      Best: {prog.best_score}% · {prog.attempts} attempt{prog.attempts !== 1 ? "s" : ""}
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

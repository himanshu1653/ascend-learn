import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { LEARNING_MODULES, QUIZ_QUESTIONS } from "@/data/mockData";

export function useModules() {
  return useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      return LEARNING_MODULES;
    },
  });
}

export function useQuizQuestions(moduleId: string | undefined) {
  return useQuery({
    queryKey: ["quiz-questions", moduleId],
    queryFn: async () => {
      if (!moduleId) return [];
      return QUIZ_QUESTIONS.filter(q => q.module_id === moduleId);
    },
    enabled: !!moduleId,
  });
}

export function useUserProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useQuizAttempts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["quiz-attempts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*, learning_modules(title)")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

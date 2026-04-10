import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket, BookOpen, Trophy, Zap, Award, ArrowRight, Flame } from "lucide-react";

export default function Index() {
  const { user } = useAuth();

  const features = [
    { icon: BookOpen, title: "8+ Modules", desc: "HTML, CSS, JS, React, Python, Data Structures & more", color: "gradient-primary" },
    { icon: Zap, title: "AI-Powered", desc: "Smart recommendations adapt to your skill level", color: "gradient-secondary" },
    { icon: Trophy, title: "Leaderboard", desc: "Compete globally and climb the rankings", color: "gradient-accent" },
    { icon: Award, title: "Badges & Certs", desc: "Earn rewards and download certificates", color: "gradient-primary" },
    { icon: Flame, title: "Daily Streaks", desc: "Stay consistent and build learning habits", color: "gradient-accent" },
    { icon: Rocket, title: "Track Progress", desc: "Analytics dashboard to monitor your growth", color: "gradient-secondary" },
  ];

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border/50 bg-background/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Rocket className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold font-display">Code Rocks</span>
          </div>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button className="gradient-primary text-primary-foreground">
              {user ? "Dashboard" : "Get Started"}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary font-medium mb-6">
              <Zap className="w-4 h-4" /> AI-Powered Personalized Learning
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
              Level Up Your
              <span className="block bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
                Coding Skills
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Gamified learning with quizzes, badges, streaks, and AI-driven recommendations.
              Compete on the leaderboard and earn certificates.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to={user ? "/dashboard" : "/auth"}>
                <Button size="lg" className="gradient-primary text-primary-foreground h-14 px-8 text-base font-semibold">
                  Start Learning <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold font-display text-center mb-12">Why Code Rocks?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card shadow-card p-6 hover:shadow-card-hover transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold font-display text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-display mb-4">Ready to start?</h2>
          <p className="text-muted-foreground mb-8">Join thousands of learners leveling up their coding skills every day.</p>
          <Link to="/auth">
            <Button size="lg" className="gradient-primary text-primary-foreground h-14 px-10 text-base font-semibold">
              Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Code Rocks. Built with ❤️ for learners everywhere.</p>
      </footer>
    </div>
  );
}

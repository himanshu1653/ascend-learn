import { useState } from "react";
import { useModules, useUserProgress } from "@/hooks/useModules";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Code, Palette, Braces, Layers, Terminal, Network, Cpu, Database, BookOpen,
  ArrowLeft, GraduationCap, Microscope, Calculator, Beaker, Landmark, BookCheck, ClipboardList,
  Settings, Zap, Scale, Hammer
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Palette, Braces, Layers, Terminal, Network, Cpu, Database, BookOpen,
  Settings, Zap, Scale,
  Physics: Microscope,
  Chemistry: Beaker,
  Maths: Calculator,
  Biology: Microscope,
  Accounts: Landmark,
  Economics: Database,
  OCM: BookCheck,
  SP: ClipboardList,
  "Data Structures": Code,
  Networks: Network,
  OS: Terminal,
  DBMS: Database,
  Computation: Braces,
  Kinematics: Settings,
  "Control Systems": Zap,
  Sensors: Cpu,
  AI: Braces,
  "Robot Programming": Code,
  Thermodynamics: Zap,
  SOM: Layers,
  TOM: Settings,
  Manufacturing: Hammer,
  Structures: Layers,
  Surveying: Landmark,
  Geotech: Database,
  Concrete: Layers,
  Environmental: Beaker,
  "Digital Logic": Braces,
  Microprocessors: Cpu,
  Analog: Zap,
  Signals: Network,
  Communication: Network,
  Constitutional: Scale,
  Criminal: Scale,
  Contract: BookCheck,
  Torts: Scale,
  "Legal Reasoning": Braces
};

const difficultyColors: Record<string, string> = {
  beginner: "gradient-primary",
  intermediate: "gradient-secondary",
  advanced: "gradient-accent",
};

type Stream = {
  id: string;
  title: string;
  description: string;
  icon: typeof GraduationCap;
  subjects: string[];
};

const STREAMS: Stream[] = [
  {
    id: "science-pcm",
    title: "Science (PCM)",
    description: "Physics, Chemistry, and Mathematics focus for engineering aspirants.",
    icon: Beaker,
    subjects: ["Physics", "Chemistry", "Maths"]
  },
  {
    id: "science-pcb",
    title: "Science (PCB)",
    description: "Physics, Chemistry, and Biology focus for medical aspirants.",
    icon: Microscope,
    subjects: ["Physics", "Chemistry", "Biology"]
  },
  {
    id: "commerce",
    title: "Commerce",
    description: "Focus on Business, Finance, and Management.",
    icon: Landmark,
    subjects: ["Accounts", "Economics", "OCM", "SP"]
  },
  {
    id: "computer-engineering",
    title: "Computer Engineering",
    description: "Software, hardware, and networking fundamentals.",
    icon: Code,
    subjects: ["Data Structures", "Networks", "OS", "DBMS", "Computation"]
  },
  {
    id: "robotics",
    title: "Robotics",
    description: "Design, construction, and operation of robots.",
    icon: Cpu,
    subjects: ["Kinematics", "Control Systems", "Sensors", "AI", "Robot Programming"]
  },
  {
    id: "mechanical-engineering",
    title: "Mechanical Engineering",
    description: "Design and manufacturing of mechanical systems.",
    icon: Settings,
    subjects: ["Thermodynamics", "Fluids", "SOM", "TOM", "Manufacturing"]
  },
  {
    id: "civil-engineering",
    title: "Civil Engineering",
    description: "Design and construction of infrastructure.",
    icon: Layers,
    subjects: ["Structures", "Surveying", "Geotech", "Concrete", "Environmental"]
  },
  {
    id: "electronics-engineering",
    title: "Electronics Engineering",
    description: "Circuits, systems, and communication electronics.",
    icon: Zap,
    subjects: ["Digital Logic", "Microprocessors", "Analog", "Signals", "Communication"]
  },
  {
    id: "law",
    title: "Law",
    description: "Legal principles, ethics, and judicial systems.",
    icon: Scale,
    subjects: ["Constitutional", "Criminal", "Contract", "Torts", "Legal Reasoning"]
  }
];

export default function Modules() {
  const { data: modules, isLoading } = useModules();
  const { data: progress } = useUserProgress();
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [hideCompleted, setHideCompleted] = useState(false);

  const getModuleProgress = (moduleId: string) =>
    progress?.find((p) => p.module_id === moduleId);

  const filteredModules = modules?.filter(mod => {
    if (!selectedSubject) return false;
    const prog = getModuleProgress(mod.id);
    if (hideCompleted && prog?.completed) return false;
    
    // Check if module title or category matches the subject
    return mod.category?.toLowerCase().includes(selectedSubject.toLowerCase()) || 
           mod.title.toLowerCase().includes(selectedSubject.toLowerCase());
  });

  const resetSelection = () => {
    setSelectedStream(null);
    setSelectedSubject(null);
  };

  const backToStream = () => {
    setSelectedSubject(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display">
          {!selectedStream ? "Choose Your Stream" : !selectedSubject ? `Select a Subject (${selectedStream.title})` : `${selectedSubject} Quizzes`}
        </h1>
        <p className="text-muted-foreground mt-1">
          {!selectedStream ? "Select your educational path to see relevant subjects" : !selectedSubject ? "Pick a subject to start practicing" : "Choose a module and start your quiz"}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Step 1: Stream Selection */}
        {!selectedStream && (
          <motion.div
            key="streams"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {STREAMS.map((stream, i) => (
              <motion.button
                key={stream.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedStream(stream)}
                className="block text-left rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all p-6 border border-border hover:border-primary group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <stream.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold font-display text-xl mb-2">{stream.title}</h3>
                <p className="text-sm text-muted-foreground">{stream.description}</p>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Subject Selection */}
        {selectedStream && !selectedSubject && (
          <motion.div
            key="subjects"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Button variant="ghost" onClick={resetSelection} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Streams
            </Button>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedStream.subjects.map((subject) => {
                const Icon = iconMap[subject] || BookOpen;
                return (
                  <motion.button
                    key={subject}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSubject(subject)}
                    className="p-8 rounded-2xl bg-card border border-border hover:border-primary text-center group transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-lg">{subject}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 3: Modules List */}
        {selectedStream && selectedSubject && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={backToStream}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Subjects
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">Hide Completed</span>
                <button
                  onClick={() => setHideCompleted(!hideCompleted)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${hideCompleted ? 'bg-primary' : 'bg-muted'}`}
                >
                  <motion.div
                    animate={{ x: hideCompleted ? 26 : 2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredModules && filteredModules.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map((mod, i) => {
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
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-xl font-bold mb-2">No Quizzes Found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  We are currently adding more quizzes for {selectedSubject}. Check back soon!
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


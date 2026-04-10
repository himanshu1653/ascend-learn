import { useProfile } from "@/hooks/useProfile";
import { useModules, useUserProgress } from "@/hooks/useModules";
import { motion } from "framer-motion";
import { ScrollText, Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Certificates() {
  const { data: profile } = useProfile();
  const { data: modules } = useModules();
  const { data: progress } = useUserProgress();
  const { user } = useAuth();

  const completedModules = modules?.filter((m) =>
    progress?.some((p) => p.module_id === m.id && p.completed)
  ) || [];

  const generateCertificate = (moduleTitle: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext("2d")!;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, "#1a1f36");
    grad.addColorStop(1, "#2d1b69");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.strokeStyle = "#10b98144";
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 720);

    // Title
    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CODE ROCKS", 600, 120);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px serif";
    ctx.fillText("Certificate of Completion", 600, 200);

    // Divider
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 230);
    ctx.lineTo(850, 230);
    ctx.stroke();

    // Body
    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px sans-serif";
    ctx.fillText("This certifies that", 600, 310);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px sans-serif";
    ctx.fillText(profile?.display_name || "Learner", 600, 370);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "18px sans-serif";
    ctx.fillText("has successfully completed the module", 600, 430);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(moduleTitle, 600, 485);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 600, 560);
    ctx.fillText(`Email: ${user?.email}`, 600, 590);

    // Trophy emoji as text
    ctx.font = "60px sans-serif";
    ctx.fillText("🏆", 600, 690);

    // Download
    const link = document.createElement("a");
    link.download = `CodeRocks-${moduleTitle.replace(/\s+/g, "_")}-Certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display flex items-center gap-3">
          <ScrollText className="w-8 h-8 text-primary" />
          Certificates
        </h1>
        <p className="text-muted-foreground mt-1">Download certificates for completed modules</p>
      </motion.div>

      {completedModules.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-card shadow-card">
          <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold font-display mb-2">No certificates yet</h2>
          <p className="text-muted-foreground">Complete a module with 60%+ score to earn a certificate</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {completedModules.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card shadow-card p-6 border border-border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold font-display text-lg">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground">{mod.category}</p>
                </div>
                <span className="text-3xl">📜</span>
              </div>
              <Button
                onClick={() => generateCertificate(mod.title)}
                className="mt-4 w-full gradient-primary text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

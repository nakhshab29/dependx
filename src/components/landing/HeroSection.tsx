import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Eye, Zap } from "lucide-react";
import { HeroGraph } from "./HeroGraph";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background grid effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-critical/10 rounded-full blur-[96px]" />

      <div className="container relative z-10 px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Shield className="w-4 h-4" />
                Bus-Factor Protection
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              If one person leaves tomorrow —{" "}
              <span className="text-gradient-primary">do you know what will break?</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg md:text-xl text-muted-foreground max-w-xl"
            >
              DependX reveals hidden human dependencies in your organization. 
              Visualize risk, protect continuity, and build resilient teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="xl" onClick={onGetStarted}>
                Scan My Team Risk
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                See How It Works
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center gap-8 pt-4"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="w-4 h-4 text-primary" />
                <span>No productivity scoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>Passive learning</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right content - Animated Graph */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <HeroGraph />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

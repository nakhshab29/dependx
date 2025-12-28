import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px]" />

      <div className="container px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Risk lives in <span className="text-critical">silence</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Every day without visibility is a day closer to discovering your most critical 
            dependency — the hard way. Start protecting your organization today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={onGetStarted}>
              Start Free Risk Assessment
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="xl">
              Schedule Demo
            </Button>
          </div>

          <p className="text-muted-foreground text-sm mt-6">
            Free for teams up to 10 people. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

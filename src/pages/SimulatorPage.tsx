import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  FlaskConical, 
  AlertTriangle, 
  Clock,
  ArrowRight,
  RefreshCw,
  Users,
  Box,
  TrendingDown,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { mockPeople, mockModules } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface SimulationResult {
  affectedModules: {
    id: string;
    name: string;
    currentBusFactor: number;
    newBusFactor: number;
    impact: 'critical' | 'high' | 'medium' | 'low';
  }[];
  estimatedRecoveryWeeks: number;
  overallImpact: 'critical' | 'high' | 'medium' | 'low';
  mitigations: string[];
}

const SimulatorPage = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = (personId: string) => {
    setIsSimulating(true);
    setSelectedPerson(personId);

    // Simulate API call delay
    setTimeout(() => {
      const person = mockPeople.find(p => p.id === personId);
      if (!person) return;

      const affectedModules = person.knowledgeAreas.map(area => {
        const module = mockModules.find(m => m.name === area.module);
        if (!module) return null;

        const isOnlyOwner = area.isOnlyOwner;
        const newBusFactor = isOnlyOwner ? 0 : Math.max(1, module.busFactor - 1);
        
        let impact: 'critical' | 'high' | 'medium' | 'low';
        if (isOnlyOwner) impact = 'critical';
        else if (newBusFactor === 1) impact = 'high';
        else if (newBusFactor === 2) impact = 'medium';
        else impact = 'low';

        return {
          id: module.id,
          name: module.name,
          currentBusFactor: module.busFactor,
          newBusFactor,
          impact,
        };
      }).filter(Boolean) as SimulationResult['affectedModules'];

      const criticalCount = affectedModules.filter(m => m.impact === 'critical').length;
      const highCount = affectedModules.filter(m => m.impact === 'high').length;

      let overallImpact: 'critical' | 'high' | 'medium' | 'low';
      if (criticalCount > 0) overallImpact = 'critical';
      else if (highCount > 0) overallImpact = 'high';
      else if (affectedModules.some(m => m.impact === 'medium')) overallImpact = 'medium';
      else overallImpact = 'low';

      const estimatedRecoveryWeeks = criticalCount * 8 + highCount * 4 + 2;

      const mitigations = [];
      if (criticalCount > 0) {
        mitigations.push(`Immediately assign backup owners to ${criticalCount} critical module(s)`);
        mitigations.push('Create comprehensive documentation for sole-owned modules');
      }
      if (highCount > 0) {
        mitigations.push(`Schedule knowledge transfer sessions for ${highCount} high-impact area(s)`);
      }
      mitigations.push('Consider pair programming to distribute knowledge');
      mitigations.push('Update succession planning documentation');

      setSimulationResult({
        affectedModules,
        estimatedRecoveryWeeks,
        overallImpact,
        mitigations,
      });
      setIsSimulating(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setSelectedPerson(null);
    setSimulationResult(null);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-critical';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-healthy';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'critical': return <Badge variant="critical">Critical Impact</Badge>;
      case 'high': return <Badge variant="warning">High Impact</Badge>;
      case 'medium': return <Badge variant="muted">Medium Impact</Badge>;
      default: return <Badge variant="healthy">Low Impact</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="What-If Simulator"
      description="Simulate the impact of team member departures"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Intro Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg">Scenario Planning Tool</h3>
                <p className="text-muted-foreground mt-1">
                  Select a team member below to simulate what would happen if they left the organization. 
                  See which modules would be affected, estimated recovery time, and recommended mitigations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Person Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading flex items-center justify-between">
                <span>Select Team Member</span>
                {selectedPerson && (
                  <Button variant="ghost" size="sm" onClick={resetSimulation}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPeople.map((person) => (
                <motion.div
                  key={person.id}
                  whileHover={{ scale: 1.01 }}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedPerson === person.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => runSimulation(person.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className={cn(
                      "border-2",
                      person.riskScore >= 4 ? "border-critical" :
                      person.riskScore >= 3 ? "border-warning" : "border-healthy"
                    )}>
                      <AvatarFallback className="bg-card text-foreground font-semibold">
                        {person.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{person.name}</h4>
                        <Badge variant={
                          person.riskScore >= 4 ? "critical" :
                          person.riskScore >= 3 ? "warning" : "muted"
                        }>
                          Impact: {person.riskScore}/5
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{person.role}</p>
                    </div>
                    <ArrowRight className={cn(
                      "w-5 h-5 transition-all",
                      selectedPerson === person.id ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Simulation Results */}
          <AnimatePresence mode="wait">
            {isSimulating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <FlaskConical className="w-12 h-12 text-primary" />
                    </motion.div>
                    <p className="mt-4 text-muted-foreground">Running simulation...</p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : simulationResult ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Impact Overview */}
                <Card className={cn(
                  "border-2",
                  simulationResult.overallImpact === 'critical' && "border-critical bg-critical/5",
                  simulationResult.overallImpact === 'high' && "border-warning bg-warning/5"
                )}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold">Simulation Result</h3>
                      {getImpactBadge(simulationResult.overallImpact)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Affected Modules</p>
                        <p className="text-2xl font-heading font-bold">
                          {simulationResult.affectedModules.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Recovery Time</p>
                        <p className="text-2xl font-heading font-bold flex items-center gap-2">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          {simulationResult.estimatedRecoveryWeeks} weeks
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Affected Modules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-heading flex items-center gap-2">
                      <Box className="w-4 h-4" />
                      Affected Modules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {simulationResult.affectedModules.map((module, index) => (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          {module.impact === 'critical' ? (
                            <XCircle className="w-5 h-5 text-critical" />
                          ) : module.impact === 'high' ? (
                            <AlertTriangle className="w-5 h-5 text-warning" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{module.name}</p>
                            <p className={cn("text-sm", getImpactColor(module.impact))}>
                              {module.impact === 'critical' 
                                ? 'No remaining owners!' 
                                : `Bus factor: ${module.currentBusFactor} → ${module.newBusFactor}`
                              }
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          module.impact === 'critical' ? "critical" :
                          module.impact === 'high' ? "warning" : "muted"
                        }>
                          {module.impact}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Mitigations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-heading flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-healthy" />
                      Recommended Mitigations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {simulationResult.mitigations.map((mitigation, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start gap-2 text-sm"
                        >
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{mitigation}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="font-heading font-semibold mb-2">Select a Team Member</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      Choose someone from the list to simulate the impact of their departure on your organization.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default SimulatorPage;

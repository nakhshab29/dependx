import { motion } from "framer-motion";
import { X, Box, AlertTriangle, Users, Clock, FileText, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockModules, mockPeople } from "@/data/mockData";

interface ModuleDetailProps {
  moduleId: string;
  onClose: () => void;
}

export function ModuleDetail({ moduleId, onClose }: ModuleDetailProps) {
  const module = mockModules.find(m => m.id === moduleId);
  
  if (!module) return null;

  const owners = mockPeople.filter(p => module.owners.includes(p.id));

  const getRiskBadge = (level: string) => {
    if (level === 'critical') return <Badge variant="critical">Critical</Badge>;
    if (level === 'warning') return <Badge variant="warning">Warning</Badge>;
    return <Badge variant="healthy">Healthy</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                module.riskLevel === 'critical' ? 'bg-critical/20' :
                module.riskLevel === 'warning' ? 'bg-warning/20' : 'bg-healthy/20'
              }`}>
                <Box className={`w-7 h-7 ${
                  module.riskLevel === 'critical' ? 'text-critical' :
                  module.riskLevel === 'warning' ? 'text-warning' : 'text-healthy'
                }`} />
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold">{module.name}</h2>
                <p className="text-muted-foreground text-sm">{module.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Risk Overview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className={module.riskLevel === 'critical' ? 'border-critical/30' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    module.riskLevel === 'critical' ? 'text-critical' : 'text-warning'
                  }`} />
                  <span className="text-sm text-muted-foreground">Bus Factor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-heading font-bold">{module.busFactor}</span>
                  {getRiskBadge(module.riskLevel)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Concentration</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-heading font-bold">{module.concentration}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Explanation */}
          {module.riskLevel !== 'healthy' && (
            <Card variant={module.riskLevel === 'critical' ? 'critical' : 'default'}>
              <CardContent className="pt-6">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-critical" />
                  Risk Analysis
                </h4>
                <p className="text-sm text-muted-foreground">
                  {module.concentration}% of recent activity on this module was performed by a single person. 
                  This creates significant risk if that person becomes unavailable.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Current Owners */}
          <div>
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Knowledge Owners
            </h3>
            <div className="space-y-2">
              {owners.map((owner) => (
                <div
                  key={owner.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {owner.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{owner.name}</p>
                      <p className="text-xs text-muted-foreground">{owner.role}</p>
                    </div>
                  </div>
                  <Badge variant="muted">Primary</Badge>
                </div>
              ))}
              {owners.length === 1 && (
                <p className="text-sm text-critical flex items-center gap-2 mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  Single owner — backup needed
                </p>
              )}
            </div>
          </div>

          {/* Suggested Actions */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Suggested Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign shadow owner
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Start documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Create training task
              </Button>
            </div>
          </div>

          {/* Last Activity */}
          <div className="text-sm text-muted-foreground border-t border-border pt-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last activity: {module.lastActivity}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

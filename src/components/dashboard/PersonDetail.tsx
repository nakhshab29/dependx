import { motion } from "framer-motion";
import { X, User, AlertTriangle, BookOpen, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockPeople, mockModules } from "@/data/mockData";

interface PersonDetailProps {
  personId: string;
  onClose: () => void;
}

export function PersonDetail({ personId, onClose }: PersonDetailProps) {
  const person = mockPeople.find(p => p.id === personId);
  
  if (!person) return null;

  const getRiskBadge = (score: number) => {
    if (score >= 4) return <Badge variant="critical">High Impact</Badge>;
    if (score >= 3) return <Badge variant="warning">Medium Impact</Badge>;
    return <Badge variant="healthy">Low Impact</Badge>;
  };

  const affectedModules = mockModules.filter(m => 
    m.owners.includes(personId)
  );

  const criticalKnowledge = person.knowledgeAreas.filter(k => k.isOnlyOwner);

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
              <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
                {person.avatar}
              </div>
              <div>
                <h2 className="font-heading text-xl font-bold">{person.name}</h2>
                <p className="text-muted-foreground">{person.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Risk Overview */}
          <Card variant="critical" className={person.riskScore >= 4 ? '' : 'border-warning/30'}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-critical" />
                  <span className="font-medium">Risk Impact Score</span>
                </div>
                {getRiskBadge(person.riskScore)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-heading font-bold">{person.riskScore}</span>
                <span className="text-muted-foreground">/ 5</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This score indicates how much of the organization depends on this person's knowledge.
              </p>
            </CardContent>
          </Card>

          {/* Knowledge Areas */}
          <div>
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              Knowledge Areas
            </h3>
            <div className="space-y-2">
              {person.knowledgeAreas.map((area, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      area.isOnlyOwner ? 'bg-critical' : 
                      area.level === 'primary' ? 'bg-warning' : 'bg-healthy'
                    }`} />
                    <span className="font-medium">{area.module}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={area.isOnlyOwner ? 'critical' : 'muted'}>
                      {area.isOnlyOwner ? 'Only Owner' : area.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Breaks */}
          {criticalKnowledge.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-critical" />
                What Breaks If This Person Leaves
              </h3>
              <div className="space-y-3">
                {criticalKnowledge.map((area, i) => (
                  <Card key={i} variant="critical">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{area.module}</span>
                        <Badge variant="critical">Critical</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        No backup owner identified
                      </p>
                      <p className="text-xs text-critical mt-2">
                        Estimated recovery: 2-4 weeks
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Actions */}
          <div>
            <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Suggested Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Assign backup owner
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Start documentation sprint
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Schedule pair programming
              </Button>
            </div>
          </div>

          {/* Last Activity */}
          <div className="text-sm text-muted-foreground border-t border-border pt-4">
            Last active: {person.lastActive}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

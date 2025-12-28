import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  ArrowUpDown,
  AlertTriangle,
  Box,
  ChevronRight,
  Users
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ModuleDetail } from "@/components/dashboard/ModuleDetail";
import { mockModules, mockPeople } from "@/data/mockData";
import { cn } from "@/lib/utils";

const ModulesPage = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'busFactor' | 'concentration'>('busFactor');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'healthy'>('all');

  const filteredModules = mockModules
    .filter(m => {
      if (filter !== 'all' && m.riskLevel !== filter) return false;
      if (searchQuery) {
        return m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               m.description.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * modifier;
      if (sortBy === 'busFactor') return (a.busFactor - b.busFactor) * modifier;
      return (a.concentration - b.concentration) * modifier;
    });

  const criticalCount = mockModules.filter(m => m.riskLevel === 'critical').length;
  const warningCount = mockModules.filter(m => m.riskLevel === 'warning').length;
  const healthyCount = mockModules.filter(m => m.riskLevel === 'healthy').length;

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <Badge variant="critical">Critical</Badge>;
      case 'warning': return <Badge variant="warning">Warning</Badge>;
      default: return <Badge variant="healthy">Healthy</Badge>;
    }
  };

  const getOwnerNames = (ownerIds: string[]) => {
    return ownerIds.map(id => mockPeople.find(p => p.id === id)?.name || id);
  };

  const toggleSort = (field: 'name' | 'busFactor' | 'concentration') => {
    if (sortBy === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(field === 'name' ? 'asc' : 'asc');
    }
  };

  return (
    <DashboardLayout
      title="Modules"
      description="Track knowledge concentration across system modules"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Modules</p>
                  <p className="text-2xl font-heading font-bold">{mockModules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card variant="critical">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-critical/20">
                  <AlertTriangle className="w-5 h-5 text-critical" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Critical</p>
                  <p className="text-2xl font-heading font-bold">{criticalCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/20">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warning</p>
                  <p className="text-2xl font-heading font-bold">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-healthy/20">
                  <Box className="w-5 h-5 text-healthy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Healthy</p>
                  <p className="text-2xl font-heading font-bold">{healthyCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search modules..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter:</span>
                {(['all', 'critical', 'warning', 'healthy'] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className={cn(
                      filter === f && f === 'critical' && "bg-critical hover:bg-critical/90",
                      filter === f && f === 'warning' && "bg-warning hover:bg-warning/90 text-warning-foreground",
                      filter === f && f === 'healthy' && "bg-healthy hover:bg-healthy/90"
                    )}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2 border-l border-border pl-4">
                <span className="text-sm text-muted-foreground">Sort:</span>
                <Button
                  variant={sortBy === 'busFactor' ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSort('busFactor')}
                >
                  Bus Factor
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  variant={sortBy === 'concentration' ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSort('concentration')}
                >
                  Concentration
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredModules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  module.riskLevel === 'critical' && "border-critical/30",
                  module.riskLevel === 'warning' && "border-warning/30"
                )}
                onClick={() => setSelectedModule(module.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{module.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                    </div>
                    {getRiskBadge(module.riskLevel)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bus Factor</p>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-2xl font-heading font-bold",
                          module.busFactor === 1 ? "text-critical" :
                          module.busFactor === 2 ? "text-warning" : "text-healthy"
                        )}>
                          {module.busFactor}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {module.busFactor === 1 ? "(Single Owner)" : 
                           module.busFactor === 2 ? "(At Risk)" : "(Healthy)"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Knowledge Concentration</p>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={module.concentration} 
                          className={cn(
                            "h-2",
                            module.concentration >= 80 && "[&>div]:bg-critical",
                            module.concentration >= 60 && module.concentration < 80 && "[&>div]:bg-warning"
                          )}
                        />
                        <span className="text-sm font-medium">{module.concentration}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {getOwnerNames(module.owners).map((name, i) => (
                        <Badge key={i} variant="muted" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Last activity: {module.lastActivity}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedModule && (
        <ModuleDetail 
          moduleId={selectedModule} 
          onClose={() => setSelectedModule(null)} 
        />
      )}
    </DashboardLayout>
  );
};

export default ModulesPage;

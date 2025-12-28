import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Box, 
  ChevronRight,
  Shield,
  Menu
} from "lucide-react";
import { mockStats, mockModules, mockPeople } from "@/data/mockData";
import { DependencyGraph } from "@/components/dashboard/DependencyGraph";
import { RiskList } from "@/components/dashboard/RiskList";
import { PersonDetail } from "@/components/dashboard/PersonDetail";
import { ModuleDetail } from "@/components/dashboard/ModuleDetail";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

const Dashboard = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const criticalModules = mockModules.filter(m => m.riskLevel === 'critical');
  const warningModules = mockModules.filter(m => m.riskLevel === 'warning');
  const criticalPeople = mockPeople.filter(p => p.riskScore >= 4);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-heading text-2xl font-bold">Risk Overview</h1>
                <p className="text-sm text-muted-foreground">Monitor your organization's knowledge dependencies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="muted">Last scan: 2 hours ago</Badge>
              <Button variant="default" size="sm">
                <Shield className="w-4 h-4 mr-2" />
                Run Scan
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bus Factor Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="gradient">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overall Bus Factor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-heading font-bold text-warning">
                        {mockStats.overallBusFactor.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-sm">/ 5</span>
                    </div>
                    <div className="flex items-center gap-1 text-critical text-sm">
                      <TrendingDown className="w-4 h-4" />
                      <span>Declining</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Critical Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="critical">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-critical" />
                    Critical Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-heading font-bold">{mockStats.criticalAreas}</span>
                    <span className="text-muted-foreground text-sm">of {mockStats.totalModules} modules</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Size */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-heading font-bold">{mockStats.totalPeople}</span>
                    <span className="text-muted-foreground text-sm">{criticalPeople.length} high impact</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Modules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Box className="w-4 h-4 text-primary" />
                    Modules Tracked
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-4xl font-heading font-bold">{mockStats.totalModules}</span>
                    <span className="text-muted-foreground text-sm">{mockStats.healthyAreas} healthy</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Dependency Graph */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <Card className="h-[500px]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-heading">Dependency Map</CardTitle>
                  <Button variant="ghost" size="sm">
                    Expand <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <DependencyGraph 
                    onSelectPerson={setSelectedPerson}
                    onSelectModule={setSelectedModule}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Risk Lists */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <RiskList 
                title="Critical Modules"
                items={criticalModules}
                type="module"
                onSelect={setSelectedModule}
              />
              <RiskList
                title="High-Impact People"
                items={criticalPeople}
                type="person"
                onSelect={setSelectedPerson}
              />
            </motion.div>
          </div>
        </main>
      </div>

      {/* Detail Panels */}
      {selectedPerson && (
        <PersonDetail 
          personId={selectedPerson} 
          onClose={() => setSelectedPerson(null)} 
        />
      )}
      {selectedModule && (
        <ModuleDetail 
          moduleId={selectedModule} 
          onClose={() => setSelectedModule(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;

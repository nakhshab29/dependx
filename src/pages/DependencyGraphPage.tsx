import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Search,
  Filter,
  Download
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PersonDetail } from "@/components/dashboard/PersonDetail";
import { ModuleDetail } from "@/components/dashboard/ModuleDetail";
import { mockPeople, mockModules, mockLinks } from "@/data/mockData";
import { cn } from "@/lib/utils";

const DependencyGraphPage = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'healthy'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);

  const filteredModules = mockModules.filter(m => {
    if (filter !== 'all' && m.riskLevel !== filter) return false;
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredPeople = mockPeople.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const visibleLinks = mockLinks.filter(link => {
    const moduleVisible = filteredModules.some(m => m.id === link.target);
    const personVisible = filteredPeople.some(p => p.id === link.source);
    return moduleVisible && personVisible;
  });

  const getModuleColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'hsl(var(--critical))';
      case 'warning': return 'hsl(var(--warning))';
      default: return 'hsl(var(--healthy))';
    }
  };

  const getLinkColor = (strength: number) => {
    if (strength >= 80) return 'hsl(var(--critical))';
    if (strength >= 50) return 'hsl(var(--warning))';
    return 'hsl(var(--muted-foreground))';
  };

  // Calculate positions
  const centerX = 400;
  const centerY = 300;
  const personRadius = 180;
  const moduleRadius = 100;

  const getPersonPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + personRadius * Math.cos(angle),
      y: centerY + personRadius * Math.sin(angle)
    };
  };

  const getModulePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + moduleRadius * Math.cos(angle),
      y: centerY + moduleRadius * Math.sin(angle)
    };
  };

  return (
    <DashboardLayout
      title="Dependency Graph"
      description="Visualize knowledge dependencies across your organization"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Controls */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search people or modules..." 
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
                <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-center">{Math.round(zoom * 100)}%</span>
                <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoom(1)}>
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Graph */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading">Interactive Dependency Map</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">People</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-critical" />
                  <span className="text-muted-foreground">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-warning" />
                  <span className="text-muted-foreground">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-healthy" />
                  <span className="text-muted-foreground">Healthy</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[600px] relative">
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              className="w-full h-full"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Links */}
              {visibleLinks.map((link, i) => {
                const personIndex = filteredPeople.findIndex(p => p.id === link.source);
                const moduleIndex = filteredModules.findIndex(m => m.id === link.target);
                if (personIndex === -1 || moduleIndex === -1) return null;
                
                const personPos = getPersonPosition(personIndex, filteredPeople.length);
                const modulePos = getModulePosition(moduleIndex, filteredModules.length);
                
                return (
                  <motion.line
                    key={i}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: link.strength / 100 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    x1={personPos.x}
                    y1={personPos.y}
                    x2={modulePos.x}
                    y2={modulePos.y}
                    stroke={getLinkColor(link.strength)}
                    strokeWidth={Math.max(1, link.strength / 30)}
                    className="cursor-pointer hover:opacity-100"
                  />
                );
              })}

              {/* Modules */}
              {filteredModules.map((module, i) => {
                const pos = getModulePosition(i, filteredModules.length);
                return (
                  <motion.g
                    key={module.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedModule(module.id)}
                  >
                    <rect
                      x={pos.x - 45}
                      y={pos.y - 25}
                      width={90}
                      height={50}
                      rx={8}
                      fill={getModuleColor(module.riskLevel)}
                      className="transition-all hover:filter hover:brightness-110"
                      filter="url(#glow)"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 5}
                      textAnchor="middle"
                      className="text-[10px] font-medium fill-white"
                    >
                      {module.name.length > 12 ? module.name.slice(0, 12) + '...' : module.name}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 10}
                      textAnchor="middle"
                      className="text-[9px] fill-white/80"
                    >
                      BF: {module.busFactor}
                    </text>
                  </motion.g>
                );
              })}

              {/* People */}
              {filteredPeople.map((person, i) => {
                const pos = getPersonPosition(i, filteredPeople.length);
                const riskColor = person.riskScore >= 4 ? 'hsl(var(--critical))' : 
                                  person.riskScore >= 3 ? 'hsl(var(--warning))' : 'hsl(var(--primary))';
                return (
                  <motion.g
                    key={person.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedPerson(person.id)}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={30}
                      fill="hsl(var(--card))"
                      stroke={riskColor}
                      strokeWidth={3}
                      className="transition-all hover:filter hover:brightness-110"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      className="text-xs font-bold fill-foreground"
                    >
                      {person.avatar}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 50}
                      textAnchor="middle"
                      className="text-[10px] fill-muted-foreground"
                    >
                      {person.name.split(' ')[0]}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Connections</p>
                  <p className="text-3xl font-heading font-bold">{visibleLinks.length}</p>
                </div>
                <Badge variant="muted">Active</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Strength Links</p>
                  <p className="text-3xl font-heading font-bold text-critical">
                    {visibleLinks.filter(l => l.strength >= 80).length}
                  </p>
                </div>
                <Badge variant="critical">Critical</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Dependency Strength</p>
                  <p className="text-3xl font-heading font-bold">
                    {Math.round(visibleLinks.reduce((a, l) => a + l.strength, 0) / visibleLinks.length || 0)}%
                  </p>
                </div>
                <Badge variant="muted">Metric</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

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
    </DashboardLayout>
  );
};

export default DependencyGraphPage;

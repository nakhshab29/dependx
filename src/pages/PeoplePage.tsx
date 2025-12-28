import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  AlertTriangle,
  Users,
  ChevronRight
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PersonDetail } from "@/components/dashboard/PersonDetail";
import { mockPeople } from "@/data/mockData";
import { cn } from "@/lib/utils";

const PeoplePage = () => {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'riskScore'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredPeople = mockPeople
    .filter(p => {
      if (searchQuery) {
        return p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               p.role.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * modifier;
      }
      return (a.riskScore - b.riskScore) * modifier;
    });

  const criticalCount = mockPeople.filter(p => p.riskScore >= 4).length;
  const warningCount = mockPeople.filter(p => p.riskScore === 3).length;
  const healthyCount = mockPeople.filter(p => p.riskScore < 3).length;

  const getRiskBadge = (score: number) => {
    if (score >= 4) return <Badge variant="critical">High Impact</Badge>;
    if (score >= 3) return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="healthy">Low Risk</Badge>;
  };

  const toggleSort = (field: 'name' | 'riskScore') => {
    if (sortBy === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <DashboardLayout
      title="People"
      description="View and manage team members' knowledge dependencies"
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
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Team</p>
                  <p className="text-2xl font-heading font-bold">{mockPeople.length}</p>
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
                  <p className="text-sm text-muted-foreground">High Impact</p>
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
                  <p className="text-sm text-muted-foreground">Medium Risk</p>
                  <p className="text-2xl font-heading font-bold">{warningCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-healthy/20">
                  <Users className="w-5 h-5 text-healthy" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Risk</p>
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
                  placeholder="Search by name or role..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button
                  variant={sortBy === 'riskScore' ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSort('riskScore')}
                >
                  Risk Score
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  variant={sortBy === 'name' ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleSort('name')}
                >
                  Name
                  <ArrowUpDown className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* People List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPeople.map((person, index) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  person.riskScore >= 4 && "border-critical/30"
                )}
                onClick={() => setSelectedPerson(person.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
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
                      <div>
                        <h3 className="font-semibold">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">{person.role}</p>
                      </div>
                    </div>
                    {getRiskBadge(person.riskScore)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Impact Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              person.riskScore >= 4 ? "bg-critical" :
                              person.riskScore >= 3 ? "bg-warning" : "bg-healthy"
                            )}
                            style={{ width: `${(person.riskScore / 5) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium">{person.riskScore}/5</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Knowledge Areas</span>
                      <span className="font-medium">{person.knowledgeAreas.length}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {person.knowledgeAreas.slice(0, 3).map((area, i) => (
                        <Badge key={i} variant={area.isOnlyOwner ? "critical" : "muted"} className="text-xs">
                          {area.module}
                          {area.isOnlyOwner && " (Only)"}
                        </Badge>
                      ))}
                      {person.knowledgeAreas.length > 3 && (
                        <Badge variant="muted" className="text-xs">
                          +{person.knowledgeAreas.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Last active: {person.lastActive}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {selectedPerson && (
        <PersonDetail 
          personId={selectedPerson} 
          onClose={() => setSelectedPerson(null)} 
        />
      )}
    </DashboardLayout>
  );
};

export default PeoplePage;

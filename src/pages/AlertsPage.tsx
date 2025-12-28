import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  AlertTriangle, 
  Clock,
  Check,
  X,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Users,
  Box
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  module?: string;
  person?: string;
  timestamp: string;
  isRead: boolean;
  actionable: boolean;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: 'trend' | 'users' | 'box';
}

const mockAlerts: Alert[] = [
  {
    id: 'a1',
    type: 'critical',
    title: 'Single owner for 120+ days',
    description: 'Payment Service has had only one contributor (Sarah Chen) for over 4 months.',
    module: 'Payment Service',
    person: 'Sarah Chen',
    timestamp: '2 hours ago',
    isRead: false,
    actionable: true,
  },
  {
    id: 'a2',
    type: 'critical',
    title: 'No backup trained',
    description: 'Deployment Pipeline lacks any secondary knowledge holder.',
    module: 'Deployment Pipeline',
    person: 'Marcus Johnson',
    timestamp: '1 day ago',
    isRead: false,
    actionable: true,
  },
  {
    id: 'a3',
    type: 'warning',
    title: 'Knowledge concentration increasing',
    description: 'Auth System ownership has become more concentrated over the last 30 days.',
    module: 'Auth System',
    timestamp: '2 days ago',
    isRead: true,
    actionable: true,
  },
  {
    id: 'a4',
    type: 'warning',
    title: 'Inactive reviewer detected',
    description: 'Anna Weber hasn\'t reviewed any changes to API Gateway in 45 days.',
    module: 'API Gateway',
    person: 'Anna Weber',
    timestamp: '3 days ago',
    isRead: true,
    actionable: false,
  },
  {
    id: 'a5',
    type: 'info',
    title: 'New contributor onboarded',
    description: 'David Kim has started contributing to Notifications module.',
    module: 'Notifications',
    person: 'David Kim',
    timestamp: '5 days ago',
    isRead: true,
    actionable: false,
  },
];

const mockInsights: Insight[] = [
  {
    id: 'i1',
    title: 'Your biggest risk is not people — it\'s deployment',
    description: 'The Deployment Pipeline has the highest single-point-of-failure risk in your organization. Consider cross-training at least one additional team member.',
    impact: 'high',
    icon: 'box',
  },
  {
    id: 'i2',
    title: '2 modules account for 70% of fragility',
    description: 'Payment Service and Deployment Pipeline together represent most of your organizational risk. Prioritizing backup training for these areas would significantly improve resilience.',
    impact: 'high',
    icon: 'trend',
  },
  {
    id: 'i3',
    title: 'Sarah Chen is critical to 3 modules',
    description: 'If Sarah were to leave, Payment Service would have zero coverage and Auth System would drop to a bus factor of 1.',
    impact: 'high',
    icon: 'users',
  },
  {
    id: 'i4',
    title: 'Frontend team has good coverage',
    description: 'Dashboard UI and Design System both have healthy bus factors of 3+. This team could be a model for other areas.',
    impact: 'low',
    icon: 'trend',
  },
];

const AlertsPage = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical' | 'warning'>('all');

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'unread') return !a.isRead;
    if (filter === 'critical') return a.type === 'critical';
    if (filter === 'warning') return a.type === 'warning';
    return true;
  });

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-critical" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-warning" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getInsightIcon = (icon: string) => {
    switch (icon) {
      case 'trend': return <TrendingUp className="w-5 h-5" />;
      case 'users': return <Users className="w-5 h-5" />;
      case 'box': return <Box className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout
      title="Alerts & Insights"
      description="Real-time notifications and actionable intelligence"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Alerts</p>
                  <p className="text-2xl font-heading font-bold">{alerts.length}</p>
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
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-heading font-bold">{unreadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Alerts Column */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading">Alerts</CardTitle>
                  <div className="flex items-center gap-2">
                    {(['all', 'unread', 'critical', 'warning'] as const).map((f) => (
                      <Button
                        key={f}
                        variant={filter === f ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setFilter(f)}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                        {f === 'unread' && unreadCount > 0 && (
                          <Badge variant="critical" className="ml-1 text-xs">{unreadCount}</Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No alerts match your filter</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 rounded-lg border transition-all",
                        !alert.isRead && "bg-card border-primary/30",
                        alert.isRead && "bg-muted/30 border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-medium">{alert.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {alert.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {!alert.isRead && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(alert.id)}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => dismissAlert(alert.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            {alert.module && (
                              <Badge variant="muted" className="text-xs">
                                <Box className="w-3 h-3 mr-1" />
                                {alert.module}
                              </Badge>
                            )}
                            {alert.person && (
                              <Badge variant="muted" className="text-xs">
                                <Users className="w-3 h-3 mr-1" />
                                {alert.person}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">
                              {alert.timestamp}
                            </span>
                          </div>
                          {alert.actionable && (
                            <Button variant="ghost" size="sm" className="mt-3 -ml-2">
                              Take Action <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Insights Column */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border",
                      insight.impact === 'high' && "border-critical/30 bg-critical/5",
                      insight.impact === 'medium' && "border-warning/30 bg-warning/5",
                      insight.impact === 'low' && "border-healthy/30 bg-healthy/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        insight.impact === 'high' && "bg-critical/20 text-critical",
                        insight.impact === 'medium' && "bg-warning/20 text-warning",
                        insight.impact === 'low' && "bg-healthy/20 text-healthy"
                      )}>
                        {getInsightIcon(insight.icon)}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AlertsPage;

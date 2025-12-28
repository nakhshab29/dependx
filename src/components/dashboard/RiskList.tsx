import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Module, Person } from "@/data/mockData";

interface RiskListProps {
  title: string;
  items: (Module | Person)[];
  type: 'module' | 'person';
  onSelect: (id: string) => void;
}

function isModule(item: Module | Person): item is Module {
  return 'busFactor' in item;
}

export function RiskList({ title, items, type, onSelect }: RiskListProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-base flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-critical" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No critical items
          </p>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3">
                {type === 'person' && !isModule(item) && (
                  <div className="w-8 h-8 rounded-full bg-critical/20 flex items-center justify-center text-critical text-xs font-medium">
                    {item.avatar}
                  </div>
                )}
                {type === 'module' && isModule(item) && (
                  <div className="w-8 h-8 rounded-lg bg-critical/20 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-critical" />
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {isModule(item) ? item.name : item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isModule(item) 
                      ? `Bus Factor: ${item.busFactor}`
                      : `Risk Score: ${item.riskScore}/5`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="critical" className="text-xs">
                  {isModule(item) ? 'Critical' : 'High Impact'}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
}

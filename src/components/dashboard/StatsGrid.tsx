import { DashboardStats } from "@/types/sensor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Thermometer, 
  Activity, 
  Wifi, 
  WifiOff, 
  TrendingUp,
  TrendingDown 
} from "lucide-react";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      title: "Total de Sensores",
      value: stats.totalSensors,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Sensores Online",
      value: stats.onlineSensors,
      icon: Wifi,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Sensores Offline",
      value: stats.offlineSensors,
      icon: WifiOff,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Temperatura Média",
      value: `${stats.avgTemperature}°C`,
      icon: Thermometer,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Menor Temperatura",
      value: `${stats.minTemperature}°C`,
      icon: TrendingDown,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Maior Temperatura",
      value: `${stats.maxTemperature}°C`,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="glow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
import { Sensor } from "@/types/sensor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Droplets, MapPin, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface SensorCardProps {
  sensor: Sensor;
}

export function SensorCard({ sensor }: SensorCardProps) {
  const navigate = useNavigate();
  const getStatusColor = (status: Sensor["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "offline":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusText = (status: Sensor["status"]) => {
    switch (status) {
      case "online":
        return "Online";
      case "warning":
        return "Atenção";
      case "offline":
        return "Offline";
      default:
        return "Desconhecido";
    }
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 30) return { color: "text-red-400", icon: TrendingUp };
    if (temp < 0) return { color: "text-blue-400", icon: TrendingDown };
    return { color: "text-green-400", icon: Thermometer };
  };

  const tempStatus = getTemperatureStatus(sensor.lastReading.temperature);
  const TempIcon = tempStatus.icon;

  return (
    <Card 
      className="glow-card cursor-pointer hover:scale-[1.02] transition-all duration-300"
      onClick={() => navigate(`/sensor/${sensor.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {sensor.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 mr-1" />
              {sensor.location}
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={getStatusColor(sensor.status)}
          >
            {getStatusText(sensor.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TempIcon className={`w-5 h-5 ${tempStatus.color}`} />
            <span className="text-sm text-muted-foreground">Temperatura</span>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${tempStatus.color}`}>
              {sensor.lastReading.temperature}°C
            </div>
          </div>
        </div>

        {/* Humidity (if available) */}
        {sensor.lastReading.humidity && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-muted-foreground">Umidade</span>
            </div>
            <div className="text-xl font-semibold text-blue-400">
              {sensor.lastReading.humidity}%
            </div>
          </div>
        )}

        {/* Temperature Range */}
        <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
          <div className="text-xs text-muted-foreground mb-2">Últimas 24h</div>
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-muted-foreground">Mín:</span>
              <span className="ml-1 text-blue-400 font-medium">{sensor.minTemp}°C</span>
            </div>
            <div>
              <span className="text-muted-foreground">Méd:</span>
              <span className="ml-1 text-foreground font-medium">{sensor.avgTemp}°C</span>
            </div>
            <div>
              <span className="text-muted-foreground">Máx:</span>
              <span className="ml-1 text-red-400 font-medium">{sensor.maxTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Última leitura</span>
          </div>
          <span>
            {formatDistanceToNow(sensor.lastReading.timestamp, { 
              addSuffix: true, 
              locale: ptBR 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
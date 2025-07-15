import { Sensor } from "@/types/sensor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Thermometer, 
  Droplets, 
  MapPin, 
  Clock, 
  Activity,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SensorDetailModalProps {
  sensor: Sensor | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SensorDetailModal({ sensor, isOpen, onClose }: SensorDetailModalProps) {
  if (!sensor) return null;

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

  const getTemperatureColor = (temp: number) => {
    if (temp > 30) return "text-red-400";
    if (temp < 0) return "text-blue-400";
    return "text-green-400";
  };

  // Get recent readings (last 12)
  const recentReadings = sensor.readings.slice(-12).reverse();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glow-card">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl font-bold">{sensor.name}</span>
            <Badge 
              variant="outline" 
              className={getStatusColor(sensor.status)}
            >
              {getStatusText(sensor.status)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            {sensor.location}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Reading */}
          <div className="glow-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-primary" />
              Leitura Atual
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Thermometer className={`w-5 h-5 ${getTemperatureColor(sensor.lastReading.temperature)}`} />
                  <span className="text-sm text-muted-foreground">Temperatura</span>
                </div>
                <div className={`text-xl font-bold ${getTemperatureColor(sensor.lastReading.temperature)}`}>
                  {sensor.lastReading.temperature}°C
                </div>
              </div>

              {sensor.lastReading.humidity && (
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-muted-foreground">Umidade</span>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {sensor.lastReading.humidity}%
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Última atualização: {formatDistanceToNow(sensor.lastReading.timestamp, { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </div>
          </div>

          {/* Statistics */}
          <div className="glow-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Estatísticas (24h)
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-blue-400 font-bold text-lg">{sensor.minTemp}°C</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Mínima
                </div>
              </div>
              
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-foreground font-bold text-lg">{sensor.avgTemp}°C</div>
                <div className="text-sm text-muted-foreground">Média</div>
              </div>
              
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-red-400 font-bold text-lg">{sensor.maxTemp}°C</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Máxima
                </div>
              </div>
            </div>
          </div>

          {/* Recent Readings */}
          <div className="glow-card p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Leituras Recentes
            </h3>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recentReadings.map((reading, index) => (
                <div key={reading.id} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                  <div className="text-sm text-muted-foreground">
                    {format(reading.timestamp, "dd/MM HH:mm", { locale: ptBR })}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`font-medium ${getTemperatureColor(reading.temperature)}`}>
                      {reading.temperature}°C
                    </div>
                    {reading.humidity && (
                      <div className="text-blue-400 font-medium">
                        {reading.humidity}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Thermometer, Droplets, MapPin, Clock, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { mockSensors } from "@/data/mockSensors";
import { Sensor } from "@/types/sensor";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: Date;
}

export default function SensorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const foundSensor = mockSensors.find(s => s.id === id);
    setSensor(foundSensor || null);

    // Mock alerts for the sensor
    if (foundSensor) {
      const mockAlerts: Alert[] = [
        {
          id: "1",
          type: foundSensor.status === "warning" ? "warning" : "info",
          message: foundSensor.status === "warning" 
            ? "Temperatura acima do limite recomendado" 
            : "Sensor funcionando normalmente",
          timestamp: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: "2",
          type: "info",
          message: "Última calibração realizada com sucesso",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        }
      ];
      setAlerts(mockAlerts);
    }
  }, [id]);

  if (!sensor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Sensor não encontrado</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

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

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  // Generate chart data from sensor readings
  const chartData = sensor.readings.slice(-24).map((reading, index) => ({
    time: `${23 - index}h`,
    temperature: reading.temperature,
    humidity: reading.humidity || 0
  })).reverse();

  const tempStatus = sensor.lastReading.temperature > 30 
    ? { color: "text-red-400", icon: TrendingUp }
    : sensor.lastReading.temperature < 0 
    ? { color: "text-blue-400", icon: TrendingDown }
    : { color: "text-green-400", icon: Thermometer };

  const TempIcon = tempStatus.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate("/")} 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{sensor.name}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {sensor.location}
                </div>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor(sensor.status)}>
              {sensor.status === "online" ? "Online" : 
               sensor.status === "warning" ? "Atenção" : "Offline"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground flex items-center">
                    <TempIcon className={`w-4 h-4 mr-2 ${tempStatus.color}`} />
                    Temperatura Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${tempStatus.color}`}>
                    {sensor.lastReading.temperature}°C
                  </div>
                </CardContent>
              </Card>

              {sensor.lastReading.humidity && (
                <Card className="glow-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-muted-foreground flex items-center">
                      <Droplets className="w-4 h-4 mr-2 text-blue-400" />
                      Umidade Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {sensor.lastReading.humidity}%
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="glow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Última Leitura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-foreground">
                    {formatDistanceToNow(sensor.lastReading.timestamp, { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Temperature Chart */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Histórico de Temperatura (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="time" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          color: "hsl(var(--popover-foreground))"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="temperature"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#temperatureGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Humidity Chart (if available) */}
            {sensor.type === "combined" && (
              <Card className="glow-card">
                <CardHeader>
                  <CardTitle>Histórico de Umidade (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="time" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--popover))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                            color: "hsl(var(--popover-foreground))"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="humidity"
                          stroke="hsl(210 100% 60%)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Summary */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Estatísticas (24h)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mínima:</span>
                  <span className="text-blue-400 font-medium">{sensor.minTemp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Média:</span>
                  <span className="text-foreground font-medium">{sensor.avgTemp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Máxima:</span>
                  <span className="text-red-400 font-medium">{sensor.maxTemp}°C</span>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Alertas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="space-y-2">
                    <Badge variant="outline" className={getAlertColor(alert.type)}>
                      {alert.type === "error" ? "Erro" : 
                       alert.type === "warning" ? "Atenção" : "Info"}
                    </Badge>
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(alert.timestamp, { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                    {alert !== alerts[alerts.length - 1] && (
                      <div className="border-b border-border/30 mt-3" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sensor Info */}
            <Card className="glow-card">
              <CardHeader>
                <CardTitle>Informações do Sensor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="text-foreground font-medium capitalize">{sensor.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="text-foreground font-mono text-sm">{sensor.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className={getStatusColor(sensor.status)}>
                    {sensor.status === "online" ? "Online" : 
                     sensor.status === "warning" ? "Atenção" : "Offline"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
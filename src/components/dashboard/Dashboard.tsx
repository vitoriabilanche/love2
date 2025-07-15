import { useState, useEffect } from "react";
import { Sensor } from "@/types/sensor";
import { mockSensors, mockDashboardStats, getUpdatedSensorData } from "@/data/mockSensors";
import { StatsGrid } from "./StatsGrid";
import { SensorCard } from "./SensorCard";
import { SensorDetailModal } from "./SensorDetailModal";
import { AddSensorForm } from "./AddSensorForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  LogOut, 
  Zap, 
  RefreshCw,
  Filter,
  Users
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardProps {
  onLogout: () => void;
  userEmail: string;
}

export function Dashboard({ onLogout, userEmail }: DashboardProps) {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);

  const handleAddSensor = (newSensor: Sensor) => {
    setSensors(prev => [...prev, newSensor]);
  };
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "offline" | "warning">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(getUpdatedSensorData());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setSensors(getUpdatedSensorData());
      setIsRefreshing(false);
    }, 1000);
  };

  // Filter sensors
  const filteredSensors = sensors.filter(sensor => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || sensor.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg cyber-gradient">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold glow-text">MARK ONE</h1>
                  <p className="text-sm text-muted-foreground">Dashboard de Sensores</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <AddSensorForm onAddSensor={handleAddSensor} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-card border-border/50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-card border-border/50">
                    <Users className="w-4 h-4 mr-2" />
                    {userEmail}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glow-card">
                  <DropdownMenuItem onClick={onLogout} className="text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="mb-8">
          <StatsGrid stats={mockDashboardStats} />
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar sensores por nome ou localização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border/50"
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-card border-border/50">
                <Filter className="w-4 h-4 mr-2" />
                {filterStatus === "all" ? "Todos" : 
                 filterStatus === "online" ? "Online" :
                 filterStatus === "offline" ? "Offline" : "Atenção"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glow-card">
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                Todos os Sensores
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("online")}>
                Apenas Online
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("offline")}>
                Apenas Offline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("warning")}>
                Com Atenção
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sensors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
              />
            ))}
        </div>

        {/* Empty State */}
        {filteredSensors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-2">
              Nenhum sensor encontrado
            </div>
            <p className="text-sm text-muted-foreground">
              Tente ajustar os filtros ou termo de busca
            </p>
          </div>
        )}
      </main>

      {/* Sensor Detail Modal */}
      <SensorDetailModal
        sensor={selectedSensor}
        isOpen={!!selectedSensor}
        onClose={() => setSelectedSensor(null)}
      />
    </div>
  );
}
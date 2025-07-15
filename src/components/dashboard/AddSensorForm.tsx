import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Thermometer } from "lucide-react";
import { Sensor, SensorReading } from "@/types/sensor";
import { useToast } from "@/hooks/use-toast";

interface AddSensorFormProps {
  onAddSensor: (sensor: Sensor) => void;
}

export function AddSensorForm({ onAddSensor }: AddSensorFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "temperature" as "temperature" | "humidity" | "combined"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Generate random initial reading
    const initialTemp = Math.floor(Math.random() * 40) + 10; // 10-50°C
    const initialHumidity = formData.type === "combined" ? Math.floor(Math.random() * 40) + 30 : undefined; // 30-70%

    const now = new Date();
    const readings: SensorReading[] = [];
    
    // Generate 24 hours of readings
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      readings.push({
        id: `reading-${Date.now()}-${i}`,
        timestamp,
        temperature: initialTemp + (Math.random() - 0.5) * 10,
        humidity: initialHumidity ? initialHumidity + (Math.random() - 0.5) * 20 : undefined
      });
    }

    const newSensor: Sensor = {
      id: `sensor-${Date.now()}`,
      name: formData.name,
      location: formData.location,
      type: formData.type,
      status: "online",
      lastReading: readings[readings.length - 1],
      readings,
      minTemp: Math.min(...readings.map(r => r.temperature)),
      maxTemp: Math.max(...readings.map(r => r.temperature)),
      avgTemp: Math.round(readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length)
    };

    onAddSensor(newSensor);
    
    toast({
      title: "Sucesso",
      description: `Sensor "${formData.name}" adicionado com sucesso!`
    });

    // Reset form
    setFormData({
      name: "",
      location: "",
      type: "temperature"
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Sensor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Thermometer className="w-5 h-5 mr-2" />
            Novo Sensor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Sensor *</Label>
              <Input
                id="name"
                placeholder="Ex: Sensor Sala Principal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  placeholder="Ex: Sala de Servidores - Andar 2"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="pl-10 bg-secondary/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Sensor</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "temperature" | "humidity" | "combined") => 
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperatura apenas</SelectItem>
                  <SelectItem value="humidity">Umidade apenas</SelectItem>
                  <SelectItem value="combined">Temperatura + Umidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Adicionar Sensor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
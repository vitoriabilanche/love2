import { Sensor, SensorReading, DashboardStats } from "@/types/sensor";

// Generate mock readings for the last 24 hours
function generateMockReadings(sensorId: string, baseTemp: number, count: number = 24): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // Every hour
    const variation = (Math.random() - 0.5) * 4; // ±2°C variation
    const temperature = Math.round((baseTemp + variation) * 10) / 10;
    
    readings.push({
      id: `${sensorId}-reading-${i}`,
      timestamp,
      temperature,
      humidity: Math.round((60 + Math.random() * 20) * 10) / 10, // 60-80% humidity
    });
  }
  
  return readings;
}

// Mock sensors data
export const mockSensors: Sensor[] = [
  {
    id: "sensor-001",
    name: "Sala Servidor Principal",
    location: "Data Center - Rack A1",
    type: "combined",
    status: "online",
    lastReading: {
      id: "reading-001",
      timestamp: new Date(),
      temperature: 22.5,
      humidity: 65.2,
    },
    readings: generateMockReadings("sensor-001", 22.5),
    minTemp: 20.1,
    maxTemp: 24.8,
    avgTemp: 22.4,
  },
  {
    id: "sensor-002",
    name: "Ambiente Produção",
    location: "Galpão Industrial - Setor B",
    type: "temperature",
    status: "online",
    lastReading: {
      id: "reading-002",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      temperature: 28.1,
    },
    readings: generateMockReadings("sensor-002", 28.1),
    minTemp: 25.3,
    maxTemp: 31.2,
    avgTemp: 28.0,
  },
  {
    id: "sensor-003",
    name: "Câmara Fria",
    location: "Estoque - Refrigeração",
    type: "combined",
    status: "warning",
    lastReading: {
      id: "reading-003",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      temperature: -18.5,
      humidity: 85.1,
    },
    readings: generateMockReadings("sensor-003", -18.5),
    minTemp: -20.1,
    maxTemp: -16.8,
    avgTemp: -18.2,
  },
  {
    id: "sensor-004",
    name: "Escritório Administrativo",
    location: "Edifício Principal - 2º Andar",
    type: "combined",
    status: "online",
    lastReading: {
      id: "reading-004",
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      temperature: 24.2,
      humidity: 55.8,
    },
    readings: generateMockReadings("sensor-004", 24.2),
    minTemp: 22.1,
    maxTemp: 26.5,
    avgTemp: 24.1,
  },
  {
    id: "sensor-005",
    name: "Laboratório Químico",
    location: "Prédio de Pesquisa - Lab 101",
    type: "combined",
    status: "offline",
    lastReading: {
      id: "reading-005",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      temperature: 21.8,
      humidity: 45.2,
    },
    readings: generateMockReadings("sensor-005", 21.8),
    minTemp: 20.5,
    maxTemp: 23.1,
    avgTemp: 21.9,
  },
  {
    id: "sensor-006",
    name: "Área Externa",
    location: "Pátio Principal",
    type: "combined",
    status: "online",
    lastReading: {
      id: "reading-006",
      timestamp: new Date(),
      temperature: 32.4,
      humidity: 72.1,
    },
    readings: generateMockReadings("sensor-006", 32.4),
    minTemp: 28.9,
    maxTemp: 35.7,
    avgTemp: 32.1,
  },
];

// Calculate dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalSensors: mockSensors.length,
  onlineSensors: mockSensors.filter(s => s.status === "online").length,
  offlineSensors: mockSensors.filter(s => s.status === "offline").length,
  avgTemperature: Math.round(mockSensors.reduce((sum, s) => sum + s.avgTemp, 0) / mockSensors.length * 10) / 10,
  minTemperature: Math.min(...mockSensors.map(s => s.minTemp)),
  maxTemperature: Math.max(...mockSensors.map(s => s.maxTemp)),
};

// Function to get updated sensor data (simulates real-time updates)
export function getUpdatedSensorData(): Sensor[] {
  return mockSensors.map(sensor => {
    if (sensor.status === "offline") return sensor;
    
    // Generate new reading
    const baseTemp = sensor.avgTemp;
    const variation = (Math.random() - 0.5) * 2;
    const newTemperature = Math.round((baseTemp + variation) * 10) / 10;
    
    const newReading: SensorReading = {
      id: `${sensor.id}-reading-${Date.now()}`,
      timestamp: new Date(),
      temperature: newTemperature,
      humidity: sensor.type === "combined" ? Math.round((60 + Math.random() * 20) * 10) / 10 : undefined,
    };
    
    return {
      ...sensor,
      lastReading: newReading,
      readings: [...sensor.readings.slice(1), newReading], // Keep last 24 readings
    };
  });
}
export interface SensorReading {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity?: number;
}

export interface Sensor {
  id: string;
  name: string;
  location: string;
  type: "temperature" | "humidity" | "combined";
  status: "online" | "offline" | "warning";
  lastReading: SensorReading;
  readings: SensorReading[];
  minTemp: number;
  maxTemp: number;
  avgTemp: number;
}

export interface DashboardStats {
  totalSensors: number;
  onlineSensors: number;
  offlineSensors: number;
  avgTemperature: number;
  minTemperature: number;
  maxTemperature: number;
}
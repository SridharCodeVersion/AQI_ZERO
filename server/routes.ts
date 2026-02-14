import type { Express } from "express";
import type { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { api, errorSchemas, WS_EVENTS, type RiskAnalysis } from "@shared/routes";
import { z } from "zod";
import { randomUUID } from "crypto";

// Mock Data Generators
function generateSensorData() {
  const types = ['MQ-2', 'MQ-7', 'DHT22', 'MPU6050'];
  const type = types[Math.floor(Math.random() * types.length)];
  let params: Record<string, number> = {};
  let unit = '';

  switch (type) {
    case 'MQ-2': // Smoke/Gas
      params = {
        smoke: 200 + Math.random() * 100,
        lpg: 150 + Math.random() * 50,
        propane: 180 + Math.random() * 70
      };
      unit = 'ppm';
      break;
    case 'MQ-7': // CO
      params = {
        co: 5 + Math.random() * 20
      };
      unit = 'ppm';
      break;
    case 'DHT22': // Temp/Humidity
      params = {
        temp: 25 + Math.random() * 15,
        humidity: 40 + Math.random() * 40
      };
      unit = 'mixed';
      break;
    case 'MPU6050': // IMU
      params = {
        accel_x: Math.random() * 2 - 1,
        accel_y: Math.random() * 2 - 1,
        accel_z: Math.random() * 2 - 1,
        gyro_x: Math.random() * 500 - 250,
        gyro_y: Math.random() * 500 - 250,
        gyro_z: Math.random() * 500 - 250
      };
      unit = 'G / deg/s';
      break;
  }

  return { type, params, unit, region: 'Delhi-NCR', coordinates: { lat: 28.6139, lng: 77.2090 } };
}

function generateDroneData() {
  // Simulate drone moving in a circle around Delhi
  const time = Date.now() / 10000;
  const lat = 28.6139 + Math.cos(time) * 0.01;
  const lng = 77.2090 + Math.sin(time) * 0.01;
  
  return {
    name: 'Drone-Alpha',
    status: 'active',
    battery: Math.floor(Math.max(0, 100 - (Date.now() % 3600000) / 36000)), // Drain over an hour
    latitude: lat,
    longitude: lng,
    altitude: 50 + Math.random() * 5,
    heading: (Date.now() / 100) % 360,
    speed: 30 + Math.random() * 5,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // WebSocket Setup
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  // Broadcast helper
  const broadcast = (type: string, payload: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
      }
    });
  };

  // Simulation Loop
  setInterval(async () => {
    // 1. Generate and save sensor data
    const sensorData = generateSensorData();
    const savedSensor = await storage.addSensorReading(sensorData);
    broadcast(WS_EVENTS.SENSOR_UPDATE, savedSensor);

    // 2. Generate and update drone data
    const droneData = generateDroneData();
    const savedDrone = await storage.updateDroneStatus(droneData);
    broadcast(WS_EVENTS.DRONE_UPDATE, savedDrone);

    // 3. Randomly generate risk updates (simulated AI engine output)
    if (Math.random() < 0.1) { // 10% chance every tick
      const riskAnalysis: RiskAnalysis = {
        score: Math.floor(Math.random() * 100),
        level: ['Safe', 'Moderate', 'Severe', 'Hazardous'][Math.floor(Math.random() * 4)] as any,
        factors: {
          co: Math.random() * 10,
          gas: Math.random() * 10,
          particulate: Math.random() * 10,
        },
        recommendation: "Reduce outdoor activity in sector 4.",
      };
      broadcast(WS_EVENTS.RISK_UPDATE, riskAnalysis);
      
      // If critical, trigger alert
      if (riskAnalysis.level === 'Hazardous') {
        const alert = await storage.createAlert({
          severity: 'critical',
          title: 'Hazardous Air Quality Detected',
          description: `Risk score reached ${riskAnalysis.score}. Immediate action required.`,
          region: 'Delhi-NCR',
          status: 'active',
        });
        broadcast(WS_EVENTS.ALERT_NEW, alert);
      }
    }
  }, 2000); // Run every 2 seconds

  // REST APIs
  
  app.get(api.sensors.list.path, async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const readings = await storage.getLatestReadings(limit);
    res.json(readings);
  });

  app.get(api.sensors.latest.path, async (req, res) => {
    // Group by type and get latest
    const readings = await storage.getLatestReadings(100);
    const latest: Record<string, any> = {};
    readings.forEach(r => {
      if (!latest[r.type]) {
        latest[r.type] = r;
      }
    });
    res.json(latest);
  });

  app.get(api.drones.list.path, async (req, res) => {
    const drones = await storage.getDrones();
    res.json(drones);
  });

  app.post(api.drones.update.path, async (req, res) => {
    try {
      const droneData = { ...req.body, name: req.body.name || 'Drone-Alpha' }; // Default name if missing
      const updated = await storage.updateDroneStatus(droneData);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ message: "Failed to update drone" });
    }
  });

  app.get(api.alerts.list.path, async (req, res) => {
    const alerts = await storage.getAlerts();
    res.json(alerts);
  });

  app.post(api.alerts.create.path, async (req, res) => {
    try {
      const input = api.alerts.create.input.parse(req.body);
      const alert = await storage.createAlert(input);
      res.status(201).json(alert);
    } catch (e) {
      res.status(400).json({ message: "Invalid alert data" });
    }
  });

  app.get(api.chat.history.path, async (req, res) => {
    const history = await storage.getChatHistory();
    res.json(history);
  });

  app.post(api.chat.send.path, async (req, res) => {
    const { message } = req.body;
    
    // Save user message
    const userMsg = await storage.addChatMessage({ role: 'user', content: message });
    
    // Simulate AI response (Mock for now, replacing actual OpenAI call to keep it simple and fast for demo, 
    // but structure allows easy swap to real OpenAI call)
    // In a real app, we would call OpenAI here using the key or the Replit integration
    
    let aiResponseText = "I am analyzing the environmental data. Please wait.";
    if (message.toLowerCase().includes('risk')) {
      aiResponseText = "Current risk analysis indicates high CO levels in Sector 5. Recommend dispatching drone for closer inspection.";
    } else if (message.toLowerCase().includes('status')) {
      aiResponseText = "All systems operational. Drone-Alpha is currently at 52m altitude tracking south-west.";
    }

    const aiMsg = await storage.addChatMessage({ role: 'assistant', content: aiResponseText });
    
    res.json(aiMsg);
  });

  app.get(api.risk.analysis.path, async (req, res) => {
    // Return current simulated risk
    res.json({
      score: 75,
      level: 'Severe',
      factors: { co: 12.5, gas: 450, particulate: 180 },
      recommendation: "Deploy mitigation teams to Central Delhi."
    });
  });

  return httpServer;
}

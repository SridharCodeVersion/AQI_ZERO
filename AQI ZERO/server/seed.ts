import { storage } from "./storage";

async function seed() {
  console.log("Seeding database...");

  // 1. Create fake drones
  const drones = [
    { name: "Drone-Alpha", status: "active", battery: 85, latitude: 28.6139, longitude: 77.2090, altitude: 120, heading: 45, speed: 25 },
    { name: "Drone-Beta", status: "returning", battery: 20, latitude: 28.5355, longitude: 77.3910, altitude: 80, heading: 180, speed: 15 },
    { name: "Drone-Gamma", status: "maintenance", battery: 100, latitude: 28.7041, longitude: 77.1025, altitude: 0, heading: 0, speed: 0 },
  ];

  for (const drone of drones) {
    await storage.updateDroneStatus(drone);
  }

  // 2. Create some initial alerts
  const alerts = [
    { severity: "medium", title: "High CO Levels Detected", description: "CO levels exceeding 15ppm in Sector 4.", region: "Rohini", status: "active" },
    { severity: "low", title: "Drone Connection Unstable", description: "Signal interference detected for Drone-Beta.", region: "Noida", status: "resolved" },
  ];

  for (const alert of alerts) {
    await storage.createAlert(alert);
  }

  // 3. Create some sensor readings history
  const readings = [];
  const now = Date.now();
  for (let i = 0; i < 50; i++) {
    readings.push({
      type: "MQ-2",
      params: {
        smoke: 200 + Math.random() * 100,
        lpg: 150 + Math.random() * 50,
        propane: 180 + Math.random() * 70
      },
      unit: "ppm",
      region: "Delhi-NCR",
      coordinates: { lat: 28.6139, lng: 77.2090 },
    });
  }
  
  // We can't batch insert easily with the current storage interface, so we'll just insert a few
  for (const reading of readings.slice(0, 10)) {
    await storage.addSensorReading(reading);
  }

  console.log("Seeding complete!");
}

seed().catch(console.error);

import { db } from "./db";
import {
  sensorReadings,
  drones,
  alerts,
  chatMessages,
  type SensorReading,
  type InsertSensorReading,
  type Drone,
  type InsertDrone,
  type Alert,
  type InsertAlert,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { eq, desc, limit } from "drizzle-orm";

export interface IStorage {
  // Sensors
  addSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  getLatestReadings(limit?: number): Promise<SensorReading[]>;
  
  // Drones
  updateDroneStatus(drone: InsertDrone): Promise<Drone>;
  getDrones(): Promise<Drone[]>;
  getDrone(id: number): Promise<Drone | undefined>;

  // Alerts
  createAlert(alert: InsertAlert): Promise<Alert>;
  getAlerts(): Promise<Alert[]>;

  // Chat
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(): Promise<ChatMessage[]>;
}

export class DatabaseStorage implements IStorage {
  async addSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const [newReading] = await db.insert(sensorReadings).values({
      ...reading,
      params: reading.params as any
    }).returning();
    return newReading;
  }

  async getLatestReadings(limitCount: number = 50): Promise<SensorReading[]> {
    return await db.select()
      .from(sensorReadings)
      .orderBy(desc(sensorReadings.timestamp))
      .limit(limitCount);
  }

  async updateDroneStatus(drone: InsertDrone): Promise<Drone> {
    // For simplicity in this demo, we'll just insert a new record or update existing based on name if we had unique constraint
    // But schema says id is serial primary key. Let's assume we maintain a list of active drones.
    // For this MVP, let's just insert/update a single drone for the demo or list of drones.
    // We will check if a drone with this name exists, update it, or create new.
    
    const existing = await db.select().from(drones).where(eq(drones.name, drone.name)).limit(1);
    
    if (existing.length > 0) {
      const [updated] = await db.update(drones)
        .set(drone)
        .where(eq(drones.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [newDrone] = await db.insert(drones).values(drone).returning();
      return newDrone;
    }
  }

  async getDrones(): Promise<Drone[]> {
    return await db.select().from(drones);
  }

  async getDrone(id: number): Promise<Drone | undefined> {
    const [drone] = await db.select().from(drones).where(eq(drones.id, id));
    return drone;
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.timestamp));
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).orderBy(chatMessages.timestamp);
  }
}

export const storage = new DatabaseStorage();

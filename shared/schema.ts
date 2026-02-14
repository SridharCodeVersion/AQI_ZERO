import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Sensor Readings (Simulated data ingestion)
export const sensorReadings = pgTable("sensor_readings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'MQ-2', 'MQ-7', 'DHT22', 'MPU6050', etc.
  value: doublePrecision("value").notNull(),
  unit: text("unit").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  region: text("region").default("Delhi-NCR"),
  coordinates: jsonb("coordinates"), // {lat: number, lng: number}
});

// Drone Status
export const drones = pgTable("drones", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'active', 'returning', 'maintenance'
  battery: integer("battery").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  altitude: doublePrecision("altitude").notNull(), // meters
  heading: doublePrecision("heading").notNull(), // degrees
  speed: doublePrecision("speed").notNull(), // km/h
  lastUpdate: timestamp("last_update").defaultNow(),
});

// Alerts
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  description: text("description").notNull(),
  region: text("region").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").default("active"), // 'active', 'resolved'
});

// AI Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(), // 'user', 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type SensorReading = typeof sensorReadings.$inferSelect;
export type Drone = typeof drones.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;

export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({ id: true, timestamp: true });
export const insertDroneSchema = createInsertSchema(drones).omit({ id: true, lastUpdate: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, timestamp: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, timestamp: true });

export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;
export type InsertDrone = z.infer<typeof insertDroneSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

// WebSocket Message Types
export const WS_EVENTS = {
  SENSOR_UPDATE: 'sensor_update',
  DRONE_UPDATE: 'drone_update',
  ALERT_NEW: 'alert_new',
  RISK_UPDATE: 'risk_update',
} as const;

export interface WsMessage<T = unknown> {
  type: keyof typeof WS_EVENTS;
  payload: T;
}

export type RiskLevel = "Safe" | "Moderate" | "Severe" | "Hazardous";

export interface RiskAnalysis {
  score: number;
  level: RiskLevel;
  factors: {
    co: number;
    gas: number;
    particulate: number;
  };
  recommendation: string;
}

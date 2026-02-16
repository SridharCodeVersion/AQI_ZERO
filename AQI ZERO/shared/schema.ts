import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// === TABLE DEFINITIONS ===

// Sensor Readings (Simulated data ingestion)
export const sensorReadings = sqliteTable("sensor_readings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  type: text("type").notNull(), // 'MQ-2', 'MQ-7', 'DHT22', 'MPU6050'
  params: text("params", { mode: "json" }).notNull(), // { smoke: number, lpg: number, co: number, temp: number, hum: number, accel_x: number, etc. }
  unit: text("unit").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch())`),
  region: text("region").default("Delhi-NCR"),
  coordinates: text("coordinates", { mode: "json" }), // {lat: number, lng: number}
});

// Drone Status
export const drones = sqliteTable("drones", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  status: text("status").notNull(), // 'active', 'returning', 'maintenance'
  battery: integer("battery").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  altitude: real("altitude").notNull(), // meters
  heading: real("heading").notNull(), // degrees
  speed: real("speed").notNull(), // km/h
  lastUpdate: integer("last_update", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Alerts
export const alerts = sqliteTable("alerts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  title: text("title").notNull(),
  description: text("description").notNull(),
  region: text("region").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch())`),
  status: text("status").default("active"), // 'active', 'resolved'
});

// AI Chat Messages
export const chatMessages = sqliteTable("chat_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull(), // 'user', 'assistant'
  content: text("content").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(sql`(unixepoch())`),
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { 
  SensorReading, 
  Drone, 
  Alert, 
  ChatMessage,
  RiskAnalysis,
  InsertAlert
} from "@shared/schema";

// --- Sensors ---
export function useSensors(limit: number = 50, type?: string) {
  return useQuery({
    queryKey: [api.sensors.list.path, limit, type],
    queryFn: async () => {
      const url = buildUrl(api.sensors.list.path) + `?limit=${limit}${type ? `&type=${type}` : ''}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch sensors");
      return api.sensors.list.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Poll every 5s for "live" feel
  });
}

export function useLatestSensors() {
  return useQuery({
    queryKey: [api.sensors.latest.path],
    queryFn: async () => {
      const res = await fetch(api.sensors.latest.path);
      if (!res.ok) throw new Error("Failed to fetch latest sensor data");
      return api.sensors.latest.responses[200].parse(await res.json());
    },
    refetchInterval: 2000,
  });
}

// --- Drones ---
export function useDrones() {
  return useQuery({
    queryKey: [api.drones.list.path],
    queryFn: async () => {
      const res = await fetch(api.drones.list.path);
      if (!res.ok) throw new Error("Failed to fetch drones");
      return api.drones.list.responses[200].parse(await res.json());
    },
    refetchInterval: 1000, // Fast polling for tracking
  });
}

// --- Alerts ---
export function useAlerts() {
  return useQuery({
    queryKey: [api.alerts.list.path],
    queryFn: async () => {
      const res = await fetch(api.alerts.list.path);
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return api.alerts.list.responses[200].parse(await res.json());
    },
    refetchInterval: 10000,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAlert) => {
      const res = await fetch(api.alerts.create.path, {
        method: api.alerts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create alert");
      return api.alerts.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.alerts.list.path] });
    },
  });
}

// --- Risk Analysis ---
export function useRiskAnalysis() {
  return useQuery({
    queryKey: [api.risk.analysis.path],
    queryFn: async () => {
      const res = await fetch(api.risk.analysis.path);
      if (!res.ok) throw new Error("Failed to fetch risk analysis");
      return api.risk.analysis.responses[200].parse(await res.json());
    },
    refetchInterval: 10000,
  });
}

// --- Chat ---
export function useChatHistory() {
  return useQuery({
    queryKey: [api.chat.history.path],
    queryFn: async () => {
      const res = await fetch(api.chat.history.path);
      if (!res.ok) throw new Error("Failed to fetch chat history");
      return api.chat.history.responses[200].parse(await res.json());
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch(api.chat.send.path, {
        method: api.chat.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.chat.send.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chat.history.path] });
    },
  });
}

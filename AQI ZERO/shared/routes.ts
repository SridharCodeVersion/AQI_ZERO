import { z } from 'zod';
import { 
  sensorReadings, 
  drones, 
  alerts, 
  chatMessages, 
  insertSensorReadingSchema,
  insertDroneSchema,
  insertAlertSchema,
  insertChatMessageSchema 
} from './schema';

export { WS_EVENTS, type RiskAnalysis } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  sensors: {
    list: {
      method: 'GET' as const,
      path: '/api/sensors' as const,
      input: z.object({
        limit: z.coerce.number().optional().default(50),
        type: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof sensorReadings.$inferSelect>()),
      },
    },
    latest: {
      method: 'GET' as const,
      path: '/api/sensors/latest' as const,
      responses: {
        200: z.record(z.custom<typeof sensorReadings.$inferSelect>()),
      },
    }
  },
  drones: {
    list: {
      method: 'GET' as const,
      path: '/api/drones' as const,
      responses: {
        200: z.array(z.custom<typeof drones.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/drones/:id/telemetry' as const,
      input: insertDroneSchema.partial(),
      responses: {
        200: z.custom<typeof drones.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  alerts: {
    list: {
      method: 'GET' as const,
      path: '/api/alerts' as const,
      responses: {
        200: z.array(z.custom<typeof alerts.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/alerts' as const,
      input: insertAlertSchema,
      responses: {
        201: z.custom<typeof alerts.$inferSelect>(),
      },
    },
  },
  chat: {
    history: {
      method: 'GET' as const,
      path: '/api/chat' as const,
      responses: {
        200: z.array(z.custom<typeof chatMessages.$inferSelect>()),
      },
    },
    send: {
      method: 'POST' as const,
      path: '/api/chat' as const,
      input: z.object({ message: z.string() }),
      responses: {
        200: z.custom<typeof chatMessages.$inferSelect>(),
      },
    },
  },
  risk: {
    analysis: {
      method: 'GET' as const,
      path: '/api/risk/analysis' as const,
      responses: {
        200: z.object({
          score: z.number(),
          level: z.string(),
          factors: z.object({
            co: z.number(),
            gas: z.number(),
            particulate: z.number(),
          }),
          recommendation: z.string(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

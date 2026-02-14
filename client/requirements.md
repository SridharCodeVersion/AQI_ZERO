## Packages
recharts | For real-time sensor data visualization and risk gauges
framer-motion | For smooth page transitions and UI animations
react-leaflet | For map visualizations (heatmaps, drone tracking)
leaflet | Core map library required by react-leaflet
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind CSS classes

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  mono: ["var(--font-mono)"],
  body: ["var(--font-body)"],
}
colors: {
  neon: {
    green: "hsl(var(--neon-green))",
    blue: "hsl(var(--neon-blue))",
    red: "hsl(var(--neon-red))",
    yellow: "hsl(var(--neon-yellow))",
  }
}

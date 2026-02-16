import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";

// Pages
import Overview from "@/pages/Overview";
import Sensors from "@/pages/Sensors";
import Heatmap from "@/pages/Map";
import Drones from "@/pages/Drones";
import Alerts from "@/pages/Alerts";
import VideoFeed from "@/pages/Video";
import AIAssistant from "@/pages/AI";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-slate-950/50">
        <Switch>
          <Route path="/" component={Overview} />
          <Route path="/sensors" component={Sensors} />
          <Route path="/map" component={Heatmap} />
          <Route path="/drones" component={Drones} />
          <Route path="/alerts" component={Alerts} />
          <Route path="/video" component={VideoFeed} />
          <Route path="/ai" component={AIAssistant} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

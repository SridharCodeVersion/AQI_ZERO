import { useAlerts, useCreateAlert } from "@/hooks/use-aqi-data";
import { AlertTriangle, CheckCircle, Bell, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function Alerts() {
  const { data: alerts } = useAlerts();
  const createAlert = useCreateAlert();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "low",
    region: "Delhi-NCR",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAlert.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        toast({ title: "Alert Broadcasted", description: "Authorities have been notified." });
        setFormData({ title: "", description: "", severity: "low", region: "Delhi-NCR" });
      }
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500/50 bg-red-500/5 text-red-500';
      case 'high': return 'border-orange-500/50 bg-orange-500/5 text-orange-500';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/5 text-yellow-500';
      default: return 'border-blue-500/50 bg-blue-500/5 text-blue-500';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Authority Alerts</h1>
          <p className="text-muted-foreground mt-1">Manage and broadcast emergency notifications</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black hover:bg-primary/90 font-bold gap-2">
              <Bell className="w-4 h-4" /> Broadcast New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-950 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Broadcast Emergency Alert</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label>Title</Label>
                <Input 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="bg-slate-900 border-white/10" 
                  placeholder="e.g. Toxic Gas Leak detected"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Severity</Label>
                  <Select 
                    value={formData.severity}
                    onValueChange={v => setFormData({...formData, severity: v})}
                  >
                    <SelectTrigger className="bg-slate-900 border-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Region</Label>
                  <Input 
                    value={formData.region}
                    onChange={e => setFormData({...formData, region: e.target.value})}
                    className="bg-slate-900 border-white/10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="bg-slate-900 border-white/10"
                  rows={3}
                  placeholder="Action required..."
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={createAlert.isPending}>
                {createAlert.isPending ? "Broadcasting..." : "BROADCAST ALERT"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {alerts?.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-6 rounded-xl border ${getSeverityColor(alert.severity)} backdrop-blur-md relative overflow-hidden`}
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg ${getSeverityColor(alert.severity)} bg-opacity-20`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white flex items-center gap-3">
                      {alert.title}
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-current opacity-70 uppercase">
                        {alert.severity}
                      </span>
                    </h3>
                    <p className="text-sm opacity-80 mt-1 max-w-2xl font-mono">
                      {alert.description}
                    </p>
                    <div className="flex gap-4 mt-4 text-xs font-mono opacity-60">
                      <span>Region: {alert.region}</span>
                      <span>Time: {new Date(alert.timestamp!).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" className="border-current hover:bg-current/10">
                    <Send className="w-3 h-3 mr-2" /> Dispatch Drone
                  </Button>
                  {alert.status === 'active' && (
                    <Button size="sm" variant="ghost" className="hover:bg-green-500/10 hover:text-green-500">
                      <CheckCircle className="w-3 h-3 mr-2" /> Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

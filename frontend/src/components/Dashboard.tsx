"use client";

import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, Clock, Server, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const latencyData = [
  { name: '00:00', latency: 72, volume: 450 },
  { name: '02:00', latency: 65, volume: 320 },
  { name: '04:00', latency: 68, volume: 210 },
  { name: '06:00', latency: 74, volume: 540 },
  { name: '08:00', latency: 85, volume: 890 },
  { name: '10:00', latency: 82, volume: 1100 },
  { name: '12:00', latency: 95, volume: 1540 },
  { name: '14:00', latency: 88, volume: 1420 },
  { name: '16:00', latency: 80, volume: 1210 },
  { name: '18:00', latency: 76, volume: 1050 },
  { name: '20:00', latency: 74, volume: 980 },
  { name: '22:00', latency: 71, volume: 680 },
];

const distributionData = [
  { name: 'GET /notifications', value: 12450, color: '#6366f1' },
  { name: 'POST /notifications', value: 5210, color: '#3b82f6' },
  { name: 'GET /health', value: 742, color: '#10b981' },
];

const BACKEND_URL = 'http://localhost:3001';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests24h: 18402,
    successRate: 99.82,
    averageLatencyMs: 78,
    errorRate: 0.18,
  });

  const [services, setServices] = useState({
    database: "operational",
    emailGateway: "operational",
    smsGateway: "operational",
    pushGateway: "operational"
  });

  // Attempt to fetch fresh stats from backend if running
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/evaluation-service/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalRequests24h: data.totalRequests24h,
            successRate: data.successRate,
            averageLatencyMs: data.averageLatencyMs,
            errorRate: data.errorRate,
          });
        }
      } catch (e) {
        // Fallback to static mock stats if offline
      }

      try {
        const healthRes = await fetch(`${BACKEND_URL}/evaluation-service/health`);
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          setServices(healthData.services);
        }
      } catch (e) {
        // Fallback to static mock health
      }
    };
    
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="status-dashboard" className="space-y-8 print-break-inside-avoid print-full-width">
      {/* Grid of core metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="border border-border bg-card p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Status</span>
            <div className="text-lg sm:text-xl font-bold text-foreground mt-1 flex items-center gap-1.5">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Fully Operational
            </div>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <Server className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border border-border bg-card p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Requests (24h)</span>
            <div className="text-xl sm:text-2xl font-black text-foreground mt-1 font-mono">
              {stats.totalRequests24h.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border border-border bg-card p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Success Rate</span>
            <div className="text-xl sm:text-2xl font-black text-foreground mt-1 font-mono">
              {stats.successRate}%
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border border-border bg-card p-5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Avg Latency</span>
            <div className="text-xl sm:text-2xl font-black text-foreground mt-1 font-mono">
              {stats.averageLatencyMs}ms
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Gateway specific channels status */}
      <div className="border border-border bg-card p-6 rounded-xl shadow-xs">
        <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">Notification Channels Status</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-border/60 bg-muted/10 p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Email Gateway</span>
              <span className="inline-block mt-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                {services.emailGateway}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="border border-border/60 bg-muted/10 p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-xs font-medium text-muted-foreground">SMS Gateway</span>
              <span className="inline-block mt-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                {services.smsGateway}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="border border-border/60 bg-muted/10 p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Push Notifications</span>
              <span className="inline-block mt-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                {services.pushGateway}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>

          <div className="border border-border/60 bg-muted/10 p-4 rounded-lg flex items-center justify-between">
            <div>
              <span className="block text-xs font-medium text-muted-foreground">Database Engine</span>
              <span className="inline-block mt-1.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                {services.database}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </div>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        {/* Latency & Traffic Line Chart */}
        <div className="lg:col-span-2 border border-border bg-card p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">Request Latency & Volume</h4>
              <p className="text-xs text-muted-foreground">Simulated real-time request metrics over 24 hours</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={latencyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis unit="ms" stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--foreground))'
                  }} 
                />
                <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLatency)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Distribution Bar Chart */}
        <div className="border border-border bg-card p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-1">Endpoint Usage Distribution</h4>
            <p className="text-xs text-muted-foreground mb-4">Request volumes split by route API pathways</p>
          </div>

          <div className="h-48 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical" margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" />
                <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" width={110} tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="value" name="Calls">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-3">
            {distributionData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-mono text-foreground text-[10px] sm:text-xs">{item.name}</span>
                </div>
                <span className="font-semibold text-muted-foreground font-mono">{item.value.toLocaleString()} calls</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

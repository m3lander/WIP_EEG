import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, Brain, Signal } from 'lucide-react';

const EEGDashboard = () => {
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({
    amplitude: 0,
    frequency: 0,
    quality: 'Good'
  });

  // Generate more realistic EEG-like data
  const generateEEGPoint = (time) => {
    // Combine multiple frequencies to simulate different brain waves
    // Delta (1-4 Hz)
    const delta = Math.sin(time * 0.003) * 30;
    // Theta (4-8 Hz)
    const theta = Math.sin(time * 0.006) * 20;
    // Alpha (8-13 Hz)
    const alpha = Math.sin(time * 0.01) * 15;
    // Beta (13-30 Hz)
    const beta = Math.sin(time * 0.025) * 10;
    
    // Add some random noise
    const noise = Math.random() * 5 - 2.5;
    
    // Combine all waves
    return delta + theta + alpha + beta + noise;
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newDataPoint = {
        time: now,
        value: generateEEGPoint(now),
        timestamp: new Date(now).toLocaleTimeString()
      };

      setData(prevData => {
        const newData = [...prevData, newDataPoint];
        // Keep last 100 data points for smoother visualization
        return newData.slice(-100);
      });

      // Update metrics
      setMetrics({
        amplitude: Math.round(Math.abs(newDataPoint.value)),
        frequency: Math.round(Math.random() * 20 + 5), // More realistic frequency range
        quality: Math.random() > 0.9 ? 'Poor' : 'Good'
      });
    }, 50); // Update more frequently for smoother visualization

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl p-4 space-y-4">
      {/* Main Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            Real-time EEG Waveform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp"
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis domain={[-80, 80]} />
                <Tooltip />
                <Line 
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Amplitude
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.amplitude} µV</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dominant Frequency
            </CardTitle>
            <Signal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.frequency} Hz</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Signal Quality
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              metrics.quality === 'Good' ? 'text-green-500' : 'text-red-500'
            }`}>
              {metrics.quality}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EEGDashboard;

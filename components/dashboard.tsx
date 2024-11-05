"use client"

import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bell, CheckCircle, XCircle, Clock, BarChart2, TrendingUp, Calendar, Zap } from 'lucide-react'
import EEGDashboard from '@/components/ui/eeg-dashboard'

// Mock data for charts
const focusData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 75 },
  { day: 'Wed', score: 85 },
  { day: 'Thu', score: 70 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 85 },
]

const taskCompletionData = [
  { day: 'Mon', completed: 5, total: 8 },
  { day: 'Tue', completed: 7, total: 9 },
  { day: 'Wed', completed: 6, total: 7 },
  { day: 'Thu', completed: 8, total: 10 },
  { day: 'Fri', completed: 4, total: 6 },
  { day: 'Sat', completed: 3, total: 4 },
  { day: 'Sun', completed: 5, total: 5 },
]

// Mock data for heatmap
const heatmapData = Array.from({ length: 70 }, () => Math.floor(Math.random() * 4))

const HeatmapCell = ({ value }: { value: number }) => {
  const colors = ['#E0E1DD', '#778DA9', '#415A77', '#1B263B']
  return (
    <div
      className="w-3 h-3 rounded-sm"
      style={{ backgroundColor: colors[value] }}
    />
  )
}

const Heatmap = ({ data }: { data: number[] }) => {
  return (
    <div className="grid grid-cols-10 gap-1">
      {data.map((value, index) => (
        <HeatmapCell key={index} value={value} />
      ))}
    </div>
  )
}

export function Dashboard() {
  const [timer, setTimer] = useState(1500) // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsActive(false)
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timer])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimer(1500)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#E0E1DD]">ADHD Productivity Dashboard</h1>
        
        {/* EEG Dashboard Section */}
        <div className="mb-6">
          <Card className="bg-[#1B263B] border-none">
            <CardContent className="p-0">
              <EEGDashboard />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Focus Timer */}
          <Card className="bg-[#1B263B] border-none">
            <CardHeader>
              <CardTitle className="text-[#E0E1DD] flex items-center">
                <Clock className="mr-2" /> Focus Timer
              </CardTitle>
              <CardDescription className="text-[#778DA9]">Stay focused for 25 minutes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-4 text-[#E0E1DD]">{formatTime(timer)}</div>
              <div className="space-x-2">
                <Button onClick={toggleTimer} variant={isActive ? "destructive" : "default"} className="bg-[#415A77] hover:bg-[#778DA9] text-[#E0E1DD]">
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={resetTimer} variant="outline" className="text-[#E0E1DD] border-[#778DA9]">Reset</Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Completion Rate */}
          <Card className="bg-[#1B263B] border-none">
            <CardHeader>
              <CardTitle className="text-[#E0E1DD] flex items-center">
                <BarChart2 className="mr-2" /> Task Completion Rate
              </CardTitle>
              <CardDescription className="text-[#778DA9]">Your progress this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  completed: {
                    label: "Completed Tasks",
                    color: "#778DA9",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#415A77" />
                    <XAxis dataKey="day" stroke="#778DA9" />
                    <YAxis stroke="#778DA9" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="completed" fill="#415A77" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Daily Focus Score */}
          <Card className="bg-[#1B263B] border-none">
            <CardHeader>
              <CardTitle className="text-[#E0E1DD] flex items-center">
                <TrendingUp className="mr-2" /> Daily Focus Score
              </CardTitle>
              <CardDescription className="text-[#778DA9]">Your focus trend this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Focus Score",
                    color: "#778DA9",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={focusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#415A77" />
                    <XAxis dataKey="day" stroke="#778DA9" />
                    <YAxis stroke="#778DA9" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="score" stroke="#778DA9" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Productivity Streak */}
          <Card className="bg-[#1B263B] border-none">
            <CardHeader>
              <CardTitle className="text-[#E0E1DD] flex items-center">
                <Calendar className="mr-2" /> Productivity Streak
              </CardTitle>
              <CardDescription className="text-[#778DA9]">Your consistency over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Heatmap data={heatmapData} />
            </CardContent>
          </Card>

          {/* Distraction Log */}
          <Card className="bg-[#1B263B] border-none">
            <CardHeader>
              <CardTitle className="text-[#E0E1DD] flex items-center">
                <Bell className="mr-2" /> Distraction Log
              </CardTitle>
              <CardDescription className="text-[#778DA9]">Recent interruptions</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-[#E0E1DD]">
                  <Bell className="mr-2 h-4 w-4 text-[#778DA9]" /> Social media notification (5m ago)
                </li>
                <li className="flex items-center text-sm text-[#E0E1DD]">
                  <Bell className="mr-2 h-4 w-4 text-[#778DA9]" /> Phone call (20m ago)
                </li>
                <li className="flex items-center text-sm text-[#E0E1DD]">
                  <Bell className="mr-2 h-4 w-4 text-[#778DA9]" /> Email alert (1h ago)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-[#1B263B] border-none">
            <CardHeader>
              <CardTitle className="text-[#E0E1DD] flex items-center">
                <Zap className="mr-2" /> Quick Actions
              </CardTitle>
              <CardDescription className="text-[#778DA9]">Manage your focus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex items-center justify-center bg-[#415A77] text-[#E0E1DD] border-none hover:bg-[#778DA9]">
                  <CheckCircle className="mr-2 h-4 w-4" /> Start Task
                </Button>
                <Button variant="outline" className="flex items-center justify-center bg-[#415A77] text-[#E0E1DD] border-none hover:bg-[#778DA9]">
                  <XCircle className="mr-2 h-4 w-4" /> Block Distractions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

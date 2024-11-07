'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()

  // Mock data (will be replaced with real data later)
  const mockStats = {
    totalInterviews: 12,
    completedInterviews: 8,
    averageScore: 85,
    upcomingInterview: "Frontend Developer"
  }

  const recentInterviews = [
    { id: 1, role: "Software Engineer", date: "2024-03-15", score: 82 },
    { id: 2, role: "Frontend Developer", date: "2024-03-10", score: 88 },
    { id: 3, role: "Full Stack Developer", date: "2024-03-05", score: 85 }
  ]

  // Button handlers
  const handleStartInterview = () => {
    router.push('/interview')
  }

  const handleViewAllInterviews = () => {
    // This would navigate to a full list view
    router.push('/interviews')
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.totalInterviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.completedInterviews}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockStats.averageScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Next Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{mockStats.upcomingInterview}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Interviews */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Interviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentInterviews.map((interview) => (
              <div 
                key={interview.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{interview.role}</h3>
                  <p className="text-sm text-gray-500">{interview.date}</p>
                </div>
                <div className="text-lg font-medium">
                  {interview.score}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleStartInterview}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Start New Interview
        </Button>
        <Button 
          onClick={handleViewAllInterviews}
          variant="outline"
        >
          View All Interviews
        </Button>
      </div>
    </div>
  )
}
// src/app/HomeClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import TopNav from '@/components/TopNav'
import MissionForm from '@/components/MissionForm'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Zap, Target, Brain, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

type SP = Record<string, string | string[] | undefined>

interface RecentMission {
  id: string
  title: string
  status: string
  createdAt: string
  progress: number
}

export default function HomeClient({ searchParams }: { searchParams: SP }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [recentMissions, setRecentMissions] = useState<RecentMission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Use the server-provided searchParams directly (no useSearchParams hook)
  const newParam = searchParams.new as string

  useEffect(() => {
    // Check if user wants to create a new mission
    if (newParam === 'true') {
      setShowForm(true)
    }

    // Fetch recent missions
    fetchRecentMissions()
  }, [newParam])

  const fetchRecentMissions = async () => {
    try {
      const response = await fetch('/api/missions?limit=5')
      if (response.ok) {
        const data = await response.json()
        setRecentMissions(data.missions || [])
      }
    } catch (error) {
      console.error('Failed to fetch recent missions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMissionCreated = (mission: { id: string; title: string; description: string }) => {
    router.push(`/missions/${mission.id}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800'
      case 'RUNNING': return 'bg-blue-100 text-blue-800'
      case 'ERROR': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (showForm) {
    return (
      <>
        <TopNav />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create New Mission</h1>
              <p className="text-gray-600 mt-2">Describe what you want to accomplish and let AI break it down into actionable steps.</p>
            </div>
            <MissionForm onSubmit={handleMissionCreated} />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <TopNav />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600">
                <Bot className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI Mission Agent
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
              Transform complex ideas into structured action plans. Our AI agent decomposes missions, 
              conducts research, and delivers comprehensive reports with citations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" onClick={() => setShowForm(true)} className="text-lg px-8 py-3">
                <Target className="mr-2 h-5 w-5" />
                Start New Mission
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                <Link href="/missions">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  View All Missions
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                      <Brain className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Planning</h3>
                  <p className="text-gray-600 text-sm">AI breaks down complex missions into logical, executable steps</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Real Research</h3>
                  <p className="text-gray-600 text-sm">Conducts actual web research with proper citations and sources</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Structured Output</h3>
                  <p className="text-gray-600 text-sm">Delivers comprehensive reports ready for immediate use</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Missions */}
      {!isLoading && recentMissions.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Recent Missions</h2>
              
              <div className="space-y-4">
                {recentMissions.map((mission) => (
                  <Card key={mission.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{mission.title}</h3>
                          <div className="flex items-center space-x-4">
                            <Badge className={getStatusColor(mission.status)}>
                              {mission.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(mission.createdAt).toLocaleDateString()}
                            </span>
                            {mission.status === 'RUNNING' && (
                              <span className="text-sm text-blue-600">
                                {mission.progress}% complete
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="outline" asChild>
                          <Link href={`/missions/${mission.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link href="/missions">View All Missions</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Describe Your Mission</h3>
                <p className="text-gray-600">
                  Tell us what you want to accomplish in natural language. Be as detailed or as high-level as you like.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white text-2xl font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Creates Plan</h3>
                <p className="text-gray-600">
                  Our AI analyzes your mission and creates a step-by-step execution plan with research and analysis tasks.
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-white text-2xl font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Results</h3>
                <p className="text-gray-600">
                  Watch in real-time as the AI executes each step, conducts research, and delivers your final report.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

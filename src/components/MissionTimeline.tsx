'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Clock, AlertCircle, Play } from 'lucide-react'

interface Step {
  id: string
  index: number
  title: string
  objective: string
  status: string
  input?: string
  output?: string
  confidence?: number
  toolsUsed: string
  createdAt: string
  updatedAt: string
  sources: Array<{
    id: string
    title: string
    url: string
    snippet: string
  }>
  artifacts: Array<{
    id: string
    type: string
    title: string
    content: string
  }>
}

interface MissionTimelineProps {
  steps: Step[]
}

export default function MissionTimeline({ steps }: MissionTimelineProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'RUNNING':
        return <Play className="h-5 w-5 text-blue-600 animate-pulse" />
      case 'ERROR':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'PENDING':
        return <Circle className="h-5 w-5 text-gray-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'DONE': return 'border-green-200 bg-green-50'
      case 'RUNNING': return 'border-blue-200 bg-blue-50'
      case 'ERROR': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONE': return 'bg-green-100 text-green-800'
      case 'RUNNING': return 'bg-blue-100 text-blue-800'
      case 'ERROR': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatToolsUsed = (toolsUsed: string) => {
    try {
      const tools = JSON.parse(toolsUsed)
      return Array.isArray(tools) ? tools : []
    } catch {
      return []
    }
  }

  if (steps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="h-8 w-8 mx-auto mb-2" />
        <p>No steps planned yet. Mission planning will begin when you start the mission.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <Card key={step.id} className={`border-l-4 ${getStepColor(step.status)}`}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Step Icon */}
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step.status)}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                {/* Step Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      Step {step.index + 1}
                    </span>
                    <Badge className={getStatusBadge(step.status)}>
                      {step.status}
                    </Badge>
                  </div>
                  
                  {step.confidence && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <Progress value={step.confidence * 100} className="w-16 h-2" />
                      <span className="text-xs text-gray-700">
                        {Math.round(step.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Step Title and Objective */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {step.objective}
                </p>

                {/* Tools Used */}
                {formatToolsUsed(step.toolsUsed).length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 mr-2">Tools used:</span>
                    <div className="flex flex-wrap gap-1">
                      {formatToolsUsed(step.toolsUsed).map((tool, toolIndex) => (
                        <Badge key={toolIndex} variant="outline" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step Output */}
                {step.output && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Output:</h4>
                    <div className="bg-white border rounded-lg p-3">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-3">
                        {step.output}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sources */}
                {step.sources.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Sources ({step.sources.length}):
                    </h4>
                    <div className="space-y-2">
                      {step.sources.slice(0, 3).map((source, sourceIndex) => (
                        <div key={sourceIndex} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-blue-900 mb-1">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {source.title}
                            </a>
                          </h5>
                          <p className="text-xs text-blue-700 line-clamp-2">
                            {source.snippet}
                          </p>
                        </div>
                      ))}
                      {step.sources.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{step.sources.length - 3} more sources
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Artifacts */}
                {step.artifacts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Artifacts ({step.artifacts.length}):
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.artifacts.map((artifact, artifactIndex) => (
                        <Badge key={artifactIndex} variant="secondary">
                          {artifact.type}: {artifact.title}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created: {new Date(step.createdAt).toLocaleString()}</span>
                    {step.updatedAt !== step.createdAt && (
                      <span>Updated: {new Date(step.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

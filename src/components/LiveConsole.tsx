'use client'

import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { Terminal, Activity, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react'

interface ConsoleMessage {
  timestamp: number
  type: string
  data: Record<string, unknown>
}

interface LiveConsoleProps {
  messages: ConsoleMessage[]
  isActive: boolean
}

export default function LiveConsole({ messages, isActive }: LiveConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [messages])

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'planning_start':
      case 'planning_complete':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'step_start':
        return <Zap className="h-4 w-4 text-yellow-500" />
      case 'step_progress':
        return <Activity className="h-4 w-4 text-orange-500" />
      case 'step_complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'step_error':
      case 'mission_error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'mission_complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Terminal className="h-4 w-4 text-gray-500" />
    }
  }

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'planning_start':
      case 'planning_complete':
        return 'text-blue-700'
      case 'step_start':
        return 'text-yellow-700'
      case 'step_progress':
        return 'text-orange-700'
      case 'step_complete':
        return 'text-green-700'
      case 'step_error':
      case 'mission_error':
        return 'text-red-700'
      case 'mission_complete':
        return 'text-green-800'
      default:
        return 'text-gray-700'
    }
  }

  const formatMessage = (message: ConsoleMessage): string => {
    const { type, data } = message

    switch (type) {
      case 'planning_start':
        return `Starting mission planning: "${data.title}"`
      
      case 'planning_complete':
        return `Planning complete. Created ${Array.isArray(data.steps) ? data.steps.length : 0} steps.`
      
      case 'step_start':
        return `Starting Step ${typeof data.stepIndex === 'number' ? data.stepIndex + 1 : '?'}: ${data.title || 'Unknown'}`
      
      case 'step_progress':
        return (typeof data.message === 'string' ? data.message : '') || 'Step in progress...'
      
      case 'step_complete':
        return `✓ Completed Step ${typeof data.stepIndex === 'number' ? data.stepIndex + 1 : '?'} (Confidence: ${Math.round((typeof data.confidence === 'number' ? data.confidence : 0) * 100)}%)`
      
      case 'step_error':
        return `✗ Step ${typeof data.stepIndex === 'number' ? data.stepIndex + 1 : '?'} failed: ${data.error || 'Unknown error'}`
      
      case 'mission_complete':
        return '🎉 Mission completed successfully!'
      
      case 'mission_error':
        return `❌ Mission failed: ${data.error || 'Unknown error'}`
      
      default:
        return JSON.stringify(data)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="h-64 flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Live Console</span>
          {isActive && (
            <Badge className="bg-green-500 text-white text-xs">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
              LIVE
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      {/* Console Content */}
      <div 
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 text-sm font-mono"
      >
        {messages.length === 0 ? (
          <div className="text-gray-500 italic">
            {isActive ? 'Waiting for mission events...' : 'Console is ready. Start a mission to see live updates.'}
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-3 group">
              {/* Timestamp */}
              <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">
                {formatTimestamp(message.timestamp)}
              </span>
              
              {/* Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getMessageIcon(message.type)}
              </div>
              
              {/* Message */}
              <div className={`flex-1 ${getMessageColor(message.type)}`}>
                <span className="text-white">
                  {formatMessage(message)}
                </span>
                
                {/* Additional data for some message types */}
                {message.type === 'step_start' && typeof message.data.objective === 'string' ? (
                  <div className="text-gray-400 text-xs mt-1">
                    Objective: {message.data.objective}
                  </div>
                ) : null}
                
                {message.type === 'step_error' && typeof message.data.error === 'string' ? (
                  <div className="text-red-400 text-xs mt-1 pl-4 border-l-2 border-red-600">
                    {message.data.error}
                  </div>
                ) : null}
                
                {message.type === 'planning_complete' && Array.isArray(message.data.steps) ? (
                  <div className="text-gray-400 text-xs mt-1">
                    Steps: {message.data.steps.map((step: Record<string, unknown>, i: number) => 
                      `${i + 1}. ${step.title || 'Untitled'}`
                    ).join(' • ')}
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
        
        {/* Active Cursor */}
        {isActive && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 text-xs">
              {formatTimestamp(Date.now())}
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-4 bg-green-500 animate-pulse"></div>
              <span className="text-green-400">Mission running...</span>
            </div>
          </div>
        )}
      </div>

      {/* Console Footer */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {messages.length} events
          </span>
          <span>
            {isActive ? 'Streaming live updates' : 'Console ready'}
          </span>
        </div>
      </div>
    </div>
  )
}

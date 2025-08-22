'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { toast } from 'sonner'
import { 
  Loader2, 
  Sparkles, 
  Globe, 
  FileText, 
  Download, 
  Copy, 
  ChevronDown, 
  Sun, 
  Moon,
  
  CheckCircle,
  Clock,
  ExternalLink,
  AlertCircle
} from 'lucide-react'

interface PlanStep {
  index: number
  title: string
  objective: string
  queries: string[]
  deliverable: string
  estimatedTime: string
  tools: ["Web Search (Tavily)", "Summarization"]
  status?: "pending" | "in-progress" | "completed" | "error"
  sources?: {
    title: string
    url: string
    snippet?: string
  }[]
}

interface MissionPlan {
  planTitle: string
  totalSteps: number
  estimatedTime: string
  steps: PlanStep[]
}

interface ApiError {
  error: string
  details?: Array<{ message: string; path: string[] }>
}

export default function PlanningClient() {
  const [mission, setMission] = useState('')
  const [plan, setPlan] = useState<MissionPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Dark mode persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      const isDark = savedTheme === 'dark'
      setIsDarkMode(isDark)
      document.documentElement.classList.toggle('dark', isDark)
    }
  }, [])

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', newTheme)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!mission.trim()) {
      setError('Please enter a mission')
      return
    }

    setIsLoading(true)
    setError(null)
    setPlan(null)

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mission: mission.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorData = data as ApiError
        throw new Error(errorData.error || 'Failed to generate plan')
      }

      setPlan(data as MissionPlan)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPlan(null)
    setError(null)
    setMission('')
    
  }

  // Export functionality
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!", {
        description: "Text has been copied to your clipboard",
        duration: 2000,
      })
    } catch {
      toast.error("Failed to copy", {
        description: "Please try again or copy manually",
      })
    }
  }

  const downloadJSON = () => {
    if (!plan) return
    const dataStr = JSON.stringify(plan, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `mission-plan-${Date.now()}.json`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success(`Downloaded ${exportFileDefaultName}`, {
      description: "File saved to your downloads folder",
    })
  }

  const downloadMarkdown = () => {
    if (!plan) return
    
    let markdown = `# ${plan.planTitle}\n\n`
    markdown += `**Total Steps:** ${plan.totalSteps}  \n`
    markdown += `**Estimated Time:** ${plan.estimatedTime}\n\n`
    
    plan.steps.forEach((step) => {
      markdown += `## Step ${step.index}: ${step.title}\n\n`
      markdown += `**Objective:** ${step.objective}\n\n`
      markdown += `**Suggested Queries:**\n`
      step.queries.forEach(query => {
        markdown += `- \`${query}\`\n`
      })
      markdown += `\n**Expected Deliverable:** ${step.deliverable}\n\n`
      markdown += `**Estimated Time:** ${step.estimatedTime}\n\n`
      markdown += `**Available Tools:** ${step.tools.join(', ')}\n\n`
      
      if (step.sources && step.sources.length > 0) {
        markdown += `**Sources:**\n`
        step.sources.forEach(source => {
          markdown += `- [${source.title}](${source.url})\n`
        })
        markdown += '\n'
      }
      
      markdown += '---\n\n'
    })
    
    const dataStr = markdown
    const dataUri = 'data:text/markdown;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `mission-plan-${Date.now()}.md`
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    toast.success(`Downloaded ${exportFileDefaultName}`, {
      description: "File saved to your downloads folder",
    })
  }

  const getCompletedSteps = () => {
    if (!plan) return 0
    return plan.steps.filter(step => step.status === 'completed').length
  }

  return (
    <div className="min-h-screen relative">
      {/* Background with gradient and glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-500/20 to-transparent blur-3xl"></div>
      </div>

      {/* Dark mode toggle */}
      <Button 
        variant="ghost" 
        size="sm"
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-50"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="font-bold text-4xl md:text-6xl mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              AI Mission Planner
            </motion.h1>
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Enter your mission and get a step-by-step, AI-powered research plan.
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Mission Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="shadow-2xl shadow-purple-500/20 border-2 border-gray-200 dark:border-gray-700">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="e.g., Research B2B SaaS market trends and identify top 5 growth opportunities"
                        value={mission}
                        onChange={(e) => setMission(e.target.value)}
                        disabled={isLoading}
                        className="min-h-[120px] text-lg border-2 border-gray-200 dark:border-gray-700 
                                   focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                                   rounded-xl resize-none"
                        maxLength={500}
                      />
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${mission.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                          {mission.length}/500 characters
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="flex gap-3">
                        {(plan || error) && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isLoading}
                          >
                            Reset
                          </Button>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !mission.trim()}
                        className="w-full md:w-auto px-8 py-3 text-lg font-semibold
                                   bg-gradient-to-r from-purple-600 to-indigo-600 
                                   hover:from-purple-700 hover:to-indigo-700
                                   transform hover:scale-105 transition-all duration-200
                                   shadow-lg hover:shadow-xl"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Planning Mission...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Plan Mission
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
                      {(error.includes('API_KEY') || error.includes('provider')) && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-800/20 rounded-lg">
                          <p className="text-sm text-red-700 dark:text-red-400">
                            <strong>Setup Instructions:</strong>
                          </p>
                          <ol className="text-sm text-red-700 dark:text-red-400 mt-1 list-decimal list-inside space-y-1">
                            <li>Create a <code>.env.local</code> file in your project root</li>
                            <li>Add at least one API key:</li>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                              <li><code>OPENAI_API_KEY=your_openai_key</code> (GPT-4o-mini)</li>
                              <li><code>GEMINI_API_KEY=your_gemini_key</code> (Gemini 1.5 Flash)</li>
                              <li><code>COHERE_API_KEY=your_cohere_key</code> (Command R+)</li>
                              <li><code>HF_API_KEY=your_huggingface_key</code> (Mistral via HF)</li>
                            </ul>
                            <li>Optionally set <code>LLM_PROVIDER=auto|openai|gemini|cohere|mistral</code></li>
                            <li>Restart your development server</li>
                          </ol>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plan Display */}
            <AnimatePresence>
              {plan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Plan Header with Progress */}
                  <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <h2 className="text-xl font-bold text-green-800 dark:text-green-300">{plan.planTitle}</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{plan.totalSteps}</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Total Steps</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{plan.estimatedTime}</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Estimated Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-700 dark:text-green-400">{getCompletedSteps()}/{plan.totalSteps}</div>
                          <div className="text-sm text-green-600 dark:text-green-500">Completed</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(getCompletedSteps() / plan.totalSteps) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step Cards */}
                  <div className="space-y-4 md:space-y-0 md:relative">
                    {plan.steps.map((step, index) => (
                      <motion.div
                        key={step.index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                      >
                        <Card className="relative p-6 border-2 hover:border-purple-300 dark:hover:border-purple-700 
                                         transition-all duration-300 hover:shadow-lg">
                          {/* Step Number Badge */}
                          <div className="absolute -left-4 top-6 w-8 h-8 rounded-full 
                                          bg-gradient-to-r from-purple-600 to-indigo-600 
                                          flex items-center justify-center text-white font-bold z-10">
                            {step.index}
                          </div>
                          
                          {/* Desktop Timeline Connector */}
                          {index < plan.steps.length - 1 && (
                            <div className="hidden md:block absolute left-0 top-14 w-px h-16 
                                            bg-gradient-to-b from-purple-400 to-indigo-400 ml-[-2px]" />
                          )}
                          
                          <div className="ml-8 md:ml-6">
                            {/* Collapsible Header */}
                            <Collapsible>
                              <CollapsibleTrigger className="w-full text-left group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">
                                      {step.title}
                                    </h3>
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                      <Clock className="w-4 h-4" />
                                      {step.estimatedTime}
                                    </div>
                                  </div>
                                  <ChevronDown className="w-5 h-5 transform transition-transform group-data-[state=open]:rotate-180" />
                                </div>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent className="space-y-4 mt-4">
                                {/* Objective */}
                                <div>
                                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Objective</h4>
                                  <p className="text-gray-600 dark:text-gray-400">{step.objective}</p>
                                </div>
                                
                                {/* Suggested Queries */}
                                <div>
                                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested Queries</h4>
                                  <div className="space-y-2">
                                    {step.queries.map((query, qIndex) => (
                                      <div key={qIndex} className="flex items-center justify-between 
                                                                 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                        <code className="text-sm text-purple-600 dark:text-purple-400 flex-1">
                                          {query}
                                        </code>
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(query)}>
                                          <Copy className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Expected Deliverable */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Expected Deliverable</h4>
                                  <p className="text-blue-700 dark:text-blue-400">{step.deliverable}</p>
                                </div>
                                
                                {/* Available Tools */}
                                <div>
                                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Available Tools</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                                      <Globe className="w-3 h-3 mr-1" />
                                      Web Search (Tavily)
                                    </Badge>
                                    <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300">
                                      <FileText className="w-3 h-3 mr-1" />
                                      Summarization
                                    </Badge>
                                  </div>
                                </div>
                                
                                {/* Source Citations */}
                                {step.sources && step.sources.length > 0 && (
                                  <div>
                                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Sources</h4>
                                    <div className="space-y-2">
                                      {step.sources.map((source, sIndex) => (
                                        <a key={sIndex} 
                                           href={source.url} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="block p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                          <div className="flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            <div className="font-medium text-purple-600 dark:text-purple-400">{source.title}</div>
                                          </div>
                                          <div className="text-sm text-gray-500 truncate">{source.url}</div>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Export & Actions Section */}
                  <motion.div 
                    className="flex flex-col md:flex-row gap-4 mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Export Plan</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Download or copy your mission plan for future reference
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" onClick={downloadJSON}>
                        <Download className="w-4 h-4 mr-2" />
                        Download JSON
                      </Button>
                      <Button variant="outline" onClick={downloadMarkdown}>
                        <FileText className="w-4 h-4 mr-2" />
                        Download Markdown
                      </Button>
                      <Button onClick={() => copyToClipboard(JSON.stringify(plan, null, 2))}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

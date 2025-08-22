'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, Lightbulb, Search, FileText, BarChart } from 'lucide-react'
import { toast } from 'sonner'

const missionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters')
})

type MissionFormData = z.infer<typeof missionSchema>

interface MissionFormProps {
  onSubmit?: (mission: { id: string; title: string; description: string }) => void
}

const missionTemplates = [
  {
    icon: Search,
    title: "Market Research",
    description: "Analyze competitors and market trends",
    template: {
      title: "Market Research: [Industry/Product]",
      description: "Research and analyze the top competitors in [industry] and identify their key differentiators, pricing strategies, and market positioning. Create a comprehensive competitive analysis report."
    }
  },
  {
    icon: FileText,
    title: "Content Strategy",
    description: "Research topics and create content plans",
    template: {
      title: "Content Strategy: [Topic/Industry]",
      description: "Research trending topics and content opportunities in [field/industry]. Analyze what content performs well and create a strategic content calendar with recommended topics, formats, and publishing schedule."
    }
  },
  {
    icon: BarChart,
    title: "Technical Analysis",
    description: "Compare technologies and tools",
    template: {
      title: "Technical Comparison: [Technology A] vs [Technology B]",
      description: "Compare [technology A] and [technology B] for [specific use case]. Analyze features, performance, costs, learning curve, and provide implementation recommendations with pros and cons."
    }
  },
  {
    icon: Lightbulb,
    title: "Strategic Planning",
    description: "Business strategy and planning",
    template: {
      title: "Strategic Analysis: [Business Area]",
      description: "Analyze [business area/market segment] and develop strategic recommendations. Research industry trends, identify opportunities and threats, and provide actionable insights for decision-making."
    }
  }
]

export default function MissionForm({ onSubmit }: MissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MissionFormData>({
    resolver: zodResolver(missionSchema),
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const handleSubmit = async (data: MissionFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create mission')
      }

      const mission = await response.json()
      toast.success('Mission created successfully!')
      
      if (onSubmit) {
        onSubmit(mission)
      }

      form.reset()
    } catch (error) {
      console.error('Failed to create mission:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create mission')
    } finally {
      setIsSubmitting(false)
    }
  }

  const applyTemplate = (template: typeof missionTemplates[0]['template']) => {
    form.setValue('title', template.title)
    form.setValue('description', template.description)
  }

  return (
    <div className="space-y-8">
      {/* Mission Templates */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Start Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {missionTemplates.map((template, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
              onClick={() => applyTemplate(template.template)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <template.icon className="h-4 w-4 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">{template.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Research AI testing frameworks and create comparison"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your mission in detail. What do you want to accomplish? What kind of research or analysis do you need? Be specific about your goals and expected deliverables."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Mission...
                  </>
                ) : (
                  'Create Mission'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

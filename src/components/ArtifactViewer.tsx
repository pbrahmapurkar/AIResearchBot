'use client'


import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText, Download, Copy, Eye, Link as LinkIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Artifact {
  id: string
  type: string
  title: string
  content: string
  url?: string
  metadata?: string
  createdAt: string
}

interface ArtifactViewerProps {
  artifacts: Artifact[]
}

export default function ArtifactViewer({ artifacts }: ArtifactViewerProps) {

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'summary':
        return <FileText className="h-4 w-4 text-green-600" />
      case 'note':
        return <FileText className="h-4 w-4 text-yellow-600" />
      case 'file':
        return <FileText className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getArtifactColor = (type: string) => {
    switch (type) {
      case 'report': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'summary': return 'bg-green-100 text-green-800 border-green-200'
      case 'note': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'file': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast.success('Content copied to clipboard')
    }).catch(() => {
      toast.error('Failed to copy content')
    })
  }

  const downloadArtifact = (artifact: Artifact) => {
    const blob = new Blob([artifact.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const parseMetadata = (metadata?: string) => {
    if (!metadata) return null
    try {
      return JSON.parse(metadata)
    } catch {
      return null
    }
  }

  if (artifacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-8 w-8 mx-auto mb-2" />
        <p>No artifacts created yet.</p>
        <p className="text-sm">Artifacts will appear here as the mission progresses.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {artifacts.map((artifact) => {
        const metadata = parseMetadata(artifact.metadata)
        
        return (
          <Card key={artifact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getArtifactIcon(artifact.type)}
                  <span className="font-medium text-gray-900">{artifact.title}</span>
                </div>
                <Badge className={getArtifactColor(artifact.type)}>
                  {artifact.type}
                </Badge>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {formatContent(artifact.content)}
              </p>

              {/* Metadata */}
              {metadata && metadata.sources && (
                <div className="mb-3">
                  <span className="text-xs text-gray-500">
                    Sources: {Array.isArray(metadata.sources) ? metadata.sources.length : 0}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(artifact.createdAt).toLocaleString()}
                </span>
                
                <div className="flex items-center space-x-1">
                  {/* View Full Content */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          {getArtifactIcon(artifact.type)}
                          <span>{artifact.title}</span>
                          <Badge className={getArtifactColor(artifact.type)}>
                            {artifact.type}
                          </Badge>
                        </DialogTitle>
                      </DialogHeader>
                      
                      <div className="mt-4">
                        {/* Metadata Display */}
                        {metadata && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
                            {metadata.sources && Array.isArray(metadata.sources) && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Sources:</span>
                                <ul className="list-disc list-inside ml-2 mt-1">
                                  {metadata.sources.slice(0, 5).map((source: string, index: number) => (
                                    <li key={index}>
                                      <a 
                                        href={source} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        {source}
                                      </a>
                                    </li>
                                  ))}
                                  {metadata.sources.length > 5 && (
                                    <li className="text-gray-500">
                                      +{metadata.sources.length - 5} more sources
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="overflow-y-auto max-h-96 p-4 bg-white border rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                            {artifact.content}
                          </pre>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-end space-x-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(artifact.content)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => downloadArtifact(artifact)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Copy Content */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(artifact.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>

                  {/* Download */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => downloadArtifact(artifact)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>

                  {/* External Link */}
                  {artifact.url && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      asChild
                    >
                      <a 
                        href={artifact.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <LinkIcon className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

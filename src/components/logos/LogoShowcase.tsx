'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MisterPBLogo from './MisterPBLogo'

export default function LogoShowcase() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
          MisterPB.in Logo Design System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Modern, minimal, and professional logo for AI-powered testing and research platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Full Logo Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Full Logo - Horizontal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 items-start">
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="horizontal" size="sm" />
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="horizontal" size="md" />
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="horizontal" size="lg" />
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="horizontal" size="xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Full Logo - Vertical</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 items-center">
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="vertical" size="sm" />
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="vertical" size="md" />
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="vertical" size="lg" />
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <MisterPBLogo variant="vertical" size="xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Icon Only */}
        <Card>
          <CardHeader>
            <CardTitle>Icon Only (Favicon/App Icon)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <MisterPBLogo variant="icon" size="sm" />
              </div>
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <MisterPBLogo variant="icon" size="md" />
              </div>
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <MisterPBLogo variant="icon" size="lg" />
              </div>
              <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                <MisterPBLogo variant="icon" size="xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dark Background Test */}
        <Card>
          <CardHeader>
            <CardTitle>Dark Background Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-6 bg-slate-900 rounded-lg flex items-center justify-center">
                <MisterPBLogo variant="horizontal" size="lg" />
              </div>
              <div className="p-6 bg-gradient-to-r from-blue-900 to-teal-900 rounded-lg flex items-center justify-center">
                <MisterPBLogo variant="horizontal" size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Guidelines */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Usage Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Color Palette</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-teal-500"></div>
                <span className="text-sm">Primary: Blue to Teal Gradient (#0ea5e9 → #14b8a6)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-slate-700"></div>
                <span className="text-sm">Text: Slate Gray (#64748b → #475569)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-white border"></div>
                <span className="text-sm">Icon Details: White (#ffffff)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-900">Typography</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Font: System Sans-serif (Inter/Poppins style)</li>
              <li>• Weight: Bold (700)</li>
              <li>• Tracking: Tight letter spacing</li>
              <li>• Gradient text on light backgrounds</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Code */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Usage:</h4>
              <code className="block p-3 bg-gray-100 rounded text-sm">
                {`<MisterPBLogo variant="horizontal" size="md" />`}
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-2">Icon Only (Favicon):</h4>
              <code className="block p-3 bg-gray-100 rounded text-sm">
                {`<MisterPBLogo variant="icon" size="sm" />`}
              </code>
            </div>
            <div>
              <h4 className="font-medium mb-2">Without Text:</h4>
              <code className="block p-3 bg-gray-100 rounded text-sm">
                {`<MisterPBLogo variant="horizontal" size="lg" showText={false} />`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

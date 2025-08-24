import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Mister PB</h1>
        <p className="text-xl text-gray-600 mb-8">AI-Powered Consumer Insights for Bharat&apos;s Markets</p>
        <Link 
          href="/marketing" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View Our Platform
        </Link>
      </div>
    </div>
  )
}
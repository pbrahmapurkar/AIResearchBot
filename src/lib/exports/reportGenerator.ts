import { jsPDF } from 'jspdf'
import Papa from 'papaparse'

export interface ExportData {
  title: string
  summary: string
  insights: Array<{
    region: string
    sentiment: number
    volume: number
    priceScore: number
    topTerms: string[]
  }>
  sources: Array<{
    url: string
    title: string
    snippet: string
    language: string
    timestamp: string
  }>
  recommendations: string[]
  metadata: {
    generatedAt: string
    timeframe: string
    languages: string[]
    totalSources: number
  }
}

// Generate PDF report
export function generatePDFReport(data: ExportData): Blob {
  const doc = new jsPDF()
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Mister PB Regional Intelligence Report', 20, yPosition)
  
  yPosition += 15
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${data.metadata.generatedAt}`, 20, yPosition)
  
  yPosition += 10
  doc.text(`Timeframe: ${data.metadata.timeframe} | Languages: ${data.metadata.languages.join(', ')}`, 20, yPosition)
  
  yPosition += 20

  // Executive Summary
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', 20, yPosition)
  
  yPosition += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  const summaryLines = doc.splitTextToSize(data.summary, 170)
  doc.text(summaryLines, 20, yPosition)
  yPosition += summaryLines.length * 5 + 10

  // Regional Insights
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Regional Insights', 20, yPosition)
  yPosition += 10

  data.insights.forEach((insight) => {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${insight.region}`, 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Volume: ${insight.volume} | Sentiment: ${(insight.sentiment * 100).toFixed(1)}% | Price Score: ${(insight.priceScore * 100).toFixed(0)}%`, 25, yPosition)
    yPosition += 6

    doc.text(`Top Terms: ${insight.topTerms.slice(0, 5).join(', ')}`, 25, yPosition)
    yPosition += 12
  })

  // Recommendations
  if (yPosition > 200) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Recommendations', 20, yPosition)
  yPosition += 10

  data.recommendations.forEach((rec, idx) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`${idx + 1}. ${rec}`, 25, yPosition)
    yPosition += 8
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Mister PB - AI-Powered Regional Consumer Insights', 20, 285)
    doc.text(`Page ${i} of ${pageCount}`, 170, 285)
  }

  return doc.output('blob')
}

// Generate CSV report
export function generateCSVReport(data: ExportData): Blob {
  const csvData = []

  // Add metadata rows
  csvData.push(['Report Title', data.title])
  csvData.push(['Generated At', data.metadata.generatedAt])
  csvData.push(['Timeframe', data.metadata.timeframe])
  csvData.push(['Languages', data.metadata.languages.join(', ')])
  csvData.push(['Total Sources', data.metadata.totalSources.toString()])
  csvData.push([]) // Empty row

  // Regional insights
  csvData.push(['Regional Insights'])
  csvData.push(['Region', 'Volume', 'Sentiment (%)', 'Price Score (%)', 'Top Terms'])
  
  data.insights.forEach(insight => {
    csvData.push([
      insight.region,
      insight.volume.toString(),
      (insight.sentiment * 100).toFixed(1),
      (insight.priceScore * 100).toFixed(0),
      insight.topTerms.slice(0, 5).join('; ')
    ])
  })

  csvData.push([]) // Empty row

  // Sources
  csvData.push(['Sources'])
  csvData.push(['URL', 'Title', 'Language', 'Snippet', 'Timestamp'])
  
  data.sources.forEach(source => {
    csvData.push([
      source.url,
      source.title,
      source.language,
      source.snippet.slice(0, 100) + (source.snippet.length > 100 ? '...' : ''),
      source.timestamp
    ])
  })

  csvData.push([]) // Empty row

  // Recommendations
  csvData.push(['Recommendations'])
  data.recommendations.forEach((rec, idx) => {
    csvData.push([`${idx + 1}`, rec])
  })

  const csv = Papa.unparse(csvData)
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' })
}

// Generate Bharat Pulse summary (text format)
export function generateBharatPulseSummary(data: ExportData): string {
  const topRegion = data.insights.sort((a, b) => 
    (Math.abs(b.sentiment) * b.volume) - (Math.abs(a.sentiment) * a.volume)
  )[0]

  const avgPriceScore = data.insights.reduce((sum, insight) => 
    sum + insight.priceScore, 0) / data.insights.length

  const summary = `
🇮🇳 BHARAT PULSE - ${data.metadata.generatedAt}

📍 TOP OPPORTUNITY REGION
${topRegion?.region || 'N/A'} - ${topRegion ? (topRegion.sentiment * 100).toFixed(1) : 0}% sentiment, ${topRegion?.volume || 0} mentions

💰 PRICE SENSITIVITY INDEX
${(avgPriceScore * 100).toFixed(0)}/100 - ${avgPriceScore > 0.7 ? 'HIGH' : avgPriceScore > 0.4 ? 'MEDIUM' : 'LOW'} sensitivity detected

🎯 KEY INSIGHTS
${data.insights.slice(0, 3).map(insight => 
  `• ${insight.region}: ${insight.volume} mentions, ${(insight.sentiment * 100).toFixed(1)}% sentiment`
).join('\n')}

📝 IMMEDIATE ACTIONS
${data.recommendations.slice(0, 3).map((rec, idx) => 
  `${idx + 1}. ${rec}`
).join('\n')}

📊 DATA SOURCES
${data.metadata.totalSources} sources across ${data.metadata.languages.join(', ')} languages
Timeframe: ${data.metadata.timeframe}

Generated by Mister PB AI-Powered Regional Intelligence
`.trim()

  return summary
}

// Download helper function
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Copy to clipboard helper
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

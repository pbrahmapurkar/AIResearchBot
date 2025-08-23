import { NextRequest, NextResponse } from 'next/server';

// Mock data for development - replace with actual database queries
const MOCK_REPORT = {
  reportId: "rep_123",
  title: "FMCG — Snacks (Last 7 Days)",
  timeframe: "last_7d",
  status: "READY" as const,
  summary: [
    "Maharashtra shows **342 mentions** with positive sentiment (+0.22) driven by new product launches",
    "Price sensitivity peaked at **78/100** with discount-related chatter increasing 45%",
    "Tamil language discussions dominate with **92 occurrences** of 'discount' keywords",
    "Social media engagement up **23%** compared to previous week across all regions"
  ],
  regions: [
    { id: "MH", name: "Maharashtra", lang: "hi", volume: 342, avgSentiment: 0.22 },
    { id: "TN", name: "Tamil Nadu", lang: "ta", volume: 289, avgSentiment: 0.15 },
    { id: "KA", name: "Karnataka", lang: "kn", volume: 156, avgSentiment: -0.08 },
    { id: "AP", name: "Andhra Pradesh", lang: "te", volume: 134, avgSentiment: 0.31 }
  ],
  sentimentSeries: [
    { date: "2025-08-17", regionId: "MH", avgSentiment: 0.18, volume: 40 },
    { date: "2025-08-18", regionId: "MH", avgSentiment: 0.22, volume: 45 },
    { date: "2025-08-19", regionId: "MH", avgSentiment: 0.25, volume: 52 },
    { date: "2025-08-20", regionId: "TN", avgSentiment: 0.12, volume: 38 },
    { date: "2025-08-21", regionId: "TN", avgSentiment: 0.15, volume: 41 },
    { date: "2025-08-22", regionId: "KA", avgSentiment: -0.05, volume: 28 },
    { date: "2025-08-23", regionId: "AP", avgSentiment: 0.31, volume: 35 }
  ],
  price: {
    score: 78,
    drivers: [
      { 
        quote: "महंगा लग रहा है, discount चाहिए", 
        url: "https://twitter.com/example/status/123", 
        regionId: "MH", 
        lang: "hi" 
      },
      { 
        quote: "Price too high compared to competitors", 
        url: "https://reddit.com/r/snacks/comments/xyz", 
        regionId: "TN", 
        lang: "en" 
      },
      { 
        quote: "ವಿಶೇಷ ಆಫರ್ ಯಾವಾಗ?", 
        url: "https://facebook.com/groups/karnataka/posts/456", 
        regionId: "KA", 
        lang: "kn" 
      }
    ]
  },
  topTerms: [
    { term: "discount", lang: "hi", frequency: 92, regionId: "MH" },
    { term: "offer", lang: "en", frequency: 78, regionId: "TN" },
    { term: "taste", lang: "ta", frequency: 65, regionId: "TN" },
    { term: "price", lang: "en", frequency: 54, regionId: "KA" },
    { term: "quality", lang: "hi", frequency: 43, regionId: "MH" }
  ],
  topPosts: [
    {
      title: "New snack launch review - worth the hype?",
      snippet: "Just tried the new flavor and honestly impressed. Quality has improved but pricing is still an issue...",
      url: "https://reddit.com/r/snacks/comments/new_launch_review",
      lang: "en",
      regionId: "MH",
      timestamp: 1724741210000
    },
    {
      title: "स्नैक्स की कीमत बढ़ने से परेशान उपभोक्ता",
      snippet: "बाजार में स्नैक्स की बढ़ती कीमतों को लेकर उपभोक्ता नाराज हैं...",
      url: "https://news.example.com/hindi/snacks-price-rise",
      lang: "hi",
      regionId: "MH", 
      timestamp: 1724654810000
    },
    {
      title: "சிற்றுண்டி வகைகளில் புதிய சுவை",
      snippet: "தமிழ்நாட்டில் புதிய சுவையுடன் அறிமுகமான சிற்றுண்டி வகைகள்...",
      url: "https://tamil.news.com/snacks-new-flavors",
      lang: "ta",
      regionId: "TN",
      timestamp: 1724568410000
    }
  ],
  sources: [
    {
      url: "https://economictimes.indiatimes.com/industry/cons-products/food/snacks-market-analysis",
      title: "Indian Snacks Market Shows Resilience Despite Price Pressures",
      domain: "economictimes.indiatimes.com",
      lang: "en",
      regionId: "MH"
    },
    {
      url: "https://business-standard.com/article/companies/fmcg-snacks-regional-preferences",
      title: "FMCG Companies Adapt to Regional Taste Preferences",
      domain: "business-standard.com", 
      lang: "en",
      regionId: "TN"
    },
    {
      url: "https://reddit.com/r/india/comments/snacks_discussion_thread",
      title: "Weekly Snacks Discussion Thread - What's Popular?",
      domain: "reddit.com",
      lang: "en",
      regionId: "KA"
    },
    {
      url: "https://twitter.com/FoodNewsIndia/status/1234567890",
      title: "Breaking: Major snack brand announces regional expansion",
      domain: "twitter.com",
      lang: "en", 
      regionId: "AP"
    }
  ],
  recommendations: [
    { text: "Launch targeted discount campaigns in Maharashtra and Tamil Nadu to address price sensitivity concerns", impact: "High" as const },
    { text: "Develop region-specific flavors for Karnataka market based on local taste preferences", impact: "Med" as const },
    { text: "Increase social media engagement in Telugu language for Andhra Pradesh market penetration", impact: "Med" as const },
    { text: "Partner with regional influencers to build authenticity and trust in local markets", impact: "High" as const },
    { text: "Implement premium product line testing in high-sentiment regions first", impact: "Low" as const }
  ],
  files: {
    jsonPath: "/storage/reports/rep_123.json",
    mdPath: "/storage/reports/rep_123.md", 
    pdfPath: "/storage/reports/rep_123.pdf",
    csvPath: "/storage/reports/rep_123.csv"
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get('id');

  if (!reportId) {
    return NextResponse.json(
      { error: 'Report ID is required' },
      { status: 400 }
    );
  }

  // Simulate database lookup
  if (reportId === 'rep_123') {
    return NextResponse.json(MOCK_REPORT);
  }

  // In production, replace with actual database query:
  // const report = await prisma.report.findUnique({
  //   where: { id: reportId },
  //   include: { sources: true }
  // });

  return NextResponse.json(
    { error: 'Report not found' },
    { status: 404 }
  );
}

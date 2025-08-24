# 🚀 Market Research Feature

A production-ready market research system with AI-powered analysis, web search integration, and streaming responses.

## ✨ Features

### 🔍 **Smart Research Brief**
- **Topic Definition**: Detailed research topic input with validation
- **Regional Targeting**: Select from 15 Indian states (Maharashtra, Karnataka, Tamil Nadu, etc.)
- **Language Focus**: Support for 10 Indian languages (Hindi, Marathi, Kannada, Tamil, Telugu, etc.)
- **Timeframe Selection**: 1W, 1M, 3M, 6M, 1Y options
- **Configurable Results**: 5-20 search results per research

### 🤖 **AI-Powered Analysis**
- **Groq Integration**: Primary AI provider with Llama3-8b-8192 model
- **Anthropic Fallback**: Claude-3-5-Sonnet as backup provider
- **Streaming Responses**: Real-time AI generation with progress indicators
- **Citation Extraction**: Automatic source attribution from AI content
- **Structured Output**: Executive summary, insights, regional analysis, recommendations

### 🌐 **Web Search Integration**
- **Tavily API**: Curated web search results
- **Source Validation**: URL verification and content quality scoring
- **Regional Context**: Focus on Indian market sources
- **Multi-language Support**: Vernacular content discovery

### 🛡️ **Production Features**
- **Rate Limiting**: 10 requests per 5 minutes per user
- **Authentication**: Supabase-based user management
- **Input Validation**: Zod schema validation
- **Error Handling**: Graceful degradation and user feedback
- **Streaming**: Server-sent events for real-time updates

## 🏗️ Architecture

### **Frontend Components**
```
src/components/market-research/
├── MarketResearchForm.tsx      # Research brief form
├── MarketResearchResults.tsx   # Results display
└── __tests__/                  # Component tests
```

### **Backend Services**
```
src/lib/ai/
├── market-research.ts          # AI service layer
└── utils/
    └── rate-limit.ts           # Rate limiting utility
```

### **API Routes**
```
src/app/api/market-research/
└── route.ts                    # Main API endpoint
```

### **Types & Schemas**
```
src/types/
└── market-research.ts          # TypeScript types & Zod schemas
```

## 🚀 Quick Start

### **1. Environment Setup**
```bash
# Required environment variables
GROQ_API_KEY="your-groq-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
TAVILY_API_KEY="your-tavily-api-key"
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Run Development Server**
```bash
npm run dev
```

### **4. Access Market Research**
Navigate to `/market-research` in your browser

## 📋 Usage Flow

### **Step 1: Research Brief**
1. **Define Topic**: Enter detailed research question
2. **Select Regions**: Choose 1-10 target states
3. **Choose Languages**: Select 1-5 target languages
4. **Set Timeframe**: Pick analysis period
5. **Configure Results**: Set max search results (5-20)

### **Step 2: AI Analysis**
1. **Web Search**: System searches for relevant sources
2. **Content Analysis**: AI processes search results
3. **Insight Generation**: Real-time streaming of analysis
4. **Citation Extraction**: Automatic source attribution

### **Step 3: Results & Actions**
1. **View Summary**: AI-generated market insights
2. **Browse Sources**: Curated web search results
3. **Download Report**: Export as text file
4. **Copy Content**: Clipboard integration

## 🔧 Configuration

### **AI Providers**
```typescript
// Primary: Groq
model: 'llama3-8b-8192'
temperature: 0.3
max_tokens: 2000

// Fallback: Anthropic
model: 'claude-3-5-sonnet-20241022'
temperature: 0.3
max_tokens: 2000
```

### **Rate Limiting**
```typescript
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,           // 10 requests per window
  windowMs: 300000,          // 5 minute window
  maxGeneral: 100,           // 100 general requests per minute
  generalWindowMs: 60000     // 1 minute window
}
```

### **Search Configuration**
```typescript
const SEARCH_CONFIG = {
  maxResults: 20,            // Maximum search results
  minResults: 5,             // Minimum search results
  searchDepth: 'basic',      // Tavily search depth
  includeAnswer: false,      // No answer generation
  includeRawContent: false   // No raw content
}
```

## 🧪 Testing

### **Unit Tests (Vitest)**
```bash
# Run tests
npm run test

# Run with UI
npm run test:ui
```

### **E2E Tests (Playwright)**
```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

### **Test Coverage**
- Component rendering
- Form validation
- API integration
- User interactions
- Error handling

## 📊 Performance

### **Response Times**
- **Form Submission**: < 100ms
- **Web Search**: 2-5 seconds
- **AI Generation**: 10-30 seconds
- **Streaming Start**: < 1 second

### **Scalability**
- **Rate Limiting**: Per-user IP + userId
- **Memory Usage**: Efficient streaming
- **Database**: Minimal storage requirements
- **Caching**: Future Redis integration ready

## 🔒 Security

### **Authentication**
- Supabase session validation
- User-specific rate limiting
- Protected API endpoints

### **Input Validation**
- Zod schema validation
- XSS protection
- SQL injection prevention

### **API Security**
- Rate limiting
- Request validation
- Error message sanitization

## 🚀 Deployment

### **Vercel Ready**
- Node.js runtime
- Environment variables
- Build optimization
- Edge function support

### **Environment Variables**
```bash
# Production
GROQ_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 🔮 Future Enhancements

### **Planned Features**
- **Database Storage**: Save research history
- **Export Formats**: PDF, Excel, Word
- **Collaboration**: Team research sharing
- **Templates**: Pre-built research briefs
- **Analytics**: Research performance metrics

### **AI Improvements**
- **Multi-modal**: Image and video analysis
- **Custom Models**: Fine-tuned for Indian markets
- **Batch Processing**: Multiple research parallel
- **Real-time Updates**: Live data integration

## 📚 API Reference

### **POST /api/market-research**
```typescript
interface MarketResearchRequest {
  topic: string;           // Research topic (10-500 chars)
  regions: string[];       // Target regions (1-10)
  languages: string[];     // Target languages (1-5)
  timeframe: '1W' | '1M' | '3M' | '6M' | '1Y';
  maxResults: number;      // 5-20 search results
}
```

### **Response Format**
```typescript
interface StreamingChunk {
  type: 'content' | 'citation' | 'search_result' | 'error' | 'complete';
  content?: string;
  citation?: string;
  searchResult?: SearchResult;
  error?: string;
  progress?: number;
}
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

### **Code Standards**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Component testing
- E2E validation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### **Common Issues**
- **Rate Limiting**: Wait 5 minutes between requests
- **AI Errors**: Check API key configuration
- **Search Failures**: Verify Tavily API key
- **Authentication**: Ensure user is logged in

### **Getting Help**
- Check existing issues
- Create new issue with details
- Include error messages
- Provide reproduction steps

---

**Built with ❤️ for Bharat's Markets**

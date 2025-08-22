# 🔧 Mister PB API Setup Guide

Transform your Mister PB platform from mock mode to production-ready with real AI integrations! This guide will help you configure all the necessary API keys and test your setup.

## 🚀 Quick Start

### 1. Environment Configuration

1. **Copy the environment template:**
   ```bash
   cp env.example .env.local
   ```

2. **Enable real APIs in your `.env.local`:**
   ```bash
   NEXT_PUBLIC_ENABLE_REAL_APIS=true
   NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
   ```

### 2. API Provider Setup

Get your API keys from these providers (in order of priority):

#### 🤗 **HuggingFace (FREE - Start Here!)**
- **What it does**: Vernacular sentiment analysis for Hindi/Marathi/Tamil/Telugu
- **Cost**: Free tier with generous limits
- **Setup**: 
  1. Go to [HuggingFace Settings](https://huggingface.co/settings/tokens)
  2. Create a new token with "Read" permissions
  3. Add to `.env.local`: `HUGGINGFACE_API_KEY=your_token_here`

#### ⚡ **Together AI (Cost-Efficient)**
- **What it does**: Fast trend extraction and cultural analysis
- **Cost**: ~$0.0002/1K tokens (very cheap)
- **Setup**:
  1. Go to [Together AI API Keys](https://api.together.xyz/settings/api-keys)
  2. Create account and generate API key
  3. Add to `.env.local`: `TOGETHER_API_KEY=your_key_here`

#### 🔍 **Perplexity AI (Real-time Search)**
- **What it does**: Live web search with citations
- **Cost**: ~$0.001/1K tokens
- **Setup**:
  1. Go to [Perplexity Settings](https://www.perplexity.ai/settings/api)
  2. Generate API key
  3. Add to `.env.local`: `PERPLEXITY_API_KEY=your_key_here`

#### 🧠 **OpenAI (Premium Synthesis)**
- **What it does**: High-quality report synthesis
- **Cost**: ~$0.03/1K tokens (use sparingly)
- **Setup**:
  1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
  2. Create API key (requires billing setup)
  3. Add to `.env.local`: `OPENAI_API_KEY=sk-your_key_here`

## 📋 Complete .env.local Example

```bash
# === AI MODEL PROVIDERS ===
HUGGINGFACE_API_KEY=hf_your_token_here
TOGETHER_API_KEY=your_together_key_here
PERPLEXITY_API_KEY=pplx-your_key_here
OPENAI_API_KEY=sk-your_openai_key_here

# === APPLICATION SETTINGS ===
NEXT_PUBLIC_ENABLE_REAL_APIS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
NODE_ENV=development

# === OPTIONAL RATE LIMITS ===
DAILY_HUGGINGFACE_LIMIT=1000
DAILY_TOGETHER_LIMIT=500
DAILY_PERPLEXITY_LIMIT=100
DAILY_OPENAI_LIMIT=50
```

## 🧪 Testing Your Setup

### 1. Restart Development Server
```bash
npm run dev
```

### 2. Check API Status
Navigate to: `http://localhost:3000/settings`

You should see:
- ✅ Green status for configured providers
- 🔴 Red status for missing API keys
- Provider cards with connection status

### 3. Test Individual APIs
Use the built-in API tester:

```bash
# Test HuggingFace sentiment analysis
curl -X POST http://localhost:3000/api/test-apis \
  -H "Content-Type: application/json" \
  -d '{"provider": "huggingface", "testType": "sentiment"}'

# Test Together AI trend extraction
curl -X POST http://localhost:3000/api/test-apis \
  -H "Content-Type: application/json" \
  -d '{"provider": "together", "testType": "trends"}'

# Test all providers at once
curl -X POST http://localhost:3000/api/test-apis \
  -H "Content-Type: application/json" \
  -d '{"provider": "all", "testType": "full"}'
```

## 💰 Cost Optimization Strategy

### Phase 1: Free Tier (Start Here)
```bash
HUGGINGFACE_API_KEY=your_key  # FREE
# Leave others empty - use mock mode
```
**Cost**: $0/month
**Features**: Vernacular sentiment analysis

### Phase 2: Essential (Recommended)
```bash
HUGGINGFACE_API_KEY=your_key  # FREE
TOGETHER_API_KEY=your_key     # ~$5-10/month
```
**Cost**: ~$5-10/month
**Features**: Sentiment + trend extraction + cultural analysis

### Phase 3: Full Production
```bash
HUGGINGFACE_API_KEY=your_key  # FREE
TOGETHER_API_KEY=your_key     # ~$5-10/month
PERPLEXITY_API_KEY=your_key   # ~$10-20/month
OPENAI_API_KEY=your_key       # ~$20-50/month
```
**Cost**: ~$35-80/month
**Features**: Complete AI-powered insights platform

## 🔍 Troubleshooting

### Common Issues

1. **"Real APIs are disabled"**
   - Check: `NEXT_PUBLIC_ENABLE_REAL_APIS=true` in `.env.local`
   - Restart: `npm run dev`

2. **"API key not configured"**
   - Verify API key format (OpenAI starts with `sk-`, etc.)
   - Check for extra spaces or quotes in `.env.local`

3. **"API request failed"**
   - Check API key permissions and billing
   - Verify provider status pages
   - Check debug logs in browser console

4. **High costs**
   - Monitor usage in `/settings` (when implemented)
   - Set daily limits in `.env.local`
   - Start with free/cheap providers first

### Debug Mode

Enable detailed logging:
```bash
NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
```

Check browser console for detailed API call logs.

## 🌟 Verification Checklist

- [ ] `.env.local` file created with API keys
- [ ] `NEXT_PUBLIC_ENABLE_REAL_APIS=true` set
- [ ] Development server restarted
- [ ] Settings page shows green status for providers
- [ ] API test endpoints return successful responses
- [ ] Insights dashboard loads with real data
- [ ] Research missions work with live APIs

## 🎯 Next Steps

Once your APIs are configured:

1. **Test the Dashboard**: Visit `/insights` to see live sentiment analysis
2. **Try Research Missions**: Use `/research` for multi-model orchestration
3. **Monitor Costs**: Check API usage in `/settings`
4. **Scale Gradually**: Add more providers as needed

## 🆘 Support

If you encounter issues:

1. Check the [Settings page](http://localhost:3000/settings) for configuration status
2. Review browser console for error messages
3. Test individual APIs using the test endpoints
4. Verify API keys on provider websites

---

**🇮🇳 Ready to decode Bharat's consumer voice with real AI power!** 🚀

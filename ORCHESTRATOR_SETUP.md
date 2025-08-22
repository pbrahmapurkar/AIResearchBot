# 🎯 AI Orchestrator System

**Enterprise-grade multi-provider AI orchestration with automatic validation, fallbacks, and real-time search integration.**

## 🚀 **CRITICAL: ORCHESTRATOR VALIDATION PROTOCOL**

Before handling ANY user task, the Orchestrator MUST validate that:

1. **✅ At least ONE AI provider is configured** (OpenAI, Gemini, Cohere, HuggingFace)
2. **✅ Tavily search provider is configured** (required for real-time data)
3. **✅ All configured providers pass health checks**

**If validation fails → Stop and return actionable error. DO NOT PROCEED.**

---

## 🔧 **REQUIRED ENVIRONMENT SETUP**

### **AI Providers (Primary Fallback Sequence)**
```bash
# === REQUIRED: At least ONE AI provider ===

# 1. OpenAI (Primary - Premium quality)
export OPENAI_API_KEY="sk-proj-your_key_here"

# 2. Google Gemini (Secondary - Fast and efficient) 
export GEMINI_API_KEY="AIzaSy_your_key_here"

# 3. Cohere (Tertiary - Enterprise-grade)
export COHERE_API_KEY="your_cohere_key_here"

# 4. HuggingFace (Fallback - Free tier available)
export HF_API_KEY="hf_your_key_here"
```

### **Search Provider (REQUIRED)**
```bash
# === REQUIRED: Real-time search ===
export TAVILY_API_KEY="tvly-dev-your_key_here"
```

---

## ⚡ **ORCHESTRATOR ROUTING RULES**

### **Provider Priority (Automatic Fallback)**
1. **OpenAI** → Premium quality, best reasoning
2. **Gemini** → Fast, efficient, Google-powered  
3. **Cohere** → Enterprise-grade, reliable
4. **HuggingFace** → Free tier, open-source models

### **Task Routing Logic**
- **Default**: Use highest-priority available AI provider
- **Real-time/unstable info**: ALWAYS call Tavily first → then AI synthesis
- **Provider failure**: Automatic fallback to next healthy provider
- **No providers**: Return configuration error immediately

---

## 🏥 **HEALTH CHECK SYSTEM**

The orchestrator runs health checks before processing any task:

### **AI Provider Checks**
- **OpenAI**: `GET /v1/models` 
- **Gemini**: `POST /v1beta/models/gemini-pro:generateContent` (ping test)
- **Cohere**: `POST /v1/generate` (small completion)
- **HuggingFace**: `POST /models/gpt2` (tiny inference)

### **Search Provider Check**
- **Tavily**: `POST /search` (ping query)

### **Validation Rules**
- ✅ **Pass**: All configured providers respond successfully
- ❌ **Fail**: Any configured provider fails health check
- 🔄 **Retry**: Health checks cached for 5 minutes, then re-validated

---

## 🛡️ **PRIVACY & SAFETY PROTOCOLS**

### **API Key Security**
- ❌ **NEVER log raw API keys**
- ✅ **Mask keys in logs**: `sk-proj-****-abcd`
- ✅ **Environment variables only**: No hardcoded keys

### **Citation Requirements**
- ❌ **DO NOT fabricate citations**
- ✅ **Always cite Tavily sources**: `[1] https://example.com`
- ✅ **If Tavily fails**: Clearly state "Real-time data unavailable"

### **Error Handling**
- ✅ **Graceful degradation**: Fallback to next provider
- ✅ **Clear error messages**: "CONFIG ERROR → Missing: OpenAI"
- ✅ **No sensitive data in errors**: Never expose API keys

---

## 🧪 **TESTING THE ORCHESTRATOR**

### **1. Quick Status Check**
```bash
curl http://localhost:3000/api/orchestrator
```

**Expected Response (Healthy):**
```json
{
  "success": true,
  "validation": { "isValid": true, "errors": [] },
  "status": {
    "isValid": true,
    "primaryProvider": "openai",
    "searchProvider": "tavily",
    "healthyProviders": ["openai", "gemini", "tavily"]
  }
}
```

### **2. Test AI Completion**
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Explain quantum computing", "type": "completion"}'
```

### **3. Test Real-time Search**
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Latest AI developments", "type": "search", "requiresRealTime": true}'
```

### **4. Test Fallback System**
```bash
# Temporarily disable OpenAI (remove/comment OPENAI_API_KEY)
# Should automatically fallback to Gemini
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test fallback system"}'
```

---

## 🌐 **LIVE TESTING INTERFACE**

### **Web Interface**
Visit: `http://localhost:3000/orchestrator`

**Features:**
- ✅ **Real-time provider status**: See which APIs are healthy
- ✅ **Interactive testing**: Test completions and searches
- ✅ **Fallback visualization**: Watch automatic provider switching
- ✅ **Performance metrics**: Latency and success rates

---

## 🛠️ **CONFIGURATION EXAMPLES**

### **Minimal Setup (Free)**
```bash
# Only free providers
export HF_API_KEY="hf_your_key_here"
export TAVILY_API_KEY="tvly-dev-your_key_here"
```
**Cost**: $0/month  
**Features**: Basic AI + Real-time search

### **Recommended Setup**
```bash
# Primary + Search + Free fallback
export OPENAI_API_KEY="sk-proj-your_key_here"
export TAVILY_API_KEY="tvly-dev-your_key_here"
export HF_API_KEY="hf_your_key_here"
```
**Cost**: ~$10-30/month  
**Features**: Premium AI + Reliable fallback + Search

### **Enterprise Setup**
```bash
# All providers for maximum reliability
export OPENAI_API_KEY="sk-proj-your_key_here"
export GEMINI_API_KEY="AIzaSy_your_key_here" 
export COHERE_API_KEY="your_cohere_key_here"
export HF_API_KEY="hf_your_key_here"
export TAVILY_API_KEY="tvly-dev-your_key_here"
```
**Cost**: ~$50-100/month  
**Features**: Maximum reliability + Speed + Fallbacks

---

## 🚨 **TROUBLESHOOTING**

### **Common Errors**

**❌ "CONFIG ERROR → No AI providers configured"**
```bash
# Solution: Add at least one AI provider
export OPENAI_API_KEY="sk-your_key_here"
# OR
export HF_API_KEY="hf_your_key_here"
```

**❌ "CONFIG ERROR → Tavily search provider not configured"**
```bash
# Solution: Add Tavily API key
export TAVILY_API_KEY="tvly-dev-your_key_here"
```

**❌ "OpenAI failed health check: HTTP 401"**
```bash
# Solution: Check API key validity
# 1. Verify key format: starts with "sk-"
# 2. Check billing status on OpenAI platform
# 3. Ensure sufficient credits
```

**❌ "All AI providers failed"**
```bash
# Solution: Check each provider individually
# 1. Visit /orchestrator page for detailed status
# 2. Test API keys manually on provider websites
# 3. Check network connectivity and firewalls
```

### **Debug Mode**
```bash
# Enable detailed logging
export NEXT_PUBLIC_ENABLE_DEBUG_MODE=true
export NODE_ENV=development

# Check browser console for detailed logs
```

---

## 📊 **PERFORMANCE METRICS**

### **Expected Latencies**
- **OpenAI**: 1-3 seconds
- **Gemini**: 0.5-2 seconds  
- **Cohere**: 1-2 seconds
- **HuggingFace**: 2-5 seconds
- **Tavily Search**: 0.5-1.5 seconds

### **Success Rates (Target)**
- **Provider Health Checks**: >99%
- **Task Completion**: >95%
- **Fallback Activation**: <5% of requests

---

## ✅ **VALIDATION CHECKLIST**

Before deploying to production:

- [ ] **Environment Variables**: All required keys configured
- [ ] **Health Checks**: All providers passing 
- [ ] **Fallback Testing**: Verified automatic switching
- [ ] **Search Integration**: Tavily working with citations
- [ ] **Error Handling**: Graceful failures with clear messages
- [ ] **Performance**: Latencies within acceptable ranges
- [ ] **Security**: No API keys in logs or error messages
- [ ] **Web Interface**: `/orchestrator` page functional

---

## 🎯 **PRODUCTION DEPLOYMENT**

### **Environment Configuration**
```bash
# Production environment
NODE_ENV=production
NEXT_PUBLIC_ENABLE_REAL_APIS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false

# Required providers
OPENAI_API_KEY=sk-proj-your_production_key
TAVILY_API_KEY=tvly-prod-your_production_key

# Optional fallbacks
GEMINI_API_KEY=your_production_key
COHERE_API_KEY=your_production_key
HF_API_KEY=hf_your_production_key
```

### **Monitoring & Alerts**
- ✅ **Health Check Monitoring**: Alert if any provider fails
- ✅ **Usage Tracking**: Monitor API costs and rate limits
- ✅ **Performance Monitoring**: Track latencies and success rates
- ✅ **Error Alerting**: Immediate notification of orchestrator failures

---

**🎊 Your AI Orchestrator is now ready to intelligently route tasks across multiple providers with enterprise-grade reliability!** 🚀

**Test it live at: `http://localhost:3000/orchestrator`**

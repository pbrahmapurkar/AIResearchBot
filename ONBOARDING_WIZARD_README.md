# Mister PB Onboarding Wizard

A comprehensive, multi-step onboarding wizard that guides new users through setting up their Mister PB account with industry selection, language preferences, regional targeting, and alert configuration.

## 🎯 Overview

The onboarding wizard is designed to capture essential user preferences in a user-friendly, step-by-step process that ensures data quality and provides a smooth user experience. It follows modern SaaS onboarding best practices with smooth animations, clear validation, and intuitive navigation.

## ✨ Features

### 1. **4-Step Progressive Flow**
- **Step 1: Industry Selection** - Choose from 7 major industries with visual icons
- **Step 2: Language Selection** - Select 2-5 languages with quick-select regional packs
- **Step 3: Regional Targeting** - Choose states with smart suggestions based on languages
- **Step 4: Alert Configuration** - Set up monitoring thresholds and notification channels

### 2. **Smart User Experience**
- **Search Functionality** - Find industries and states quickly
- **Quick-Select Packs** - Pre-built language combinations for major regions
- **Smart Suggestions** - Regional recommendations based on language choices
- **Real-time Validation** - Immediate feedback on form completion
- **Progress Tracking** - Visual progress bar with step indicators

### 3. **Professional UI/UX**
- **Smooth Animations** - Framer Motion transitions between steps
- **Responsive Design** - Works perfectly on all device sizes
- **Modern Styling** - Tailwind CSS with consistent design language
- **Interactive Elements** - Hover effects, loading states, and micro-interactions

## 🛠️ Technical Implementation

### **Architecture**
- **React Context** - Centralized state management for the entire wizard
- **TypeScript** - Full type safety and better developer experience
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling with custom components

### **File Structure**
```
src/
├── contexts/
│   └── OnboardingContext.tsx          # State management & business logic
├── app/
│   └── app/
│       └── onboarding/
│           ├── page.tsx               # Main wizard orchestrator
│           ├── ProgressBar.tsx        # Progress indicator component
│           ├── Step1Industry.tsx      # Industry selection step
│           ├── Step2Languages.tsx     # Language selection step
│           ├── Step3Regions.tsx       # Regional targeting step
│           └── Step4Alerts.tsx        # Alert configuration step
```

### **State Management**
The wizard uses a React Context (`OnboardingContext`) that manages:
- Current step (1-4)
- Form data across all steps
- Validation logic
- Navigation functions
- Loading states

## 🎨 Design & UX Features

### **Progress Bar**
- **Visual Indicators** - Numbered circles for each step
- **Progress Bar** - Animated progress indicator
- **Step Labels** - Clear descriptions for each phase
- **Current Step Highlighting** - Active step is clearly marked

### **Step Transitions**
- **Smooth Animations** - Horizontal slide transitions between steps
- **AnimatePresence** - Proper exit animations for smooth UX
- **Loading States** - Visual feedback during API calls
- **Validation Feedback** - Immediate error messages and success states

### **Responsive Design**
- **Mobile-First** - Optimized for small screens
- **Grid Layouts** - Adaptive grids for different screen sizes
- **Touch-Friendly** - Proper touch targets for mobile devices
- **Flexible Spacing** - Consistent spacing across all breakpoints

## 📱 Step-by-Step Breakdown

### **Step 1: Industry Selection**
- **Search Bar** - Filter industries by name
- **Visual Grid** - Industry cards with emoji icons
- **Multi-Selection** - Choose one or more industries
- **Validation** - Requires at least one selection

### **Step 2: Language Selection**
- **Quick-Select Packs** - North, South, West regional packs
- **Individual Selection** - Checkbox-based language selection
- **Smart Limits** - 2-5 languages recommended
- **Visual Feedback** - Selected languages shown as chips

### **Step 3: Regional Targeting**
- **Smart Suggestions** - States recommended based on languages
- **Search Functionality** - Find specific states quickly
- **Bulk Actions** - Add all suggested regions at once
- **Visual Selection** - Clear indication of selected states

### **Step 4: Alert Configuration**
- **Threshold Sliders** - Sentiment and price change thresholds
- **Notification Channels** - Email, push, and SMS options
- **Setup Summary** - Review all selections before completion
- **Completion Action** - Create project and redirect to dashboard

## 🔧 Customization & Extension

### **Adding New Industries**
```typescript
// In OnboardingContext.tsx
const industriesList = [
  // ... existing industries
  { id: 'new-industry', name: 'New Industry', icon: '🆕' },
];
```

### **Adding New Languages**
```typescript
// In OnboardingContext.tsx
const languagesList = [
  // ... existing languages
  { id: 'new-language', name: 'New Language' },
];
```

### **Modifying Validation Rules**
```typescript
// In OnboardingContext.tsx
const validateStep = (step: number): boolean => {
  switch (step) {
    case 1: return formData.industries.length >= 1; // Customize minimum
    case 2: return formData.languages.length >= 2 && formData.languages.length <= 5;
    case 3: return formData.regions.length >= 1;
    case 4: return true;
    default: return false;
  }
};
```

### **Adding New Steps**
1. Create new step component
2. Add to steps array in main wizard
3. Update progress bar labels
4. Add validation logic
5. Update form data interface

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18.18.0 or higher
- Next.js 14+ with App Router
- Tailwind CSS v4
- Framer Motion

### **Installation**
1. Ensure all dependencies are installed
2. Copy the onboarding wizard files to your project
3. Import and use the `OnboardingProvider` in your app
4. Navigate to `/app/onboarding` to see the wizard

### **Usage Example**
```typescript
// In your app layout or page
import { OnboardingProvider } from '@/contexts/OnboardingContext';

export default function AppLayout({ children }) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  );
}
```

## 📊 Data Flow & API Integration

### **Form Data Structure**
```typescript
interface OnboardingData {
  industries: string[];           // Selected industry IDs
  languages: string[];            // Selected language IDs
  regions: string[];              // Selected state IDs
  alerts: {
    sentimentThreshold: number;   // Sentiment change threshold (%)
    priceThreshold: number;       // Price change threshold (%)
    channels: string[];           // Notification channels
  };
}
```

### **API Endpoints**
The wizard integrates with these endpoints:
- `POST /api/projects/default` - Create new project
- `PATCH /api/user/onboarding` - Mark onboarding complete

### **Completion Flow**
1. User completes all steps
2. Form data is validated
3. API call to create project
4. User onboarding marked as complete
5. Redirect to new project dashboard

## 🎭 Animation & Interactions

### **Framer Motion Features**
- **Step Transitions** - Smooth horizontal slides
- **Loading States** - Spinner animations during API calls
- **Hover Effects** - Interactive button and card states
- **Progress Animations** - Animated progress bar updates

### **CSS Transitions**
- **Hover States** - Smooth color and shadow transitions
- **Focus States** - Clear focus indicators for accessibility
- **Loading States** - Smooth opacity and transform changes

## ♿ Accessibility Features

### **Keyboard Navigation**
- **Tab Order** - Logical tab sequence through form elements
- **Enter/Space** - Proper button activation
- **Arrow Keys** - Slider input support

### **Screen Reader Support**
- **Proper Labels** - All form elements have descriptive labels
- **ARIA Attributes** - Progress indicators and form states
- **Error Messages** - Clear validation feedback

### **Visual Indicators**
- **Focus Rings** - Clear focus states for all interactive elements
- **Color Contrast** - WCAG compliant color combinations
- **Icon Labels** - Text alternatives for visual elements

## 🧪 Testing & Quality Assurance

### **Type Safety**
- **TypeScript** - Full type checking for all components
- **Interface Definitions** - Clear contracts for data structures
- **Prop Validation** - Component prop type safety

### **Error Handling**
- **API Errors** - Graceful handling of network failures
- **Validation Errors** - Clear user feedback for invalid inputs
- **Loading States** - Proper loading indicators and disabled states

### **Edge Cases**
- **Empty States** - Handling of no selections
- **Network Issues** - Offline and retry scenarios
- **Browser Compatibility** - Cross-browser support

## 🔮 Future Enhancements

### **Planned Features**
- **Save Progress** - Resume onboarding from any step
- **A/B Testing** - Different flows for different user segments
- **Analytics Integration** - Track user behavior and drop-off points
- **Internationalization** - Support for multiple languages

### **Performance Optimizations**
- **Lazy Loading** - Load step components on demand
- **Code Splitting** - Separate bundles for each step
- **Caching** - Cache user selections and progress

## 📝 Contributing

### **Development Guidelines**
1. **Follow TypeScript** - Use strict typing for all components
2. **Component Structure** - Keep components focused and single-purpose
3. **State Management** - Use context for shared state, local state for UI
4. **Styling** - Use Tailwind utilities with custom CSS for complex components
5. **Testing** - Write tests for business logic and user interactions

### **Code Quality**
- **ESLint** - Follow project linting rules
- **Prettier** - Consistent code formatting
- **Type Safety** - No `any` types, proper interfaces
- **Performance** - Optimize re-renders and animations

## 🐛 Troubleshooting

### **Common Issues**
1. **Context Not Found** - Ensure `OnboardingProvider` wraps the wizard
2. **Animation Issues** - Check Framer Motion version compatibility
3. **Styling Problems** - Verify Tailwind CSS configuration
4. **Type Errors** - Ensure all TypeScript types are properly defined

### **Debug Tips**
- Use React DevTools to inspect context state
- Check browser console for JavaScript errors
- Verify all import paths are correct
- Test on different devices and screen sizes

## 📚 Additional Resources

### **Documentation**
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Context API](https://react.dev/reference/react/createContext)

### **Design Resources**
- [SaaS Onboarding Best Practices](https://www.growthtribe.io/blog/saas-onboarding/)
- [User Experience Design Principles](https://www.nngroup.com/articles/ten-usability-heuristics/)
- [Mobile-First Design](https://www.lukew.com/ff/entry.asp?933)

---

The Mister PB Onboarding Wizard provides a professional, user-friendly experience that effectively captures user preferences while maintaining high engagement and completion rates. It's built with modern web technologies and follows industry best practices for SaaS onboarding flows.

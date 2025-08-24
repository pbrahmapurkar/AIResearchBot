import { render, screen } from '@testing-library/react'
import MarketResearchPage from '../page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('MarketResearchPage', () => {
  it('renders market research form initially', () => {
    render(<MarketResearchPage />)
    
    expect(screen.getByText('Market Research')).toBeInTheDocument()
    expect(screen.getByText('AI-powered consumer insights for Bharat\'s markets')).toBeInTheDocument()
    expect(screen.getByText('Market Research Brief')).toBeInTheDocument()
  })

  it('displays info cards', () => {
    render(<MarketResearchPage />)
    
    expect(screen.getByText('Smart Analysis')).toBeInTheDocument()
    expect(screen.getByText('Regional Focus')).toBeInTheDocument()
    expect(screen.getByText('Vernacular Insights')).toBeInTheDocument()
  })

  it('shows form fields', () => {
    render(<MarketResearchPage />)
    
    expect(screen.getByLabelText(/Research Topic/)).toBeInTheDocument()
    expect(screen.getByText(/Target Regions/)).toBeInTheDocument()
    expect(screen.getByText(/Target Languages/)).toBeInTheDocument()
    expect(screen.getByText(/Timeframe/)).toBeInTheDocument()
  })
})

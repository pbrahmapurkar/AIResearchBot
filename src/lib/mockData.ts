// Simulate API calls for now
export const mockFetchProjects = () => {
  return Promise.resolve([
    {
      id: 'project-1',
      name: 'Tier-2 FMCG Demand Analysis',
      lastUpdated: '2 hours ago',
      regions: ['Uttar Pradesh', 'Bihar', 'Rajasthan'],
      status: 'Running' as const
    },
    {
      id: 'project-2',
      name: 'South India Pricing Strategy',
      lastUpdated: '1 day ago',
      regions: ['Tamil Nadu', 'Karnataka'],
      status: 'Completed' as const
    },
    {
      id: 'project-3',
      name: 'Competitive Landscape - Apparel',
      lastUpdated: '5 days ago',
      regions: ['Maharashtra', 'Gujarat'],
      status: 'Draft' as const
    }
  ]);
};

export const mockFetchProjectMetrics = () => {
  return Promise.resolve({
    sentiment: {
      positive: 65,
      neutral: 22,
      negative: 13
    },
    priceSensitivity: {
      elasticityIndex: 1.8,
      mentionShare: 28,
      trend: [
        { name: 'Wk1', value: 15 },
        { name: 'Wk2', value: 22 },
        { name: 'Wk3', value: 19 },
        { name: 'Wk4', value: 28 }
      ]
    },
    regionalSignals: {
      total: 142,
      regions: {
        'Uttar Pradesh': 42,
        'Bihar': 38,
        'Rajasthan': 27,
        'Maharashtra': 21,
        'West Bengal': 14
      }
    }
  });
};

export const REPORT_COPY = {
  sections: {
    tldr: 'TL;DR',
    regional: 'Regional Sentiment',
    price: 'Price Sensitivity',
    terms: 'Top Terms & Posts',
    sources: 'Sources (Citations)',
    recommendations: 'Recommendations'
  },
  messages: {
    noRegionalData: 'No regional data for this timeframe.',
    noPriceDrivers: 'Not enough price chatter detected.',
    scoresNote: 'Scores normalized −1..+1',
    priceNote: 'Derived from price/offer/discount cues.',
    sourcesCount: (showing: number, total: number) => `Showing ${showing} of ${total} Sources`
  },
  actions: {
    copy: 'Copy',
    exportPdf: 'Export PDF',
    downloadCsv: 'Download CSV',
    copySummary: 'Copy Summary',
    addToPlan: 'Add to Plan',
    retry: 'Retry',
    copyTopTerms: 'Copy top terms'
  },
  toasts: {
    copied: 'Copied to clipboard',
    pdfExported: 'PDF export started',
    csvDownloaded: 'CSV download started',
    summarycopied: 'Summary copied to clipboard'
  }
};

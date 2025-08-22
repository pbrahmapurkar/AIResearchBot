'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardHeader from '../../../components/projects/DashboardHeader';
import MetricsGrid from '../../../components/projects/MetricsGrid';
import ProjectsTable from '../../../components/projects/ProjectsTable';
import EmptyProjectsState from '../../../components/projects/EmptyProjectsState';
import { mockFetchProjects, mockFetchProjectMetrics } from '../../../lib/mockData';

interface Project {
  id: string;
  name: string;
  lastUpdated: string;
  regions: string[];
  status: 'Running' | 'Completed' | 'Draft';
}

interface MetricsData {
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  priceSensitivity: {
    elasticityIndex: number;
    mentionShare: number;
    trend: Array<{ name: string; value: number }>;
  };
  regionalSignals: {
    total: number;
    regions: Record<string, number>;
  };
}

export default function ProjectsDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState<MetricsData | null>(null);

  // Simulate data fetching
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [projectsData, metricsData] = await Promise.all([
          mockFetchProjects(),
          mockFetchProjectMetrics() // Fetches for the first/active project
        ]);
        setProjects(projectsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg font-medium text-slate-600">Loading your insights...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      
      {/* Show metrics if we have at least one project */}
      {projects.length > 0 && metrics && <MetricsGrid metrics={metrics} />}
      
      {/* Conditionally render projects list or empty state */}
      {projects.length > 0 ? (
        <ProjectsTable projects={projects} />
      ) : (
        <EmptyProjectsState />
      )}
    </div>
  );
}

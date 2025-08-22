'use client';

import Link from 'next/link';

const DashboardHeader = () => {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Projects Dashboard</h1>
        <p className="mt-2 text-slate-600">Monitor and manage your consumer insight projects.</p>
      </div>
      <Link
        href="/app/projects/new"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        + New Project
      </Link>
    </div>
  );
};

export default DashboardHeader;

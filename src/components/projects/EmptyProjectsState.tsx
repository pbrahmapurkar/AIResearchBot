'use client';

import Link from 'next/link';
import { FileSearch } from 'lucide-react';

const EmptyProjectsState = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <FileSearch className="h-16 w-16 text-slate-400" />
      <h3 className="mt-4 text-lg font-semibold text-slate-900">No projects yet</h3>
      <p className="mt-2 text-slate-600">
        Create your first project to start uncovering consumer insights in regional markets.
      </p>
      <Link
        href="/app/projects/new"
        className="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        + Create First Project
      </Link>
    </div>
  );
};

export default EmptyProjectsState;

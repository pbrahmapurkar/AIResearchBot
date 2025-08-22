'use client';

import Link from 'next/link';
import { MoreHorizontal, Eye, Edit, Trash2, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  name: string;
  lastUpdated: string;
  regions: string[];
  status: 'Running' | 'Completed' | 'Draft';
}

interface StatusBadgeProps {
  status: Project['status'];
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles = {
    Running: 'bg-green-100 text-green-800',
    Completed: 'bg-blue-100 text-blue-800',
    Draft: 'bg-yellow-100 text-yellow-800',
  };
  
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

interface ProjectsTableProps {
  projects: Project[];
}

const ProjectsTable = ({ projects }: ProjectsTableProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Your Projects</h2>
          {/* Future: Add Sort/Filter Dropdowns here */}
        </div>
      </div>
      <div className="divide-y divide-slate-200">
        {projects.map((project) => (
          <div key={project.id} className="transition-colors hover:bg-slate-50">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Project Info */}
              <div className="flex flex-1 items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/app/projects/${project.id}`} className="block">
                    <h3 className="truncate text-lg font-medium text-blue-600 hover:text-blue-800">
                      {project.name}
                    </h3>
                  </Link>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Updated {project.lastUpdated}
                    </div>
                    <span>•</span>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {project.regions.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-4">
                <StatusBadge status={project.status} />
                
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === project.id ? null : project.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeDropdown === project.id && (
                    <div className="absolute right-0 z-10 mt-1 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                      <Link
                        href={`/app/projects/${project.id}`}
                        className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Eye className="mr-2 h-4 w-4" /> View
                      </Link>
                      <button className="flex w-full items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </button>
                      <button className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-slate-100">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTable;

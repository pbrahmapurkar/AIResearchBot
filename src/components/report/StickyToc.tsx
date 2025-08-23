"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StickyTocProps {
  sections: Array<{ id: string; title: string }>;
}

export function StickyToc({ sections }: StickyTocProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="sticky top-8 hidden lg:block">
      <Card className="w-64">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Contents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {sections.map(({ id, title }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === id
                  ? 'bg-blue-100 text-blue-900 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {title}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

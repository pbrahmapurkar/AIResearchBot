"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Copy } from "lucide-react";
import { TopTerm, TopPost } from "@/types/report";
import { REPORT_COPY } from "@/copy/report";

interface ReportTermsPostsProps {
  topTerms: TopTerm[];
  topPosts: TopPost[];
  onCopyTerms: () => void;
}

export function ReportTermsPosts({ topTerms, topPosts, onCopyTerms }: ReportTermsPostsProps) {
  const [selectedLang, setSelectedLang] = useState<string>("all");
  
  const languages = Array.from(new Set([...topTerms.map(t => t.lang), ...topPosts.map(p => p.lang)]));
  
  const filteredTerms = selectedLang === "all" 
    ? topTerms 
    : topTerms.filter(t => t.lang === selectedLang);
    
  const filteredPosts = selectedLang === "all" 
    ? topPosts 
    : topPosts.filter(p => p.lang === selectedLang);

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">{REPORT_COPY.sections.terms}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Language Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select value={selectedLang} onValueChange={setSelectedLang}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filteredTerms.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyTerms}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              {REPORT_COPY.actions.copyTopTerms}
            </Button>
          )}
        </div>

        {/* Top Terms */}
        {filteredTerms.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Top Terms</h4>
            <div className="flex flex-wrap gap-2">
              {filteredTerms.map((term, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                >
                  {term.term} ({term.frequency})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Top Posts */}
        {filteredPosts.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Top Posts</h4>
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-2">{post.title}</h5>
                        <p className="text-gray-600 text-sm mb-3">{post.snippet}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {post.lang.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.regionId}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-2 flex-shrink-0"
                      >
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Open post link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredTerms.length === 0 && filteredPosts.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            No terms or posts found for selected language.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, FileText, Users, Globe, Target } from 'lucide-react';
import Link from 'next/link';

export default async function AppHome() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options, maxAge: 0 });
        },
      },
    }
  );
  
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to generate insights and analyze your data?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Generate Report
            </CardTitle>
            <CardDescription>
              Create a new AI-powered consumer insights report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/app/reports">Start Analysis</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              View Projects
            </CardTitle>
            <CardDescription>
              Manage your research projects and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/projects">Browse Projects</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Browse Reports
            </CardTitle>
            <CardDescription>
              Access your completed reports and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/reports">View Reports</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Market Insights
            </CardTitle>
            <CardDescription>
              Explore regional trends and consumer behavior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/insights">Explore Insights</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Regional Setup
            </CardTitle>
            <CardDescription>
              Configure your target regions and languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/settings">Configure</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-red-600" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/settings">Manage Profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Your Dashboard Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-600">Completed Reports</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-sm text-gray-600">Total Insights</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600">Pending Tasks</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  Briefcase, 
  FileText, 
  Users, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { jobService, applicationService, userService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Job, Application, User } from '@/types';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Mon', applications: 40, active_jobs: 24 },
  { name: 'Tue', applications: 30, active_jobs: 25 },
  { name: 'Wed', applications: 55, active_jobs: 26 },
  { name: 'Thu', applications: 27, active_jobs: 26 },
  { name: 'Fri', applications: 48, active_jobs: 27 },
  { name: 'Sat', applications: 23, active_jobs: 28 },
  { name: 'Sun', applications: 34, active_jobs: 28 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = "blue" }: any) => (
  <Card className="border border-slate-200 shadow-sm bg-white rounded-2xl overflow-hidden group hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</CardTitle>
      <div className={cn(
        "p-2 rounded-xl transition-colors",
        color === "blue" ? "bg-blue-50 text-blue-600" : 
        color === "red" ? "bg-red-50 text-red-600" : 
        "bg-slate-50 text-slate-600"
      )}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
      <div className="flex items-center gap-1 mt-2">
        {trend === 'up' ? (
          <span className="text-[10px] font-bold text-emerald-500">{trendValue}</span>
        ) : (
          <span className="text-[10px] font-bold text-rose-500">{trendValue}</span>
        )}
        <span className="text-[10px] text-slate-400 font-medium tracking-tight">from last month</span>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  const { data: jobs } = useQuery<Job[]>({ queryKey: ['jobs'], queryFn: jobService.getAll as any });
  const { data: applications } = useQuery<Application[]>({ queryKey: ['applications'], queryFn: applicationService.getAll as any });
  const { data: talentPool } = useQuery<User[]>({ queryKey: ['talent'], queryFn: userService.getAll as any });

  const { profile } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Here's what's happening with Detectify Jobs today.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Active Listings" 
          value={jobs?.length || 24} 
          icon={Briefcase} 
          trend="up" 
          trendValue="+5"
          color="blue"
        />
        <StatCard 
          title="Applications Received" 
          value={applications?.length || 156} 
          icon={FileText} 
          trend="up" 
          trendValue="+12%"
          color="blue"
        />
        <StatCard 
          title="Talent Pool" 
          value={talentPool?.length || 842} 
          icon={Users} 
          trend="up" 
          trendValue="+28"
          color="blue"
        />
        <StatCard 
          title="Interview Rate" 
          value="32%" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="+2.4%"
          color="blue"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">Recent Applications</CardTitle>
            </div>
            <Button variant="link" size="sm" className="text-blue-600 font-bold text-xs p-0 h-auto">View All</Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-auto">
            <div className="min-w-[600px]">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-50">
                  <tr className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                    <th className="px-6 py-4">Application ID</th>
                    <th className="px-6 py-4">Candidate</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Job Applied</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-600">
                  {applications?.slice(0, 5).map((app) => (
                    <tr key={app.application_id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#APP-{app.application_id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {app.user ? `${app.user.first_name} ${app.user.last_name}` : `Candidate ${app.user_id}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold",
                          app.status === 'Offered' ? "bg-green-100 text-green-700" :
                          app.status === 'Applied' ? "bg-amber-100 text-amber-700" :
                          "bg-blue-100 text-blue-700"
                        )}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">
                        {app.job?.title || 'Position'}
                      </td>
                    </tr>
                  )) || (
                    [1,2,3,4,5].map(i => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">#APP-902{i}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">Candidate {i}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">In Review</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">Software Intern</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="border-b border-slate-50 pb-4">
            <CardTitle className="text-base font-bold text-slate-900">Smart Match Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
             <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl group hover:bg-blue-100/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                   <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-blue-900">High Score Match</p>
                   <p className="text-[10px] leading-relaxed text-blue-700">Alice Smith matches 98% of "Senior React Developer" requirements.</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl group hover:bg-amber-100/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                   <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-amber-900">Expiring Listing</p>
                   <p className="text-[10px] leading-relaxed text-amber-700">The "Frontend Intern" listing at Google expires in 48 hours. Extend now?</p>
                </div>
             </div>
             <div className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                   <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <div className="space-y-1">
                   <p className="text-xs font-bold text-slate-800">New Category Added</p>
                   <p className="text-[10px] leading-relaxed text-slate-500">"AI Safety Research" category added to the platform.</p>
                </div>
             </div>
          </CardContent>
          <div className="p-6 pt-0 mt-auto">
            <Button className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-lg transition-transform active:scale-95">
              Manage Listings
            </Button>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Platform Growth</CardTitle>
            <CardDescription className="text-xs font-medium text-slate-400">Weekly application activity</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Applications</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 rounded-full text-xs font-bold px-4 border-slate-200">Export Report</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#2563eb" fillOpacity={1} fill="url(#colorApps)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

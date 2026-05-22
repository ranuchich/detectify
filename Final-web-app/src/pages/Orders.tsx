import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Download, 
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  User
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/services/api';
import { Application } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusConfig = {
  'Applied': { label: 'Applied', icon: Clock, className: 'bg-amber-100 text-amber-700' },
  'Reviewing': { label: 'Reviewing', icon: Clock, className: 'bg-blue-100 text-blue-700' },
  'Interview': { label: 'Interview', icon: Zap, className: 'bg-purple-100 text-purple-700' },
  'Offered': { label: 'Offered', icon: CheckCircle2, className: 'bg-green-100 text-green-700' },
  'Rejected': { label: 'Rejected', icon: XCircle, className: 'bg-red-100 text-red-700' },
};

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 12 2.15l.92 1.92L12 14.71l8-12.56-.92-1.92Z" />
      <path d="m12 14.71 8-12.56-.92-1.92L12 14.71l-8-12.56.92 1.92Z" />
    </svg>
  )
}

export const Orders: React.FC = () => {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: applicationService.getAll as any,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search applications..." className="pl-9 bg-white rounded-xl border-slate-200 h-10 text-sm focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white rounded-xl h-10 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl h-10 px-5 text-xs font-bold shadow-lg shadow-blue-600/20 uppercase tracking-wider">
            <Plus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-white p-6">
           <CardTitle className="text-base font-bold text-slate-900">Recent Applications</CardTitle>
           <CardDescription className="text-xs font-medium text-slate-400">Track and manage student applications and the hiring funnel.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">ID</th>
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">Candidate</th>
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left text-center">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">Job / Industry</th>
                <th className="px-6 py-4 text-right text-[10px] uppercase text-slate-400 font-bold tracking-widest">Actions</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="h-16 animate-pulse bg-slate-50/50" />
                  </TableRow>
                ))
              ) : !applications || applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                      <Clock className="h-10 w-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No applications found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app) => {
                  const status = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.Applied;
                  return (
                    <TableRow key={app.application_id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">#APP-{app.application_id}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-700">
                          {new Date(app.applied_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                             <User className="h-3.5 w-3.5" />
                           </div>
                           <div className="text-xs font-bold text-slate-900">
                            {app.user ? `${app.user.first_name} ${app.user.last_name}` : `User ${app.user_id}`}
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          status.className
                        )}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-700">
                          {app.job?.title || 'Unknown Position'}
                        </div>
                        <div className="text-[10px] text-slate-400">{app.job?.location || 'Remote'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-slate-100">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-xl">
                            <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                              <Eye className="h-3.5 w-3.5" /> Review Application
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                              <Download className="h-3.5 w-3.5" /> Download Resume
                            </DropdownMenuItem>
                            <div className="h-px bg-slate-100 my-1" />
                            <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold text-rose-600 focus:text-rose-600 p-2.5">
                              <Trash2 className="h-3.5 w-3.5" /> Reject Candidate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone,
  User,
  MapPin,
  GraduationCap,
  History
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/api';
import { User as UserType } from '@/types';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

export const Customers: React.FC = () => {
  const { data: users, isLoading } = useQuery<UserType[]>({ 
    queryKey: ['talent-pool'], 
    queryFn: userService.getAll as any
  });

  const students = users?.filter(u => u.role === 'student') || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search candidates or skills..." className="pl-9 bg-white rounded-xl border-slate-200 h-10 text-sm focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white rounded-xl h-10 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Advanced Search
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-white p-6">
           <CardTitle className="text-base font-bold text-slate-900">Talent Pool</CardTitle>
           <CardDescription className="text-xs font-medium text-slate-400">Discover and manage candidates looking for internships and jobs.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Candidate</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Contact Information</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Education/Role</TableHead>
                <TableHead className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest">Match Score</TableHead>
                <TableHead className="px-6 py-4 text-right text-[10px] uppercase text-slate-400 font-bold tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                      <User className="h-10 w-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No candidates found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.user_id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{student.first_name} {student.last_name}</div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400">
                            <MapPin className="h-3 w-3" />
                            Bangkok, Thailand
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {student.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          +66 2xxx xxxx
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                             <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                             Computer Science Student
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium ml-5">Year 3 • GPA 3.85</div>
                       </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                       <div className="flex flex-col gap-1.5 min-w-[100px]">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                             <span className="text-blue-600">AI Score</span>
                             <span className="text-slate-900">85%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 rounded-full w-[85%]" />
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreVertical className="h-4 w-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200">
                          <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                            <User className="h-3.5 w-3.5" /> View Full Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                            <History className="h-3.5 w-3.5" /> Application History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5 text-blue-600">
                            <Mail className="h-3.5 w-3.5" /> Send Invitation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

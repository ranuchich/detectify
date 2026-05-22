import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Mail, 
  Shield, 
  Edit, 
  Trash2,
  UserCircle,
  BadgeCheck,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/api';
import { User as UserType } from '@/types';
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

const roleConfig = {
  admin: { label: 'Administrator', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  company: { label: 'Company Partner', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  student: { label: 'Student', className: 'bg-green-100 text-green-700 border-green-200' },
};

export const Employees: React.FC = () => {
  const { data: users, isLoading } = useQuery<UserType[]>({
    queryKey: ['employees'],
    queryFn: userService.getAll as any,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search team members..." className="pl-9 bg-white rounded-xl border-slate-200 h-10 text-sm focus:ring-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-white rounded-xl h-10 border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl h-10 px-5 text-xs font-bold shadow-lg shadow-blue-600/20 uppercase tracking-wider">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 bg-white p-6">
           <CardTitle className="text-base font-bold text-slate-900">Internal Team</CardTitle>
           <CardDescription className="text-xs font-medium text-slate-400">Manage internal user accounts and access control levels.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">Member</th>
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">Role</th>
                <th className="px-6 py-4 text-[10px] uppercase text-slate-400 font-bold tracking-widest text-left">Joined</th>
                <th className="px-6 py-4 text-right text-[10px] uppercase text-slate-400 font-bold tracking-widest">Actions</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="h-16 animate-pulse bg-slate-50/50" />
                  </TableRow>
                ))
              ) : !users || users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 opacity-50">
                      <UserCircle className="h-10 w-10 text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">No team members found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.filter(u => u.role !== 'student').map((user) => {
                  const role = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.company;
                  return (
                    <TableRow key={user.user_id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs overflow-hidden">
                             {(user.first_name || 'U').charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {user.first_name} {user.last_name}
                              {user.role === 'admin' && <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">USER_#{user.user_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                          role.className
                        )}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
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
                              <Edit className="h-3.5 w-3.5" /> Edit Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold p-2.5">
                              <Shield className="h-3.5 w-3.5" /> Reset Password
                            </DropdownMenuItem>
                            <div className="h-px bg-slate-100 my-1" />
                            <DropdownMenuItem className="flex items-center gap-2 text-xs font-bold text-rose-600 focus:text-rose-600 p-2.5">
                              <Trash2 className="h-3.5 w-3.5" /> Deactivate Account
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
